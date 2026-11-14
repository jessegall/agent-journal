from dataclasses import dataclass

from engine.driver.agent_state import AgentState
from engine.enums.agent_kind import AgentKind


@dataclass(frozen=True)
class DefaultState:
    """A state a suite gives every agent of one role, driver or helper type, with the state that takes it away while
    that state is open, if any."""

    state: type[AgentState]
    kind: AgentKind
    value: str
    removed_while: str = ""
