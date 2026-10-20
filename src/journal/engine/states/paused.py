from dataclasses import dataclass, field
from typing import ClassVar

from journal.engine.agent_state import AgentState
from journal.engine.resume import Resume
from journal.events.agent.idle import Idle
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.support.said import Said




@dataclass(frozen=True)
class Paused(AgentState):
    """A state the agent goes back from: it holds the state it left, serialised, and back() returns there. What two pauses share lives here."""

    leaves_by_itself: ClassVar[bool] = False
    resume: dict = field(default_factory=dict)

    def awaiting(self) -> tuple[str, str]:
        return "", ""

    def on_idle(self, event: Idle, settings: Settings) -> Transition:
        return self.stay()

    def on_prompt_submitted(self, event: PromptSubmitted, settings: Settings) -> Transition:
        return self.back() if event.by_user else self.stay()

    def back(self, *says: Said) -> Transition:
        return self.go(Resume(state=self.resume.get("state", "idle"), data=self.resume.get("data", {})), *says)

    @classmethod
    def leaving(cls, state: AgentState, **data) -> "Paused":
        return cls(resume={"state": state.name, "data": state.to_data()}, **data)
