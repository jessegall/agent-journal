from enum import StrEnum


class BehindCheckState(StrEnum):
    """Where one look at a worktree behind its base branch stands."""

    OPEN = "open"
    ORDERED = "ordered"
    UPDATED = "updated"
    IGNORED = "left"
    PASSED = "passed"
    CONFLICTED = "conflicted"
    REMOVED = "gone"
