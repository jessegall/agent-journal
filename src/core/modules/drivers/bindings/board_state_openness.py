from engine.driver.agent_state import AgentState
from engine.listener.commit.agent_state_openness import AgentStateOpenness
from engine.listener.errors.unregistered_listener_state_error import UnregisteredListenerStateError
from engine.registry.registry import Registry
from engine.time.clock import Clock
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.agent_boards import AgentBoards


class BoardStateOpenness(AgentStateOpenness):
    """Whether an agent state is open for an agent outside a hook, as the agent's state board finds it now."""

    def __init__(self, registry: Registry, boards: AgentBoards, agents: AgentRows, clock: Clock) -> None:
        self.registry, self.boards, self.agents, self.clock = registry, boards, agents, clock

    def is_open(self, agent_id: int, state: type[AgentState]) -> bool:
        entry = self.registry.agent_state(state.name)
        if entry is None:
            raise UnregisteredListenerStateError(state.name)
        return self.boards.for_agent(self.agents.find(agent_id), self.clock.timestamp()).is_open(entry)
