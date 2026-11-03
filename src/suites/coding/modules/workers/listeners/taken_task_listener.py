from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_task_advance import WorkerTaskAdvance


class TakenTaskListener(SaveListener):
    """A task taken from a worker that was working on it moves the worker on to its next task; what the worker
    committed stays on its branch."""

    name = "workers.taken-task"
    event = "task.release"

    def __init__(self, tasks: TaskQuery, worktrees: WorktreeQuery, advance: WorkerTaskAdvance) -> None:
        self.tasks, self.worktrees, self.advance = tasks, worktrees, advance

    def handle(self, change: Change[Model]) -> None:
        old, new = change.old_row, change.new_row
        if not isinstance(old, Task) or not isinstance(new, Task) or old.holder_id is None or new.delegated_to in (None, old.holder_id):
            return
        worktree = self.worktrees.worker_worktree(old.holder_id)
        if worktree is None or worktree.task_id != old.id or worktree.state is not WorktreeState.CUT:
            return
        following = self.tasks.next_delegated(old.holder_id)
        if following is not None:
            self.advance.after_taken_task(worktree, old, following, change.context)
