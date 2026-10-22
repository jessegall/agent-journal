from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class MessageChatIndex(Migration):
    """Indexes of an environment's messages by the chat they are in and by the agent they came from, so a chat's page and its changes are read from their own rows."""

    number: ClassVar[int] = 35

    def apply(self, connection: Connection) -> None:
        connection.execute("CREATE INDEX IF NOT EXISTS messages_by_chat ON messages (environment_id, agent_role, id)")
        connection.execute("CREATE INDEX IF NOT EXISTS messages_by_session ON messages (session, id)")
