from core.base.command.context import Context
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.open_dependency import OpenDependency
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.tasks.support.task_waits import TaskWaits


class DependencyWaits:
    """Keeps a task's waits in line with its dependencies: a task that waits on an open task is blocked with a wait
    on it, and the wait ends once that dependency is no longer open. A started task keeps running."""

    def __init__(self, queries: Queries, repository: Repository, waits: TaskWaits) -> None:
        self.queries, self.repository, self.waits = queries, repository, waits

    def update_wait(self, task_id: int, dependency_id: int, context: Context) -> None:
        target = f"tasks:{dependency_id}"
        wait = next((wait for wait in self.waits.pending_task(task_id) if wait.target == target), None)
        if not self.queries.query(OpenDependency).filter(task_id=task_id, dependency_id=dependency_id).exists():
            if wait is not None:
                self.waits.resolved(wait, context)
            return
        task = self.queries.query(Task).find(task_id)
        if wait is None and task.state in (TaskState.OPEN, TaskState.BLOCKED):
            self.repository.save(TaskWait(task_id=task_id, creator_id=context.actor.id, target=target), context)
        if task.state is TaskState.OPEN:
            self.repository.save_change(task, task.moved(TaskLifecycle.block, reason=f"waits on task {dependency_id}"), context)
