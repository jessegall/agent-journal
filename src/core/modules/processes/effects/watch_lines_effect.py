from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.lines.watch_lines_lines import WATCH_LINES_KEY
from core.modules.processes.support.watch_progress import WatchProgress


class WatchLinesEffect(EventEffect):
    """Records the percent each watch line gave, so a run's progress is told only as it passes each step."""

    key = WATCH_LINES_KEY
    events = [HookEventName.POST_TOOL_USE]

    def __init__(self, progress: WatchProgress) -> None:
        self.progress = progress

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        return self.progress.progress(event, agent_id).commands if event is not None else []
