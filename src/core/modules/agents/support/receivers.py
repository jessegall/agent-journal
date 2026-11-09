from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.agent_stops import AgentStops
from core.modules.agents.support.main_agent_finder import MainAgentFinder


class Receivers:
    """Who gets a line addressed to an agent: the agent, unless it ended for good, then the running main agent."""

    def __init__(self, agents: AgentRows, stops: AgentStops, queries: Queries) -> None:
        self.agents, self.stops, self.queries = agents, stops, queries

    def receiver(self, agent_id: int) -> Agent:
        agent = self.agents.find(agent_id)
        if not self.stops.is_final(agent):
            return agent
        return MainAgentFinder.newest(self.queries) or agent

    def message_receiver(self, agent_id: int) -> Agent:
        agent = self.agents.find(agent_id)
        return agent if self.stops.takes_messages(agent) else self.receiver(agent_id)
