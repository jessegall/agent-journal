from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class MessageAgents(Migration):
    """A message's session moves out of its data into its own column, an agent's own message takes the session it was written by, and every message from before is in the main agent's chat."""

    number: ClassVar[int] = 34

    def apply(self, connection: Connection) -> None:
        connection.execute("UPDATE messages SET session = json_extract(data, '$.session'), data = json_remove(data, '$.session') WHERE json_extract(data, '$.session') IS NOT NULL")
        connection.execute("UPDATE messages SET session = NULL WHERE session = ''")
        connection.execute("UPDATE messages SET session = substr(creator, 7) WHERE session IS NULL AND creator LIKE 'agent:_%'")
        connection.execute("UPDATE messages SET agent_role = 'main' WHERE agent_role IS NULL")
