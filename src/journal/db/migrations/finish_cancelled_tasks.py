from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class FinishCancelledTasks(Migration):
    """A task cancelled before a cancel stamped when it finished takes its last change as its finish, so no count takes it for open."""

    number: ClassVar[int] = 2

    def apply(self, connection: Connection) -> None:
        connection.execute("UPDATE tasks SET finished_at = updated_at WHERE state = 'cancelled' AND finished_at IS NULL")
