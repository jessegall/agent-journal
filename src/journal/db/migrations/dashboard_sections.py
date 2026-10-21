from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class DashboardSections(Migration):
    """A dashboard line's heading is its section: the column is renamed in place of the empty section column the schema already added."""

    number: ClassVar[int] = 22

    def apply(self, connection: Connection) -> None:
        self.column_rename(connection, "dashboard_rows", "heading", "section")
