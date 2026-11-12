from core.modules.tasks.models.open_dependency import OpenDependency
from core.modules.tasks.models.task import Task
from engine.database.kept_rows import KeptRows
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from suites.coding.modules.workers.support.unpassed_checkpoints import UnpassedCheckpoints
from suites.coding.modules.workers.support.worker_round import WorkerRound
from suites.coding.modules.workers.support.worker_task_limit import WorkerTaskLimit


class WorkerOpenTasks:
    """The tasks of a worker that it may start now: its ready tasks that wait on no open task and come after
    no checkpoint phase that has not passed, and none once it has started as many as it may have started at
    once."""

    def __init__(self, limit: WorkerTaskLimit, queries: Queries, kept: KeptRows, checkpoints: UnpassedCheckpoints) -> None:
        self.limit, self.queries, self.kept, self.checkpoints = limit, queries, kept, checkpoints

    def startable(self, worker_round: WorkerRound) -> tuple[Task, ...]:
        return self.startable_tasks(worker_round.worker_id, worker_round.ready, len(worker_round.started))

    def startable_tasks(self, worker_id: int, ready: tuple[Task, ...], started_count: int) -> tuple[Task, ...]:
        if not ready or started_count >= self.limit.maximum():
            return ()
        task_ids = tuple(sorted(task.id for task in ready))
        waiting_ids = {*self.dependent_ids(task_ids), *self.checkpoints.blocking_places(task_ids, worker_id)}
        return tuple(task for task in ready if task.id not in waiting_ids)

    def dependent_ids(self, task_ids: tuple[int, ...]) -> tuple[int, ...]:
        tasks = self.queries.query(Task).matching(Among("id", task_ids))
        return self.kept.read(tasks, lambda: tuple(dependency.task_id for dependency in self.queries.query(OpenDependency).matching(Among("task_id", task_ids)).all_rows()),
                              name="workers.startable_dependent_ids")
