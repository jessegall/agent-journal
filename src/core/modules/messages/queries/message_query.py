from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.modules.messages.models.message import Message
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.base.query.conditions.among import Among
from core.base.query.conditions.is_null import IsNull
from core.modules.messages.conditions.message_target import MessageTarget


class MessageQuery(Query[Message]):
    """Reads messages, with the filters the messages module and its guards use by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Message)

    def replies(self, message_id: int) -> Self:
        return self.filter(parent_id=message_id)

    def agent_messages(self) -> Self:
        return self.filter(type=MessageType.AGENT)

    def addressed(self, agent_id: int) -> Self:
        return self.matching(MessageTarget(agent_id))

    def unread(self, agent_id: int) -> Self:
        return self.addressed(agent_id).matching(Among("type", PERSON_MESSAGE_TYPES)).matching(IsNull("read_at"))
