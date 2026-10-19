from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class IndexTheHotReads(Migration):
    """Indexes for the reads every page makes: entries newest first and by their kind, agents by their state, messages by who wrote them."""

    number: ClassVar[int] = 9

    def up(self, connection: Connection) -> None:
        connection.execute("CREATE INDEX IF NOT EXISTS entries_by_environment ON entries (environment_id, id)")
        connection.execute("CREATE INDEX IF NOT EXISTS entries_by_kind ON entries (environment_id, kind)")
        connection.execute("CREATE INDEX IF NOT EXISTS agents_by_state ON agents (environment_id, state)")
        connection.execute("CREATE INDEX IF NOT EXISTS messages_by_writer ON messages (environment_id, created_by)")
