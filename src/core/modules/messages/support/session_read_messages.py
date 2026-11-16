from engine.query.conditions.among import Among
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from core.modules.agents.conditions.current_session_rows import CurrentSessionRows
from core.modules.agents.models.agent import Agent
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES, MessageType
from core.modules.messages.queries.message_query import MessageQuery

READ_TYPES = (*PERSON_MESSAGE_TYPES, MessageType.AGENT)


class SessionReadMessages:
    """The messages addressed to an agent that it read in its current session, since its start: what the
    unanswered rule weighs and what opens its state."""

    def __init__(self, messages: MessageQuery, queries: Queries) -> None:
        self.messages, self.queries = messages, queries

    def agent_start(self, agent_id: int) -> str:
        return self.queries.query(Agent).find(agent_id).creation_timestamp().text

    def read_after(self, agent_id: int, types: tuple[MessageType, ...], timestamp: str) -> MessageQuery:
        return self.messages.addressed(agent_id).filter(peer_key="").matching(Among("type", types)).matching(Greater("read_at", timestamp)).matching(CurrentSessionRows("read_at", agent_id))

