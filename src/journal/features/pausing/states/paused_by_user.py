from dataclasses import dataclass

from journal.engine.states.wait import Wait
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.user_resumed import UserResumed


@dataclass(frozen=True)
class PausedByUser(Wait):
    """The user paused the agent from the viewer: every tool call is held until the user resumes it, by the resume button, which pops it with the carry-on line, or by writing to it."""

    name = "paused"
    title = "Paused by you"

    def awaiting(self) -> tuple[str, str]:
        return "you to resume it", ""

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.pausing.feature import PausingFeature
        return self.hold(PausingFeature.PAUSED.create())

    def on_user_resumed(self, event: UserResumed, settings: Settings) -> Transition:
        from journal.features.pausing.feature import PausingFeature
        return self.pop(PausingFeature.RESUMED.create()) if event.agent_session == event.session else self.unchanged()
