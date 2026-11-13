from collections.abc import Sequence

from engine.enums.actor_type import ActorType
from engine.database.kept_rows import KeptRows
from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.query.query import Query
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_reactions import MessageReactions

REPLIES_REASON = "a message counts as answered by any reply the agent wrote to it"



class MessageReplies:
    """Which of the messages an agent was sent it has answered: by a reply to it or a reaction on it,
    and for a message from another agent also by any later message to that agent, since an agent
    writes to an agent without naming the message it answers. It reads the replies to these messages
    and the newest message to each sender, never every message the agent wrote since."""

    def __init__(self, queries: Queries, agents: AgentRows, kept: KeptRows) -> None:
        self.queries, self.agents, self.kept = queries, agents, kept

    def answered_ids(self, agent_id: int, messages: Sequence[Message]) -> set[int]:
        if not messages:
            return set()
        replied_ids = self.replied_ids(agent_id, tuple(message.id for message in messages))
        newest_reply_ids = self.newest_reply_ids(agent_id, messages)
        return {message.id for message in messages if MessageReactions.has_actor(message, ActorType.AGENT.value) or message.id in replied_ids
                or (message.type is MessageType.AGENT and newest_reply_ids[message.creator_id] > message.id)}

    def replied_ids(self, agent_id: int, message_ids: tuple[int, ...]) -> set[int | None]:
        written = self.authored_messages(agent_id).matching(Among("parent_id", message_ids)).oldest()
        replies = self.kept.read(written, lambda: tuple(written.every_row(REPLIES_REASON)), name="messages.written_replies")
        return {reply.parent_id for reply in replies}

    def newest_reply_ids(self, agent_id: int, messages: Sequence[Message]) -> dict[int, int]:
        main = self.agents.main_agent()
        main_id = main.id if main is not None else None
        sender_ids = {message.creator_id for message in messages if message.type is MessageType.AGENT}
        return {sender_id: self.newest_reply_id(agent_id, sender_id, main_id) for sender_id in sender_ids}

    def newest_reply_id(self, agent_id: int, sender_id: int, main_id: int | None) -> int:
        targeted_replies = self.authored_messages(agent_id).filter(target_agent_id=sender_id).newest()
        targeted = self.kept.read_newest(targeted_replies, targeted_replies.first, name="messages.newest_targeted_reply")
        untargeted_replies = self.authored_messages(agent_id).matching(IsNull("target_agent_id")).newest()
        untargeted = self.kept.read_newest(untargeted_replies, untargeted_replies.first, name="messages.newest_untargeted_reply") if sender_id == main_id else None
        return max((reply.id for reply in (targeted, untargeted) if reply is not None), default=0)

    def authored_messages(self, agent_id: int) -> Query[Message]:
        return self.queries.query(Message).filter(type=MessageType.AGENT, creator_id=agent_id)
