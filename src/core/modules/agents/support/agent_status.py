from dataclasses import dataclass

from core.modules.agents.models.enums.agent_state import AgentState


@dataclass(frozen=True)
class AgentStatus:
    """The one answer to whether an agent's program runs, with the reason for an agent that ended."""

    program_state: AgentState
    reason: str | None = None

    @property
    def is_running(self) -> bool:
        return self.program_state is AgentState.RUNNING

    @property
    def text(self) -> str:
        state_line = f"state: {self.program_state.value}"
        return state_line if self.reason is None else f"{state_line}\nreason: {self.reason}"
