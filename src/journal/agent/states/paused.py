from dataclasses import dataclass, field

from journal.agent.agent_state import AgentState
from journal.agent.transition import Transition


@dataclass(frozen=True)
class Paused(AgentState):
    """A state the agent goes back from: it holds the state it left, serialised, and back() returns there. What two pauses share lives here."""

    resume: dict = field(default_factory=dict)

    def back(self, *nudges: str) -> Transition: ...

    @classmethod
    def leaving(cls, state: AgentState, **data) -> "Paused": ...
