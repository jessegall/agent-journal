from dataclasses import replace

from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_task_advance import WorkerTaskAdvance
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle


class ReassignedTaskListener(SaveListener):
    """A task taken from a worker that was working on it moves the worker on to its next task, and so does one the
    worker released itself, which also leaves its queue; what the worker committed stays on its branch."""

    name = "workers.taken-task"
    event = "task.release"
    disabled_scopes = [ActorScope]

    def __init__(self, tasks: TaskQuery, worktrees: WorktreeQuery, advance: WorkerTaskAdvance, repository: Repository) -> None:
        self.tasks, self.worktrees, self.advance, self.repository = tasks, worktrees, advance, repository

    def handle(self, change: Change[Model]) -> None:
        old, new = change.old_row, change.new_row
        if not isinstance(old, Task) or not isinstance(new, Task) or old.holder_id is None:
            return
        worker_released = new.delegated_to == old.holder_id
        if worker_released and change.context.actor.id != old.holder_id:
            return
        if worker_released:
            self.repository.save(replace(new, move=None, delegated_to=None), change.context)
        worktree = self.worktrees.worker_worktree(old.holder_id)
        if worktree is None or not worktree.has_cut_task(old.id):
            return
        following = self.tasks.next_delegated(old.holder_id)
        if following is None:
            finished = self.tasks.holder(old.holder_id).filter(state=TaskState.TESTING).page(1, 1).rows
            if finished:
                self.repository.save(worktree.moved(WorktreeLifecycle.advance, task_id=finished[0].id), change.context)
            return
        if worker_released:
            self.advance.next_task(worktree, following, change.context)
        else:
            self.advance.after_reassigned_task(worktree, old, following, change.context)
