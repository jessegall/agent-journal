from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.support.orphan_check import OrphanCheck

ORPHAN_PROCESS_KEY = "processes.orphan-process"


class OrphanProcessLines(EventLineSource):
    """Tells the agent of each run of its that was lost."""

    key = ORPHAN_PROCESS_KEY
    events = [HookEventName.TICK]

    def __init__(self, check: OrphanCheck) -> None:
        self.check = check

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        return self.check.orphaned(event, agent_id).nudges
