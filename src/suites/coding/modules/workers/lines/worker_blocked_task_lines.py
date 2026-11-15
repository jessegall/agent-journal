from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_channel import LineChannel
from suites.coding.modules.workers.support.worker_unit_stop import WorkerUnitStop
from suites.coding.modules.workers.types.worker import Worker


class WorkerBlockedTaskLines(EventLineSource):
    """A worker that stops with no task left is told of each task of its that is blocked, at its next event, since no
    program carries a line on a stop."""

    key = "workers.stop-once-delivered"
    events = [HookEventName.STOP]
    agent_types = [Worker.key]
    carrier = LineChannel.WAITING

    def __init__(self, stop: WorkerUnitStop) -> None:
        self.stop = stop

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        return self.stop.blocked_lines(agent_id)
