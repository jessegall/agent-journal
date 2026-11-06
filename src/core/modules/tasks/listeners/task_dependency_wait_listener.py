from core.base.change.changed import Changed
from core.base.change.created import Created
from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.open_dependency import OpenDependency
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_dependency import TaskDependency
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.tasks.support.task_waits import TaskWaits


class TaskDependencyWaitListener(SaveListener[Changed[Task] | Created[TaskDependency] | Deleted[TaskDependency]]):
    """A task that waits on an open task is blocked with a wait on it, and opens by itself once nothing it waits on
    is open: the other task completed, cancelled or removed, the dependency removed, or the other task now with the
    same worker. A started task keeps running."""

    name = "tasks.dependency-waits"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository, waits: TaskWaits) -> None:
        self.queries, self.repository, self.waits = queries, repository, waits

    def handle(self, event: Changed[Task] | Created[TaskDependency] | Deleted[TaskDependency], context: Context) -> None:
        row = event.row
        if isinstance(row, TaskDependency):
            self.settled(row.task_id, row.dependency_id, context)
            return
        if isinstance(event, Deleted) or (event.old_row is not None and (event.old_row.state, event.old_row.delegated_to) == (row.state, row.delegated_to)):
            return
        dependencies = self.queries.query(TaskDependency)
        for dependent in tuple(dependencies.filter(dependency_id=row.id).all_rows()):
            self.settled(dependent.task_id, row.id, context)
        for dependency in tuple(dependencies.filter(task_id=row.id).all_rows()):
            self.settled(row.id, dependency.dependency_id, context)

    def settled(self, task_id: int, dependency_id: int, context: Context) -> None:
        target = f"tasks:{dependency_id}"
        wait = next((wait for wait in self.waits.pending_task(task_id) if wait.target == target), None)
        is_open = self.queries.query(OpenDependency).filter(task_id=task_id, dependency_id=dependency_id).exists()
        if not is_open:
            if wait is not None:
                self.waits.resolved(wait, context)
            return
        task = self.queries.query(Task).find(task_id)
        if wait is None and task.state in (TaskState.OPEN, TaskState.BLOCKED):
            self.repository.save(TaskWait(task_id=task_id, creator_id=context.actor.id, target=target), context)
        if task.state is TaskState.OPEN:
            self.repository.save_change(task, task.moved(TaskLifecycle.block, reason=f"waits on task {dependency_id}"), context)
