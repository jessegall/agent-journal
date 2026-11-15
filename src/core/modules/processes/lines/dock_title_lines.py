from dataclasses import replace

from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.support.run_docking import LONG_RUN_DOCK_KEY, RunDocking


class DockTitleLines(EventLineSource):
    """Asks for a title for each docked run whose output has none, as its line's interval allows; the hold
    LongRunDockNeeds plans holds the agent's tools after five uses until it gives one."""

    key = LONG_RUN_DOCK_KEY
    events = list(HookEventName)

    def __init__(self, docking: RunDocking) -> None:
        self.docking = docking

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        # the hold is LongRunDockNeeds', so the line opens no required-command hold of its own
        return [replace(nudge, required_command="") for nudge in self.docking.docked(event, agent_id).nudges]
