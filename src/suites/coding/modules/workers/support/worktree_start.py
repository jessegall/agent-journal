from dataclasses import dataclass


@dataclass(frozen=True)
class WorktreeStart:
    """What a new worktree is cut from, and the base commit its work counts from."""

    point: str
    base_commit: str
