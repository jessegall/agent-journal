from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.messages.models.message import Message


class MessageTargets:
    """Finds the agent a message addresses, with the main agent as the legacy default."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def selected(self, agent_id: int | None) -> Agent | None:
        if agent_id is None:
            return MainAgentFinder.newest(self.queries)
        agent = self.queries.query(Agent).find(agent_id)
        if agent.ended_at is not None:
            raise Refusal("a message target must be running", "select a running agent")
        return agent

    def recipient(self, message: Message) -> Agent | None:
        if message.target_agent_id is None:
            return MainAgentFinder.newest(self.queries)
        agent = self.queries.query(Agent).find(message.target_agent_id)
        return agent if agent.ended_at is None else None
