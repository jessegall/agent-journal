from core.modules.agents.events.agent_ended import AgentEnded
from suites.coding.support.coding_helper_role import CodingHelperRole
from core.base.change.logged_event import LoggedEvent
from suites.coding.modules.workers.listeners.worker_stop_mark_listener import WorkerStopMarkListener
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant


class WorkerStoppedMarkListener(WorkerStopMarkListener[AgentEnded]):
    """A worker that stops with tasks left shows as a mark in the main chat."""

    name = "workers.stopped-mark"

    def handle(self, event: AgentEnded, logged: LoggedEvent) -> None:
        worker = event.row
        tasks = self.unfinished.rows(worker.id) if worker.role == CodingHelperRole.WORKER else ()
        if tasks and not self.unfinished.has_running_process(worker.id):
            self.show_stop(logged, worker, WorkerMarkVariant.ENDED_EARLY, f"stopped with {len(tasks)} tasks left", tasks)
