# Copy-to-Any-Project AI Core

This directory is designed to be copied into another repository and handed to Codex as a reusable implementation source.

## Contract

The copied core contains:

1. immutable Doable runtime source;
2. dependency-closure source;
3. exact/reference UI source;
4. host-neutral contracts;
5. adapter examples and capability maps;
6. feature manifests telling Codex exactly which source boundaries implement each capability;
7. verification and external-dependency manifests.

Codex should **reuse the copied implementation source instead of recreating the feature from memory**.

## Recommended workflow

Copy the entire `ai-platform-core/` directory into the target project, then ask Codex for a specific capability.

Example:

> Implement complete integrations from `ai-platform-core/capabilities/integrations/MANIFEST.md`. Use the referenced Doable source as the implementation source. Preserve the Doable behavior and interaction model, but adapt authentication, tenancy, persistence, secrets, routing, UI framework and styling to this project. Do not modify the immutable source copy. First inspect the manifest and dependency map, then implement all required runtime, API, persistence, security and UI pieces, and finish with tests.

For multi-provider support:

> Implement complete multi-provider AI support from `ai-platform-core/capabilities/multi-provider/MANIFEST.md`. Reuse all referenced source and dependency-closure code. Include provider registry/catalog, credentials, model discovery, resolution, validation, runtime selection, chat integration, settings UI and error/reconnect states. Adapt only the host-specific boundaries.

## Important

The feature manifests are not partial examples. They are dependency maps into the complete captured core. If a manifest references a directory, Codex must inspect that directory recursively and follow its imports before deciding what can be omitted.

Do not copy only one TypeScript file and assume the feature is complete.

## Immutable rule

Never edit, reformat, rename, optimize or fix files under:

- `doable-source/`
- `dependency-closure/`
- captured `ui-reference/` source

Create host adapters outside those directories.

## UI rule

The UI reference is implementation/reference material, not a requirement to reproduce Doable's visual theme. Preserve capability, information architecture, interaction behavior and state coverage while adapting components to the target project's design system.

## Feature selection

Available capability manifests:

- `capabilities/multi-provider/MANIFEST.md`
- `capabilities/agents/MANIFEST.md`
- `capabilities/tools/MANIFEST.md`
- `capabilities/integrations/MANIFEST.md`
- `capabilities/mcp/MANIFEST.md`
- `capabilities/skills/MANIFEST.md`
- `capabilities/chat/MANIFEST.md`
- `capabilities/context-memory/MANIFEST.md`
- `capabilities/workspace-sandbox/MANIFEST.md`
- `capabilities/ui/MANIFEST.md`

Use the smallest capability manifest that satisfies the requested feature, then follow its shared dependency references.

## Verification

Run the extraction verifier before using the core:

```bash
node ai-platform-core/verification/verify-extraction.mjs
```

The verifier includes the dependency-inventory gate. The dependency inventory can also be checked directly without rewriting it:

```bash
node ai-platform-core/external-dependencies/verify-external-dependencies.mjs
```

Do not begin host adapter implementation until the extraction verifier passes. A passing extraction gate proves source/package structure and immutable provenance; it does not claim that the target project's runtime build, database, credentials, providers or end-to-end integrations are already configured.

The verifier checks required structure, key entrypoints, manifest consistency and the immutable source boundary. When run inside the original Git checkout it also verifies the captured Git tree SHAs.
