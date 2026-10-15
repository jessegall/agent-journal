from dataclasses import dataclass

from journal.engine.states.paused import Paused
from journal.engine.transition import Transition
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class CatchingUp(Paused):
    """The conversation was compacted: the latest messages must be read before any other write. journal message recent takes the agent back."""

    name = "catching_up"

    def awaiting(self) -> tuple[str, str]:
        return "a read of the latest messages", ""

    def tool_starting(self, event: ToolStarting) -> Transition:
        from journal.features.messages.feature import Messages
        return self.refuse(Messages.CATCH_UP.about()) if event.writes else self.stay()
