from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class OverviewReadColumn(Migration):
    """The agent's has_overview column is is_overview_read: whether it has run journal environment overview since its session started or its context was compacted."""

    number: ClassVar[int] = 36

    def apply(self, connection: Connection) -> None:
        self.column_rename(connection, "agents", "has_overview", "is_overview_read")
