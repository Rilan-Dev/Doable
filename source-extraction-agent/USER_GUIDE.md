# User Guide — prompts, agents, memory and handoffs

## Start every session with this instruction
“Read source-extraction-agent/README.md, AGENTS.md, EXTRACTION_RULES.md, EXTRACTION_AGENT_SPEC.md, USER_GUIDE.md, TARGET_PROJECT_STATE.md, project-control/NEXT_ACTION.md, VERIFICATION_STATE.md, and project-control/WORKLOG.md. Also inspect this repository's existing project-control docs, plans, sessions, manifests, issues, risks, and decisions. Recover the latest real checkpoint and continue the next safe action. Do not repeat completed work or remove history.”

## Provide the task inputs
- Upstream repository URL and requested branch/tag/commit (never guess a missing source identity).
- Capabilities/features to reuse and intended host projects.
- Desired package root and whether the task is inventory-only or includes exact copy/verification.
- Available local checkout/tool access and license/redistribution constraints.
- Existing extraction branch, latest known checkpoint, and prior evidence paths.

## Recommended stage-by-stage prompts
1. “Recover the existing checkpoint. Report completed, pending, blocked, and awaiting-evidence items; do not modify files yet.”
2. “Pin upstream commit and root tree, inspect license and repository guidance, and map architecture without changing source.”
3. “Inventory all capabilities, including non-AI services, UI, data, runtime and scripts. Trace business rules with paths/symbols.”
4. “Run a separate dependency-closure pass and independent second-pass discovery. Reconcile every finding and exclusion.”
5. “Present evidence and risks for the discovery/copy gate. Do not copy until the controller authorizes it.”
6. “After authorization and gate PASS, copy complete first-party source trees byte-for-byte, preserving modes/symlinks and Git object identity.”
7. “Run the actual verifier against the pinned source checkout and captured output. Record exact command, exit code, raw output and artifacts.”
8. “Append worklog, update current phase/next action/verification state/continuity and hand off. Preserve all historical work.”

## Roles
- Investigator: architecture, capability, business-logic, UI and dependency evidence.
- Exact-copy implementer: performs immutable copy only after gate authorization.
- Independent verifier/reconciler: checks missing/extra files, hashes, closure and second-pass results.
- Controller/reviewer: reviews evidence and alone declares PASS.
If only one agent is available, run these as separate passes and identify which pass produced each artifact. Do not self-certify a gate in the same pass that produced the inventory.

## Memory model
The repository is the durable memory. Git objects and raw evidence outrank narrative summaries. TARGET_PROJECT_STATE stores repository-specific facts; WORKLOG is chronological and append-only; NEXT_ACTION is the immediate step; VERIFICATION_STATE records real checks; CHAT_CONTINUITY helps a new session resume. Inspect existing project-level controls first. Never delete completed documents: preserve them and mark them completed/superseded with a dated note. Do not put credentials or secrets in memory files.

## Safety
Continue independent work while CI runs if requested, but never fabricate a result or skip a required extraction gate. Do not modify pinned source, overwrite unknown files, integrate host-specific identity/tenancy/secrets/billing before extraction PASS, or merge/deploy without authorization.
