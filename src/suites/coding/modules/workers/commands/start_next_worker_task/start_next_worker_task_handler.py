from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.tasks.commands.start_task.start_task import StartTask
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.commands.start_next_worker_task.start_next_worker_task import StartNextWorkerTask
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_task_commit import WorkerTaskCommit


class StartNextWorkerTaskHandler(Handler[StartNextWorkerTask, Task]):
    """Commits the worker's current task, moves it to testing and starts the next task delegated to it in the same
    worktree."""

    command = StartNextWorkerTask

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, tasks: TaskQuery, task_commit: WorkerTaskCommit, repository: Repository, bus: Bus) -> None:
        self.queries, self.worktrees, self.tasks, self.task_commit, self.repository, self.bus = queries, worktrees, tasks, task_commit, repository, bus

    def handle(self, command: StartNextWorkerTask, context: Context) -> Task:
        worktree = self.worktrees.worker_worktree(context.actor.id)
        if worktree is None or worktree.state is not WorktreeState.CUT:
            raise Refusal("only a worker with a started task moves to its next", "journal worker-worktree list shows the worktrees")
        following = self.tasks.next_delegated(context.actor.id)
        if following is None:
            raise Refusal(f"task {worktree.task_id} is your last", "journal worker deliver hands in all your tasks")
        task = self.queries.query(Task).find(worktree.task_id)
        self.task_commit.commit(worktree, task)
        self.repository.save(task.moved(TaskLifecycle.test), context)
        self.bus.dispatch(StartTask(following.id), context)
        self.repository.save(worktree.moved(WorktreeLifecycle.advance, task_id=following.id), context)
        return self.queries.query(Task).find(following.id)
