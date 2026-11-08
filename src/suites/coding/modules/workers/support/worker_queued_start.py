from core.base.command.bus import Bus
from core.base.command.context import Context
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask


class WorkerQueuedStart:
    """Starts a worker on the first task queued for it once its delivered work is merged: a task sent while
    the delivery waited stayed with the worker, and the merge frees it to cut a new worktree for that task."""

    def __init__(self, next_task: WorkerNextTask, bus: Bus) -> None:
        self.next_task, self.bus = next_task, bus

    def start(self, worker_id: int, context: Context) -> None:
        queued = self.next_task.following(worker_id)
        if queued is not None:
            self.bus.run(SendWorker(worker_id, task_ids=tuple([queued.id])), context.actor, environment_id=context.environment_id)
