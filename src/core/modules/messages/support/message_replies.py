from collections.abc import Sequence

from core.base.actor_type import ActorType
from core.base.database.kept_rows import KeptRows
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_reactions import MessageReactions


class MessageReplies:
    """Which of the messages an agent was sent it has answered: by a reply to it or a reaction on it, and for a
    message from another agent also by any later message to that agent, since an agent writes to an agent without
    naming the message it answers."""

    def __init__(self, queries: Queries, agents: AgentRows, kept: KeptRows) -> None:
        self.queries, self.agents, self.kept = queries, agents, kept

    def answered_ids(self, agent_id: int, messages: Sequence[Message]) -> set[int]:
        if not messages:
            return set()
        first_id = min(message.id for message in messages)
        written = self.kept.read("messages", lambda: tuple(self.queries.query(Message).filter(type=MessageType.AGENT, creator_id=agent_id).matching(Greater("id", first_id - 1)).all_rows()),
                                 "type = ? AND creator_id = ? AND id >= ?", (MessageType.AGENT.value, agent_id, first_id), name="messages.written_replies")
        return {message.id for message in messages if MessageReactions.has_actor(message, ActorType.AGENT.value) or self.is_replied(message, written)}

    def is_replied(self, message: Message, written: Sequence[Message]) -> bool:
        return any(reply.parent_id == message.id or (message.type is MessageType.AGENT and reply.id > message.id and self.addressee_id(reply) == message.creator_id) for reply in written)

    def addressee_id(self, message: Message) -> int | None:
        if message.target_agent_id is not None:
            return message.target_agent_id
        main = self.agents.main_agent()
        return main.id if main is not None else None
