from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.agent_messages.inactive_worker_stop_message import InactiveWorkerStopMessage
from suites.coding.modules.workers.support.idle_workers import IdleWorkers

IDLE_WORKER_STOP_KEY = "workers.idle-worker-stop"


class InactiveWorkerStopLines(EventLineSource):
    """Tells the main agent of each idle worker whose process its minute step stops; the worker stays kept."""

    key = IDLE_WORKER_STOP_KEY
    events = [HookEventName.TICK]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, idle: IdleWorkers, numbers: RowNumbers) -> None:
        self.idle_workers, self.numbers = idle, numbers

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        return [InactiveWorkerStopMessage.declared().agent_message(worker=self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id), task=worktree.task_id)
                for worktree in self.idle_workers.idle(event, agent_id)]
