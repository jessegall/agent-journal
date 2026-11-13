from engine.query.conditions.equal import Equal
from engine.query.conditions.greater import Greater
from engine.query.conditions.maximum import Maximum
from engine.query.conditions.minimum import Minimum
from typing import Self

from engine.database.database import Database
from engine.database.kept_rows import KeptRows
from engine.model.tables import Tables
from engine.time.timestamp import Timestamp
from engine.query.query import Query
from core.modules.messages.models.message import Message
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from core.modules.messages.conditions.message_target import MessageTarget
from core.modules.messages.conditions.message_text_segment import MessageTextSegment

TURN_REASON = "a turn is judged on every reply the agent wrote in it"
RECENT_REASON = "every recent message of the agent is compared, newest first"


class MessageQuery(Query[Message]):
    """Reads messages, with the filters the messages module and its guards use by name."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, Message)
        self.kept = kept

    def latest_agent_message(self, creator_id: int) -> Message | None:
        messages = self.creator_messages(creator_id)
        return self.kept.read(messages, messages.first, name="messages.latest_agent_message")

    def creator_messages(self, creator_id: int) -> Self:
        return self.filter(creator_id=creator_id, type=MessageType.AGENT).newest()

    def latest_turn_reply(self, creator_id: int, start_at: Timestamp, end_at: Timestamp) -> Message | None:
        return self.agent_replies().filter(creator_id=creator_id).matching(Minimum("created_at", start_at.text)).matching(Maximum("created_at", end_at.text)).newest().first()

    def turn_replies(self, creator_id: int, start_at: Timestamp, end_at: Timestamp) -> tuple[Message, ...]:
        return tuple(self.agent_replies().filter(creator_id=creator_id).matching(Minimum("created_at", start_at.text)).matching(Maximum("created_at", end_at.text)).every_row(TURN_REASON))

    def recent_agent_messages(self, creator_id: int, cutoff_at: Timestamp) -> tuple[Message, ...]:
        return tuple(sorted(self.agent_messages().filter(creator_id=creator_id).matching(Minimum("created_at", cutoff_at.text)).every_row(RECENT_REASON), key=lambda message: message.id, reverse=True))

    def has_text_after(self, creator_id: int, text: str, cutoff_at: Timestamp) -> bool:
        return self.filter(creator_id=creator_id, text=text).matching(Minimum("created_at", cutoff_at.text)).exists()

    def delivered(self, agent_id: int, delivered_at: Timestamp) -> Self:
        return self.unread(agent_id).matching(Equal("delivered_at", delivered_at.text))

    def remember(self, message: Message) -> None:
        if message.type is not MessageType.AGENT:
            return
        def newest(previous: Message | None) -> Message:
            return message if previous is None or message.id >= previous.id else previous

        self.kept.update(self.creator_messages(message.creator_id), newest, name="messages.latest_agent_message")

    def person_messages_during(self, agent_id: int, start_text: str, end_at: Timestamp) -> Self:
        return self.addressed(agent_id).matching(Among("type", PERSON_MESSAGE_TYPES)).matching(Greater("created_at", start_text)).matching(Maximum("created_at", end_at.text))

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
        messages = self.matching(Among("type", PERSON_MESSAGE_TYPES)).matching(Greater("id", message_id))
        return self.kept.read_newest(messages, messages.exists, name="messages.person_message_past")

    def unread(self, agent_id: int) -> Self:
        return self.addressed(agent_id).matching(Among("type", PERSON_MESSAGE_TYPES)).matching(IsNull("read_at"))

    def undelivered(self, agent_id: int) -> Self:
        return self.unread(agent_id).matching(IsNull("delivered_at"))

    # The oldest of each user message type is found by its own index walk, so none walks the other types' rows.
    def oldest_undelivered(self, agent_id: int, size: int) -> list[Message]:
        oldest = [message for category in PERSON_MESSAGE_TYPES
                  for message in self.addressed(agent_id).filter(type=category).matching(IsNull("read_at")).matching(IsNull("delivered_at")).oldest().take(size)]
        return sorted(oldest, key=lambda message: message.id)[:size]
