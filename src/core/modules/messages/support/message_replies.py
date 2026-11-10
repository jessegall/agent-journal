from collections.abc import Sequence

from engine.enums.actor_type import ActorType
from engine.database.kept_rows import KeptRows
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
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
        replied_ids = {reply.parent_id for reply in written}
        newest_reply_ids = self.newest_reply_ids(written)
        return {message.id for message in messages if MessageReactions.has_actor(message, ActorType.AGENT.value) or message.id in replied_ids
                or (message.type is MessageType.AGENT and newest_reply_ids.get(message.creator_id, 0) > message.id)}

    def newest_reply_ids(self, written: Sequence[Message]) -> dict[int | None, int]:
        main = self.agents.main_agent()
        main_id = main.id if main is not None else None
        newest_reply_ids: dict[int | None, int] = {}
        for reply in written:
            addressee_id = reply.target_agent_id if reply.target_agent_id is not None else main_id
            newest_reply_ids[addressee_id] = max(reply.id, newest_reply_ids.get(addressee_id, 0))
        return newest_reply_ids
