from core.base.change.moved import Moved
from engine.command.context import Context
from core.base.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery

WAITING_STATES = (TaskState.OPEN, TaskState.BLOCKED)


class StartedWorkerTaskListener(SaveListener[Moved[Task]]):
    """When a worker starts a task assigned to it while its current task is still open or blocked, the started task
    becomes its current task, so the worker can make proofs for and hand in the task it works on."""

    name = "workers.started-task"
    moves = tuple([TaskLifecycle.start])
    disabled_scopes = [ActorScope]

    def __init__(self, worktrees: WorktreeQuery, queries: Queries, repository: Repository) -> None:
        self.worktrees, self.queries, self.repository = worktrees, queries, repository

    def handle(self, event: Moved[Task], context: Context) -> None:
        task = event.row
        worktree = self.worktrees.worker_worktree(task.delegated_to) if task.delegated_to is not None else None
        if worktree is None or worktree.task_id == task.id or worktree.state is not WorktreeState.CUT:
            return
        if self.queries.query(Task).find(worktree.task_id).state not in WAITING_STATES:
            return
        self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.advance, task_id=task.id), context)
