from enum import StrEnum


class CheckoutType(StrEnum):
    """Whether an agent works in the project itself or in a separate copy of it."""

    MAIN = "main"
    WORKTREE = "worktree"

    @property
    def is_separate_copy(self) -> bool:
        return self is CheckoutType.WORKTREE
