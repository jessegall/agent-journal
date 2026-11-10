from engine.change.logged_event import LoggedEvent
from engine.change.moved import Moved
from core.base.listener.commit_listener import CommitListener
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_instruction_files import WorkerInstructionFiles


class WorkerInstructionTaskListener(CommitListener[Moved[Task]]):
    """When a worker starts a task, the instruction files of its worktree are written again from its profile
    as it is now, where the text differs."""

    name = "workers.instruction-task-start"
    moves = tuple([TaskLifecycle.start])

    def __init__(self, worktrees: WorktreeQuery, files: WorkerInstructionFiles) -> None:
        self.worktrees, self.files = worktrees, files

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        holder_id = event.row.holder_id
        worktree = self.worktrees.worker_worktree(holder_id) if holder_id is not None else None
        if worktree is not None:
            self.files.refresh(worktree)
