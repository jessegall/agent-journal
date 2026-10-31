from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.modules.messages.message import Message
from core.modules.messages.message_type import MessageType


class MessageQuery(Query[Message]):
    """Reads messages, with the filters the messages module and its guards use by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Message)

    def replies(self, message_id: int) -> Self:
        return self.filter(parent_id=message_id)

    def agent_messages(self) -> Self:
        return self.filter(type=MessageType.AGENT)
