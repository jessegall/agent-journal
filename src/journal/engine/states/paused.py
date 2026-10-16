from dataclasses import dataclass, field
from typing import ClassVar

from journal.engine.agent_state import AgentState
from journal.engine.resume import Resume
from journal.events.agent.idle import Idle
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.engine.transition import Transition
from journal.features.said import Said




@dataclass(frozen=True)
class Paused(AgentState):
    """A state the agent goes back from: it holds the state it left, serialised, and back() returns there. What two pauses share lives here."""

    resume: dict = field(default_factory=dict)
    owed_by_agent: ClassVar[bool] = False
    """True when what the state awaits is the agent's own doing, a read or a decision: a stop then says so. A wait on the user, a worker or a halt lets the stop pass."""
    leaves_by_itself: ClassVar[bool] = False
    """True when the state goes back on its own, by what the agent does in it, so no workflow has to release it."""

    def awaiting(self) -> tuple[str, str]:
        """What the agent waits for while paused here, in words, and the rows it waits on as refs; the viewer's status line reads both."""
        return "", ""

    def idle(self, event: Idle) -> Transition:
        """A stop while paused is the workflows' to hold: a wait stays as it is."""
        return self.stay()

    def prompt_submitted(self, event: PromptSubmitted) -> Transition:
        """A word from the user frees any wait that is not the agent's own doing: the engine's way out of a wait whose workflow no longer releases it."""
        return self.stay() if self.owed_by_agent else self.back()

    def back(self, *says: Said) -> Transition:
        return self.go(Resume(state=self.resume.get("state", "idle"), data=self.resume.get("data", {})), *says)

    @classmethod
    def leaving(cls, state: AgentState, **data) -> "Paused":
        return cls(resume={"state": state.name, "data": state.to_data()}, **data)
