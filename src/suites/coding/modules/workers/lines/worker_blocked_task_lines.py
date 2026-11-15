from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.support.worker_unit_stop import WorkerUnitStop
from suites.coding.modules.workers.types.worker import Worker


class WorkerBlockedTaskLines(EventLineSource):
    """A worker that stops with no task left is told of each task of its that is blocked."""

    key = "workers.stop-once-delivered"
    events = [HookEventName.STOP]
    agent_types = [Worker.key]

    def __init__(self, stop: WorkerUnitStop) -> None:
        self.stop = stop

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        return self.stop.blocked_lines(agent_id)
