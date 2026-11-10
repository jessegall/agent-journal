from core.base.query.conditions.equal import Equal
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.maximum import Maximum
from core.base.query.conditions.minimum import Minimum
from typing import Self

from core.base.database.database import Database
from core.base.database.kept_rows import KeptRows
from core.base.model.tables import Tables
from core.base.timestamp import Timestamp
from core.base.query.query import Query
from core.modules.messages.models.message import Message
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.base.query.conditions.among import Among
from core.base.query.conditions.is_null import IsNull
from core.modules.messages.conditions.message_target import MessageTarget
from core.modules.messages.conditions.message_text_segment import MessageTextSegment


class MessageQuery(Query[Message]):
    """Reads messages, with the filters the messages module and its guards use by name."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, Message)
        self.kept = kept

    def latest_agent_message(self, creator_id: int) -> Message | None:
        return self.kept.read(self.table.name, self.filter(creator_id=creator_id, type=MessageType.AGENT).newest().first,
                              "creator_id = ? AND type = ?", [creator_id, MessageType.AGENT], name="messages.latest_agent_message")

    def latest_turn_reply(self, creator_id: int, start_at: Timestamp, end_at: Timestamp) -> Message | None:
        return self.agent_replies().filter(creator_id=creator_id).matching(Minimum("created_at", start_at.text)).matching(Maximum("created_at", end_at.text)).newest().first()

    def turn_replies(self, creator_id: int, start_at: Timestamp, end_at: Timestamp) -> tuple[Message, ...]:
        return tuple(self.agent_replies().filter(creator_id=creator_id).matching(Minimum("created_at", start_at.text)).matching(Maximum("created_at", end_at.text)).oldest().all_rows())

    def recent_agent_messages(self, creator_id: int, cutoff_at: Timestamp) -> tuple[Message, ...]:
        return tuple(self.agent_messages().filter(creator_id=creator_id).matching(Minimum("created_at", cutoff_at.text)).newest().all_rows())

    def has_text_after(self, creator_id: int, text: str, cutoff_at: Timestamp) -> bool:
        return self.filter(creator_id=creator_id, text=text).matching(Minimum("created_at", cutoff_at.text)).exists()

    def delivered(self, agent_id: int, delivered_at: Timestamp) -> Self:
        return self.unread(agent_id).matching(Equal("delivered_at", delivered_at.text))

    def remember(self, message: Message) -> None:
        if message.type is not MessageType.AGENT:
            return
        def newest(previous: Message | None) -> Message:
            return message if previous is None or message.id >= previous.id else previous

        self.kept.update(self.table.name, newest,
                         "creator_id = ? AND type = ?", [message.creator_id, MessageType.AGENT], name="messages.latest_agent_message")

    def replies(self, message_id: int) -> Self:
        return self.filter(parent_id=message_id)

    def with_text_segment(self, offset: int, size: int) -> Self:
        return self.with_select(self.select.column(MessageTextSegment(offset, size).columns(self.table.columns)))

    def agent_messages(self) -> Self:
        return self.filter(type=MessageType.AGENT)

    def agent_replies(self) -> Self:
        return self.agent_messages().filter(is_agent_text=False)

    def addressed(self, agent_id: int) -> Self:
        return self.matching(MessageTarget(agent_id))

    def has_person_message_after(self, message_id: int) -> bool:
        return self.kept.read_newest(self.table.name, self.matching(Among("type", PERSON_MESSAGE_TYPES)).matching(Greater("id", message_id)).exists,
                                     f"type IN ({', '.join('?' for _ in PERSON_MESSAGE_TYPES)}) AND id > ?", [*PERSON_MESSAGE_TYPES, message_id], name="messages.person_message_past")

    def unread(self, agent_id: int) -> Self:
        return self.addressed(agent_id).matching(Among("type", PERSON_MESSAGE_TYPES)).matching(IsNull("read_at"))

    def undelivered(self, agent_id: int) -> Self:
        return self.unread(agent_id).matching(IsNull("delivered_at"))

    def oldest_undelivered(self, agent_id: int, size: int) -> list[Message]:
        """The oldest of each person message type is found by its own index walk, so none walks the other types' rows."""
        oldest = [message for kind in PERSON_MESSAGE_TYPES
                  for message in self.addressed(agent_id).filter(type=kind).matching(IsNull("read_at")).matching(IsNull("delivered_at")).oldest().limited(size)]
        return sorted(oldest, key=lambda message: message.id)[:size]
