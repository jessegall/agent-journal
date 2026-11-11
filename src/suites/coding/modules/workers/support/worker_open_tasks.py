from core.modules.tasks.models.open_dependency import OpenDependency
from core.modules.tasks.models.task import Task
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from suites.coding.modules.workers.support.worker_round import WorkerRound
from suites.coding.modules.workers.support.worker_task_limit import WorkerTaskLimit


class WorkerOpenTasks:
    """The tasks of a worker that it may start now: its ready tasks that wait on no open task, and none once
    it has started as many as it may have started at once."""

    def __init__(self, limit: WorkerTaskLimit, queries: Queries) -> None:
        self.limit, self.queries = limit, queries

    def startable(self, worker_round: WorkerRound) -> tuple[Task, ...]:
        if not worker_round.ready or len(worker_round.started) >= self.limit.maximum():
            return ()
        waiting_ids = {dependency.task_id for dependency in self.queries.query(OpenDependency).matching(Among("task_id", [task.id for task in worker_round.ready])).all_rows()}
        return tuple(task for task in worker_round.ready if task.id not in waiting_ids)
