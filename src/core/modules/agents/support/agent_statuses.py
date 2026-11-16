from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_dispatcher import AgentDispatcher
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.program_transport import ProgramTransport
from core.modules.agents.support.agent_status import AgentStatus


class AgentStatuses:
    """The read of whether an agent's program runs that every window, command, rule and suite uses: one answer,
    worked out by the dispatcher, with nothing of the launcher shown. It also says whether a launcher runs at
    all and how long an agent's program has typed nothing."""

    def __init__(self, dispatcher: AgentDispatcher, agents: AgentRows, transport: ProgramTransport) -> None:
        self.dispatcher, self.agents, self.transport = dispatcher, agents, transport

    @property
    def is_launcher_running(self) -> bool:
        return self.transport.is_running

    def idle_seconds(self, agent: Agent) -> int | None:
        return self.transport.idle_seconds(agent.terminal_id)

    def status(self, agent_id: int) -> AgentStatus:
        return self.read(self.agents.find(agent_id))

    def read(self, agent: Agent) -> AgentStatus:
        return self.dispatcher.status(agent)
