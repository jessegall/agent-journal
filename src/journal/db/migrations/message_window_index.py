from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class MessageWindowIndex(Migration):
    """An index of an environment's messages by number, so the chat's newest page is read from its end instead of sorting every message of the environment."""

    number: ClassVar[int] = 29

    def apply(self, connection: Connection) -> None:
        connection.execute("CREATE INDEX IF NOT EXISTS messages_by_environment ON messages (environment_id, id)")
