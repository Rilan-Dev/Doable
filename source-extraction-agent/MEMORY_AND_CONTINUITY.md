# Memory and cross-session continuity

## Authority order
1. Git objects, pinned source refs and raw verifier artifacts.
2. Existing project-control docs, plans, sessions, manifests, issues, decisions and worklogs.
3. This folder's TARGET_PROJECT_STATE, NEXT_ACTION and VERIFICATION_STATE.
4. Chat summaries/model memory (index only, never proof).

## Session start
Inspect repo, active branch, HEAD and working tree. Read the latest chronological worklog and current next action, then locate previous handoffs and actual verification outputs. Separate completed, pending, blocked and awaiting-evidence items. Do not repeat completed work merely because the chat changed.

## Session end
Append a dated worklog entry. Update next action and verification state to reflect actual reality. Preserve historical plans and mark them completed/superseded instead of deleting them. Record exact commands, environment, exit codes, evidence paths, commit SHAs, limitations and assumptions. Write continuity instructions that let a new session resume quickly. Never store secrets or tokens.

## Contradictions
If a summary says PASS but evidence is absent, stale, or refers to a different source pin, mark current status unverified and explain the discrepancy. Correct current summaries only; preserve history.
