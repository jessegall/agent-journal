from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class DashboardSections(Migration):
    """A dashboard line's heading is its section: the column is renamed, or carried into the section column the schema already added when both are there."""

    number: ClassVar[int] = 22

    def up(self, connection: Connection) -> None:
        columns = {row["name"] for row in connection.all("PRAGMA table_info(dashboard_rows)")}
        if "heading" in columns and "section" in columns:
            connection.execute("UPDATE dashboard_rows SET section = heading")
            connection.execute("ALTER TABLE dashboard_rows DROP COLUMN heading")
        elif "heading" in columns:
            connection.execute("ALTER TABLE dashboard_rows RENAME COLUMN heading TO section")
