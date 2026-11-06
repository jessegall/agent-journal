from dataclasses import dataclass

DELIVERY_LIMIT_MS = 60_000


@dataclass(frozen=True)
class ScriptPolicy:
    """Controls guard scripts and the time limit for commit scripts."""

    guards_run: bool = False
    commit_limit_ms: int | None = DELIVERY_LIMIT_MS
