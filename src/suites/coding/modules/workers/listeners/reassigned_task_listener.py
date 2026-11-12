from core.modules.assignments.support.assignments import Assignments

from engine.listener.save_listener import SaveListener
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_task_advance import WorkerTaskAdvance
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from engine.event.moved import Moved
from engine.command.context import Context
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask


class ReassignedTaskListener(SaveListener[Moved[Task]]):
    """A task taken from a worker that was working on it moves the worker on to its next task, and so does one the
    worker released itself, which also leaves its queue; what the worker committed stays on its branch."""

    name = "workers.taken-task"
    moves = tuple([TaskLifecycle.release])
    disabled_scopes = [ActorScope]

    def __init__(self, tasks: TaskQuery, worktrees: WorktreeQuery, advance: WorkerTaskAdvance, repository: Repository, next_task: WorkerNextTask, assignments: Assignments) -> None:
        self.next_task, self.assignments = next_task, assignments
        self.tasks, self.worktrees, self.advance, self.repository = tasks, worktrees, advance, repository

    def handle(self, event: Moved[Task], context: Context) -> None:
        old, new = event.old_row, event.row
        if old is None or old.holder_id is None:
            return
        worker_released = self.assignments.actor(new) == old.holder_id
        if worker_released and context.actor.id != old.holder_id:
            return
        if worker_released:
            self.assignments.unassign(new, context)
        worktree = self.worktrees.worker_worktree(old.holder_id)
        if worktree is None or not worktree.has_cut_task(old.id):
            return
        following = self.next_task.following(old.holder_id)
        if following is None:
            finished = self.tasks.holder(old.holder_id).filter(state=TaskState.TESTING).first()
            if finished is not None:
                self.repository.save(worktree.moved(WorktreeLifecycle.advance, task_id=finished.id), context)
            return
        if worker_released:
            self.advance.next_task(worktree, following, context)
        else:
            self.advance.after_reassigned_task(worktree, old, following, context)
