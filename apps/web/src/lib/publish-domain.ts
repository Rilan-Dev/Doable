/**
 * Apex domain that published projects are served from.
 *
 * Self-hosted installs set DOABLE_DOMAIN; docker-compose forwards it as
 * NEXT_PUBLIC_PUBLISH_DOMAIN, and the web entrypoint swaps the build-time
 * placeholder for the real value (same mechanism as NEXT_PUBLIC_API_URL).
 * The hosted product leaves it unset and keeps the doable.me default.
 *
 * The `__DOABLE_` guard matters: when the placeholder has NOT been
 * substituted (bare `next dev`, or a bundle served before the entrypoint
 * ran) we must not render the raw token to the user.
 */
const RAW = process.env.NEXT_PUBLIC_PUBLISH_DOMAIN;

export const PUBLISH_DOMAIN =
  RAW && RAW.trim() && !RAW.startsWith("__DOABLE_") ? RAW.trim() : "doable.me";

/** Hostname a project's production deploy is served from. */
export function projectHostname(slug: string): string {
  return `${slug}.${PUBLISH_DOMAIN}`;
}

/** Hostname a project's preview deploy is served from. */
export function previewHostname(slug: string): string {
  return `preview-${slug}.${PUBLISH_DOMAIN}`;
}
