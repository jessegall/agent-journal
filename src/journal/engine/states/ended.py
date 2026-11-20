from dataclasses import dataclass

from journal.engine.no_task_assigner import NoTaskAssigner
from journal.engine.base_state import BaseState
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.helper_assignment import HelperAssignment
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.tool_starting import ToolStarting
from journal.models.agent import ENDED_STATE


@dataclass(frozen=True)
class Ended(BaseState):
    """The session is over: nothing is allowed and nothing is sent until it shows it is running again, by starting, taking a prompt or using a tool; then it is popped."""

    name = ENDED_STATE
    assigner = NoTaskAssigner
    title = "Ended"
    final = True

    def takes_pushes(self) -> bool:
        return False

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        return self.pop()

    def on_prompt_submitted(self, event: PromptSubmitted, settings: Settings) -> Transition:
        return self.pop()

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return self.pop()

    def on_helper_assignment(self, event: HelperAssignment, settings: Settings) -> Transition:
        return self.forward()
