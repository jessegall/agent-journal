from collections.abc import Sequence

from core.base.command.context import Context
from core.base.database.kept_rows import KeptRows
from core.base.listener.event_rows import EventRows
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.open_dependency import OpenDependency
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_dependency import TaskDependency
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.tasks.support.task_waits import TaskWaits


class DependencyWaits:
    """Keeps a task's waits in line with its dependencies: a task that waits on an open task is blocked with a wait
    on it, and the wait ends once that dependency is no longer open. A started task keeps running."""

    def __init__(self, queries: Queries, repository: Repository, waits: TaskWaits, kept: KeptRows, rows: EventRows) -> None:
        self.queries, self.repository, self.waits, self.kept, self.rows = queries, repository, waits, kept, rows

    def pairs(self) -> tuple[TaskDependency, ...]:
        return self.kept.read("task_dependencies", lambda: tuple(self.queries.query(TaskDependency).all_rows()), name="tasks.dependency_pairs")

    def update_wait(self, task_id: int, dependency_id: int, context: Context) -> None:
        if self.queries.query(OpenDependency).filter(task_id=task_id, dependency_id=dependency_id).exists():
            self.block_dependent(self.queries.query(Task).find(task_id), dependency_id, context)
        else:
            self.waits.resolved(self.pending_waits(task_id, dependency_id), context)

    def update_tasks(self, task_ids: Sequence[int], context: Context) -> None:
        pairs = [pair for pair in self.pairs() if pair.task_id in task_ids or pair.dependency_id in task_ids]
        open_ids = {row.id for row in self.queries.query(OpenDependency).matching(Among("id", tuple(pair.id for pair in pairs))).all_rows()}
        task_ids_waiting = tuple({pair.task_id for pair in pairs})
        self.rows.prepare(Task, task_ids_waiting)
        tasks = {task_id: self.rows.required(Task, task_id) for task_id in task_ids_waiting}
        ended: list[TaskWait] = []
        for pair in pairs:
            if pair.id in open_ids:
                tasks[pair.task_id] = self.block_dependent(tasks[pair.task_id], pair.dependency_id, context)
            else:
                ended.extend(self.pending_waits(pair.task_id, pair.dependency_id))
        self.waits.resolved(ended, context)

    def block_dependent(self, task: Task, dependency_id: int, context: Context) -> Task:
        target = f"tasks:{dependency_id}"
        wait = next((wait for wait in self.waits.pending_task(task.id) if wait.target == target), None)
        if wait is None and task.state in (TaskState.OPEN, TaskState.BLOCKED):
            self.repository.save(TaskWait(task_id=task.id, creator_id=context.actor.id, target=target), context)
        if task.state is not TaskState.OPEN:
            return task
        return self.repository.save_change(task, task.moved(TaskLifecycle.block, reason=f"waits on task {dependency_id}"), context)

    def pending_waits(self, task_id: int, dependency_id: int) -> tuple[TaskWait, ...]:
        target = f"tasks:{dependency_id}"
        return tuple(wait for wait in self.waits.pending_task(task_id) if wait.target == target)
