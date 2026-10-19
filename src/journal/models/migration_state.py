from enum import StrEnum


class MigrationState(StrEnum):
    """Where bringing a version 3 journal across stands: offered at first, put off for later by the user, under way, or done."""

    OFFERED = "offered"
    LATER = "later"
    RUNNING = "running"
    DONE = "done"

    def is_open(self) -> bool:
        """The user has still to bring it across."""
        return self in (MigrationState.OFFERED, MigrationState.LATER)
