from argparse import ArgumentParser, Namespace
from datetime import timedelta

from core.base.caller.caller import Caller
from engine.time.clock import Clock
from core.base.query.conditions.among import Among
from core.base.query.conditions.minimum import Minimum
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from engine.time.timestamp import Timestamp
from engine.types.type_guards import is_tuple
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES, MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.support.recent_conversation import RecentConversation

RECENT = timedelta(hours=1)
CONVERSATION_TYPES = (*PERSON_MESSAGE_TYPES, MessageType.AGENT)
USER = "user"

RECENT_MESSAGES = 50


class MessageConversationsSubcommand(ReadSubcommand[tuple[RecentConversation, ...]]):
    """`journal message conversations`: for each party that spoke with the agent in the last hour, the last five
    messages of each side, oldest first."""

    cli_name = "message"
    name = "conversations"

    def __init__(self, messages: MessageQuery, clock: Clock) -> None:
        self.messages, self.clock = messages, clock

    def arguments(self, parser: ArgumentParser) -> None:
        pass

    def read(self, arguments: Namespace, caller: Caller) -> tuple[RecentConversation, ...]:
        agent_id = caller.read_actor_id
        if agent_id is None:
            return ()
        latest_messages = self.messages.matching(Minimum("created_at", Timestamp(self.clock.timestamp().value - RECENT).text)).matching(Among("type", CONVERSATION_TYPES))
        rows = {message.id: message for query in (latest_messages.addressed(agent_id), latest_messages.filter(creator_id=agent_id)) for message in query.newest().limited(RECENT_MESSAGES)}
        grouped: dict[str, list[Message]] = {}
        for message in sorted(rows.values(), key=lambda row: row.id):
            grouped.setdefault(self.actor(message, agent_id), []).append(message)
        conversations = (RecentConversation(actor, agent_id, tuple(messages)) for actor, messages in grouped.items())
        return tuple(conversation for conversation in conversations if conversation.has_answer)

    @staticmethod
    def actor(message: Message, agent_id: int) -> str:
        if message.peer:
            return message.peer
        if message.creator_id != agent_id:
            return USER if message.type in PERSON_MESSAGE_TYPES else f"agent {message.creator_id}"
        if message.recipient:
            return message.recipient
        return f"agent {message.target_agent_id}" if message.target_agent_id is not None else USER

    def write_output(self, value: object, output: Output) -> None:
        rows = [row for row in value if isinstance(row, RecentConversation)] if is_tuple(value) else []
        output.write("\n\n".join(row.lines() for row in rows) or "no conversations in the last hour", {"rows": [{"actor": row.actor, "message_ids": [message.id for message in row.shown()]} for row in rows]})
