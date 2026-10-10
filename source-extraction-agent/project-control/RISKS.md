# Risks — Doable Extraction

- Stale verifier output could be mistaken for current proof if source commit/tree changed.
- Repeating extraction could duplicate or overwrite completed work.
- License/provenance and complete first-party dependency closure must be confirmed before reuse.
- Mitigation: inspect live refs and artifacts; preserve history; append evidence; verify current source pin.
