from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_dispatcher import AgentDispatcher
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.standing import Standing


class AgentStanding:
    """The read of whether an agent's program runs that every window, command, rule and suite uses: one answer,
    worked out by the dispatcher, with nothing of the launcher shown."""

    def __init__(self, dispatcher: AgentDispatcher, agents: AgentRows) -> None:
        self.dispatcher, self.agents = dispatcher, agents

    def standing(self, agent_id: int) -> Standing:
        return self.read(self.agents.find(agent_id))

    def read(self, agent: Agent) -> Standing:
        return self.dispatcher.standing(agent)
