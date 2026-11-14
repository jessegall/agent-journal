from engine.command.bus import Bus
from engine.command.context import Context
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker


class WorkerQueuedStart:
    """Once a worker's delivered work is merged, sends it every task still assigned to it as one new unit, so
    a worker never gets its tasks one merge at a time. A worker with nothing assigned stops and waits for the
    main agent's next batch."""

    def __init__(self, tasks: TaskQuery, bus: Bus) -> None:
        self.tasks, self.bus = tasks, bus

    def start(self, worker_id: int, context: Context) -> None:
        queued_ids = tuple(task.id for task in self.tasks.assigned_ready(worker_id))
        if queued_ids:
            self.bus.run(SendWorker(worker_id, task_ids=queued_ids), context.actor, environment_id=context.environment_id)
