from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.support.watch_progress import WatchProgress

WATCH_LINES_KEY = "processes.watch-lines"


class WatchLinesLines(EventLineSource):
    """Tells an agent watching a run that it runs, then its progress at each 10 percent."""

    key = WATCH_LINES_KEY
    events = [HookEventName.POST_TOOL_USE]

    def __init__(self, progress: WatchProgress) -> None:
        self.progress = progress

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        return self.progress.progress(event, agent_id).nudges if event is not None else []
