from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.agent_messages.inactive_worker_stop_message import InactiveWorkerStopMessage
from suites.coding.modules.workers.support.inactive_workers import InactiveWorkers

IDLE_WORKER_STOP_KEY = "workers.idle-worker-stop"


class InactiveWorkerStopLines(EventLineSource):
    """Tells the main agent of each idle worker whose process its minute step stops; the worker stays kept."""

    key = IDLE_WORKER_STOP_KEY
    events = [HookEventName.TICK]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, idle: InactiveWorkers) -> None:
        self.inactive_workers = idle

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        return [InactiveWorkerStopMessage.declared().agent_message(worker=worktree.session_agent_id, task=worktree.task_id)
                for worktree in self.inactive_workers.idle(event, agent_id)]
