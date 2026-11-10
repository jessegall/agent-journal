from argparse import ArgumentParser, Namespace
from datetime import timedelta

from engine.caller.caller import Caller
from engine.time.clock import Clock
from engine.query.conditions.among import Among
from engine.query.conditions.minimum import Minimum
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.time.timestamp import Timestamp
from engine.types.type_guards import is_tuple
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES, MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.support.recent_conversation import RecentConversation
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.agents.models.agent import Agent
from engine.query.queries import Queries

RECENT = timedelta(hours=1)
CONVERSATION_TYPES = (*PERSON_MESSAGE_TYPES, MessageType.AGENT)
USER = "user"

RECENT_MESSAGES = 50


class MessageConversationsSubcommand(ReadSubcommand[tuple[RecentConversation, ...]]):
    """`journal message conversations`: for each party that spoke with the agent in the last hour, the last five
    messages of each side, oldest first."""

    cli_name = "message"
    name = "conversations"

    def __init__(self, messages: MessageQuery, clock: Clock, queries: Queries) -> None:
        self.messages, self.clock, self.queries = messages, clock, queries

    def arguments(self, parser: ArgumentParser) -> None:
        pass

    def read(self, arguments: Namespace, caller: Caller) -> tuple[RecentConversation, ...]:
        agent_id = caller.read_actor_id
        if agent_id is None:
            return ()
        latest_messages = self.messages.matching(Minimum("created_at", Timestamp(self.clock.timestamp().value - RECENT).text)).matching(Among("type", CONVERSATION_TYPES))
        rows = {message.id: message for query in (latest_messages.addressed(agent_id), latest_messages.filter(creator_id=agent_id)) for message in query.newest().limited(RECENT_MESSAGES)}
        grouped: dict[str, list[Message]] = {}
        agent_ids = sorted({row_id for message in rows.values() for row_id in (message.creator_id, message.target_agent_id) if row_id is not None})
        labels = {agent.id: AgentLabel.from_agent(agent).text for agent in self.queries.query(Agent).matching(Among("id", agent_ids)).all_rows()} if agent_ids else {}
        for message in sorted(rows.values(), key=lambda row: row.id):
            grouped.setdefault(self.actor(message, agent_id, labels), []).append(message)
        conversations = (RecentConversation(actor, agent_id, tuple(messages)) for actor, messages in grouped.items())
        return tuple(conversation for conversation in conversations if conversation.has_answer)

    @staticmethod
    def actor(message: Message, agent_id: int, labels: dict[int, str]) -> str:
        if message.peer:
            return message.peer
        if message.creator_id != agent_id:
            return USER if message.type in PERSON_MESSAGE_TYPES else labels[message.creator_id]
        if message.recipient:
            return message.recipient
        return labels[message.target_agent_id] if message.target_agent_id is not None else USER

    def write_output(self, value: object, output: Output) -> None:
        rows = [row for row in value if isinstance(row, RecentConversation)] if is_tuple(value) else []
        output.write("\n\n".join(row.lines() for row in rows) or "no conversations in the last hour", {"rows": [{"actor": row.actor, "message_ids": [message.id for message in row.shown()]} for row in rows]})
