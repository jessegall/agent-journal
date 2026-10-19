from dataclasses import dataclass

from journal.engine.agent_state import AgentState
from journal.engine.resume import Resume
from journal.engine.transition import Transition
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class Ended(AgentState):
    """The session is over: nothing is allowed and nothing is said until it shows it lives again, by starting, taking a prompt or using a tool; then it is idle."""

    name = "ended"
    title = "Ended"

    def session_started(self, event: SessionStarted) -> Transition:
        return self.go(Resume(state="idle", data={}))

    def prompt_submitted(self, event: PromptSubmitted) -> Transition:
        return self.go(Resume(state="idle", data={}))

    def tool_starting(self, event: ToolStarting) -> Transition:
        return self.go(Resume(state="idle", data={}))
