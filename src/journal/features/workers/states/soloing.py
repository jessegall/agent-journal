from dataclasses import dataclass

from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_starting import ToolStarting
from journal.features.tasks.states.ready import Ready

DISPATCHES = ("journal worker dispatch", "journal worker say")


@dataclass(frozen=True)
class Soloing(Ready):
    """The solo mode state: the agent does everything itself, and a worker's dispatch is refused."""

    name = "soloing"
    title = "Working alone"

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        if any(part.text.startswith(DISPATCHES) for part in event.call.parts):
            return self.refuse(Workers.SOLO_DISPATCH.create())
        return super().on_tool_starting(event, settings)
