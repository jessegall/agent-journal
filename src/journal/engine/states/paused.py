from dataclasses import dataclass, field

from journal.engine.agent_state import AgentState
from journal.engine.resume import Resume
from journal.engine.transition import Transition
from journal.features.said import Said


@dataclass(frozen=True)
class Paused(AgentState):
    """A state the agent goes back from: it holds the state it left, serialised, and back() returns there. What two pauses share lives here."""

    resume: dict = field(default_factory=dict)

    def back(self, *says: Said) -> Transition:
        return self.go(Resume(state=self.resume.get("state", "idle"), data=self.resume.get("data", {})), *says)

    @classmethod
    def leaving(cls, state: AgentState, **data) -> "Paused":
        return cls(resume={"state": state.name, "data": state.to_data()}, **data)
