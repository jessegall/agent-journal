from dataclasses import dataclass
from typing import ClassVar

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class WaitRequest(AgentEvent):
    """The agent said with journal await that it waits for something outside its hands."""

    answers_hook: ClassVar[bool] = False

    focus: str
    end_refs: str = ""

    def wait_terms(self) -> tuple[str, str, float]:
        return self.focus, self.end_refs, self.time
