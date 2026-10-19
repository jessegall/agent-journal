from enum import StrEnum


class MigrationState(StrEnum):
    """Where bringing a version 3 journal across stands: offered at first, put off for later by the user, under way, done, or failed and offered again."""

    OFFERED = "offered"
    LATER = "later"
    RUNNING = "running"
    DONE = "done"
    FAILED = "failed"

    def is_open(self) -> bool:
        """The user has still to bring it across."""
        return self in (MigrationState.OFFERED, MigrationState.LATER, MigrationState.FAILED)
