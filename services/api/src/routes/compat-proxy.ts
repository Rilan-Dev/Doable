/**
 * OpenAI-compatibility stream normalizer.
 *
 * Some OpenAI-compatible gateways emit an SSE "keepalive" chunk while they
 * wait on the upstream model's first byte — a syntactically valid
 * chat.completion.chunk carrying an empty delta, a null finish_reason, and
 * crucially an `id`/`model` of its own (OmniRoute uses
 * `chatcmpl-keepalive` / `keepalive`, fired after 2s). They do this because
 * a bare SSE comment (`: keepalive`) is dropped by naive line-based clients
 * and some HTTP clients time out waiting for first byte.
 *
 * The OpenAI streaming contract says every chunk of one completion shares a
 * single `id`. The Copilot CLI honours that: it groups chunks by id, so a
 * keepalive reads as a SECOND completion which never receives a
 * finish_reason. The CLI then fails the stream with
 *
 *     StreamingErrorRetryProcessor: Non-API error detected:
 *     missing finish_reason for choice 0
 *
 * retries ~6 times, aborts each stream, and surfaces "Unknown error" — the
 * turn produces no content and no tool calls. It only bites on slow
 * requests (large tool sets / long prompts) because the keepalive is only
 * emitted once the wait exceeds the gateway's threshold, which is why small
 * test requests against the same gateway look perfectly healthy.
 *
 * This proxy forwards requests untouched and filters those information-free
 * chunks out of the response stream. Unlike gemini-proxy.ts it rewrites
 * nothing in the request — the gateways this serves accept the SDK's
 * parameters fine; the problem is purely the response shape.
 */

import { Hono } from "hono";

export const compatProxyRoutes = new Hono({ strict: false });

/** Upstream base is base64url-encoded into the path so one route serves any provider. */
export function encodeUpstream(baseUrl: string): string {
  return Buffer.from(baseUrl, "utf8").toString("base64url");
}
function decodeUpstream(token: string): string | null {
  try {
    const url = Buffer.from(token, "base64url").toString("utf8");
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return url.replace(/\/$/, "");
  } catch {
    return null;
  }
}

/**
 * True when a streamed chunk carries no information at all.
 *
 * Deliberately narrow so nothing meaningful is ever dropped:
 *   - a terminal chunk has a finish_reason            -> kept
 *   - an opening chunk has delta.role                 -> kept
 *   - a usage chunk (stream_options.include_usage)    -> kept
 *   - `choices: []` (usage-only shape)                -> kept
 * Only a single choice with an empty delta AND no finish_reason is dropped,
 * which is exactly the keepalive shape and is a no-op for any compliant
 * client regardless of which gateway produced it.
 */
function isNoOpChunk(payload: string): boolean {
  let parsed: unknown;
  try {
    parsed = JSON.parse(payload);
  } catch {
    return false; // not JSON — never drop
  }
  if (typeof parsed !== "object" || parsed === null) return false;
  const obj = parsed as Record<string, unknown>;
  if (obj.usage != null) return false;
  const choices = obj.choices;
  if (!Array.isArray(choices) || choices.length !== 1) return false;
  const choice = choices[0] as Record<string, unknown> | undefined;
  if (!choice) return false;
  if (choice.finish_reason != null) return false;
  const delta = choice.delta;
  if (delta == null) return true;
  if (typeof delta !== "object") return false;
  return Object.keys(delta as Record<string, unknown>).length === 0;
}

/**
 * Strip no-op chunks from an SSE byte stream.
 *
 * Buffers by line because a chunk boundary can split an SSE frame; anything
 * that is not a `data:` line (comments, blank separators, `[DONE]`) is
 * forwarded untouched.
 */
function filterKeepalives(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  let dropped = 0;

  return body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        // Keep the trailing partial line in the buffer.
        const lastNewline = buffer.lastIndexOf("\n");
        if (lastNewline === -1) return;
        const ready = buffer.slice(0, lastNewline + 1);
        buffer = buffer.slice(lastNewline + 1);

        let out = "";
        for (const line of ready.split("\n")) {
          if (!line.startsWith("data:")) {
            out += line + "\n";
            continue;
          }
          const payload = line.slice(5).trim();
          if (payload !== "[DONE]" && isNoOpChunk(payload)) {
            dropped++;
            continue; // drop the frame's data line
          }
          out += line + "\n";
        }
        if (out) controller.enqueue(encoder.encode(out));
      },
      flush(controller) {
        if (buffer) controller.enqueue(encoder.encode(buffer));
        if (dropped > 0) {
          console.log(`[CompatProxy] dropped ${dropped} no-op/keepalive chunk(s)`);
        }
      },
    }),
  );
}

compatProxyRoutes.all("/:upstream/*", async (c) => {
  const token = c.req.param("upstream");
  const upstream = decodeUpstream(token);
  if (!upstream) return c.json({ error: { message: "Invalid upstream", type: "proxy_error" } }, 400);

  const subPath = c.req.path.replace(new RegExp(`^/__compat-proxy/${token}`), "");
  const search = new URL(c.req.url).search;
  const targetUrl = `${upstream}${subPath}${search}`;

  const headers: Record<string, string> = {};
  for (const h of ["authorization", "content-type", "x-api-key", "api-key", "accept"]) {
    const v = c.req.header(h);
    if (v) headers[h] = v;
  }

  const method = c.req.method;
  const init: RequestInit = { method, headers };
  if (method !== "GET" && method !== "HEAD") {
    init.body = await c.req.text();
  }

  let resp: Response;
  try {
    resp = await fetch(targetUrl, init);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[CompatProxy] upstream fetch failed:", msg);
    return c.json({ error: { message: `Proxy error: ${msg}`, type: "proxy_error" } }, 502);
  }

  const contentType = resp.headers.get("content-type") ?? "application/json";
  const isSse = contentType.includes("text/event-stream");

  if (!isSse || !resp.body) {
    const text = await resp.text();
    return new Response(text, { status: resp.status, headers: { "content-type": contentType } });
  }

  return new Response(filterKeepalives(resp.body), {
    status: resp.status,
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache",
      connection: "keep-alive",
    },
  });
});
