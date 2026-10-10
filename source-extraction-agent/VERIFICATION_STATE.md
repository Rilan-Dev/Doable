# Verification State

Status: **NOT VERIFIED for source extraction**.

This commit installs agent guidance only. It does not pin, copy or verify upstream application source. Any historical extraction claims must be checked against current Git refs and actual raw evidence before use.

Required evidence for extraction PASS: exact upstream URL/ref/commit/root tree; license/provenance; inventory and independent reconciliation; closed static/dynamic/data/runtime dependency graph; immutable copy manifests; actual verifier output for blobs/trees/modes/symlinks and missing/extra paths; capability and dependency manifests; recorded command, environment, exit code and artifact paths.

Do not update this status to PASS unless the verifier was actually run against the current pinned source and captured output. A green documentation workflow is not an extraction PASS.
