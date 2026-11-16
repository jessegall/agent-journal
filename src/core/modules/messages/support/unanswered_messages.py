from engine.database.database import Database
from engine.query.conditions.equal import Equal
from engine.request.request_values import RequestValues
from engine.query.conditions.excluding import Excluding
from core.modules.agents.conditions.active_agent_rows import ActiveAgentRows
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES, MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.support.message_replies import MessageReplies
from core.modules.messages.support.session_read_messages import READ_TYPES, SessionReadMessages

# a read ordered by the time a message was read searches the read index, where a walk by id would read the whole chat
OLDEST_PERSON_MESSAGES = 50
NEWEST_AGENT_MESSAGES = 50


class UnansweredMessages:
    """The messages an agent read and has not answered: those read since its current session began or since its last
    message, from a person or from a running agent other than itself; the newest 50 of the agents' are checked."""

    def __init__(self, messages: MessageQuery, reads: SessionReadMessages, replies: MessageReplies, request_values: RequestValues, database: Database) -> None:
        self.messages, self.reads, self.replies, self.request_values, self.database = messages, reads, replies, request_values, database

    # the walk's rule and the agent machine's need both ask on one hook: read once until a row changes
    def unanswered(self, agent_id: int) -> tuple[Message, ...]:
        return self.request_values.read(f"messages.unanswered.{agent_id}", self.database.change_mark, lambda: self.read_unanswered(agent_id))

    # nothing read in the current session leaves nothing unanswered, which one look settles on most tool calls
    def read_unanswered(self, agent_id: int) -> tuple[Message, ...]:
        agent_start = self.reads.agent_start(agent_id)
        if not self.reads.read_after(agent_id, READ_TYPES, agent_start).exists():
            return ()
        newest_agent_message = self.messages.addressed(agent_id).filter(type=MessageType.AGENT, creator_id=agent_id).newest().first()
        wait_start = max(agent_start, newest_agent_message.creation_timestamp().text) if newest_agent_message is not None else agent_start
        read_people = self.reads.read_after(agent_id, PERSON_MESSAGE_TYPES, wait_start).order_by("read_at").take(OLDEST_PERSON_MESSAGES)
        read_agents = self.reads.read_after(agent_id, (MessageType.AGENT,), agent_start).matching(ActiveAgentRows("creator_id")).matching(Excluding(Equal("creator_id", agent_id))).newest().take(NEWEST_AGENT_MESSAGES)
        candidates = tuple(sorted((*read_people, *read_agents), key=lambda message: message.id))
        answered = self.replies.answered_ids(agent_id, candidates)
        return tuple(message for message in candidates if message.id not in answered)
