from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class LinkIndexes(Migration):
    """Indexes for a row's links, read from either end, and for the links of one kind."""

    number: ClassVar[int] = 10

    def apply(self, connection: Connection) -> None:
        connection.execute("CREATE INDEX IF NOT EXISTS links_by_source ON links (source)")
        connection.execute("CREATE INDEX IF NOT EXISTS links_by_target ON links (target)")
        connection.execute("CREATE INDEX IF NOT EXISTS links_by_kind ON links (kind, source)")
