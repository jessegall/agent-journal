from dataclasses import dataclass

from journal.engine.base_state import BaseState
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.session_ended import SessionEnded
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class Ended(BaseState):
    """The session is over: nothing is allowed and nothing is said until it shows it lives again, by starting, taking a prompt or using a tool; then it is popped."""

    name = "ended"
    title = "Ended"

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        return self.pop()

    def on_prompt_submitted(self, event: PromptSubmitted, settings: Settings) -> Transition:
        return self.pop()

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return self.pop()

    def on_session_ended(self, event: SessionEnded, settings: Settings) -> Transition:
        return self.unchanged()
