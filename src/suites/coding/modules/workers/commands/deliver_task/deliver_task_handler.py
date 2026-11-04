
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from suites.coding.modules.workers.commands.deliver_task.deliver_task import DeliverTask
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue
from suites.coding.modules.workers.support.worker_task_commit import WorkerTaskCommit


class DeliverTaskHandler(Handler[DeliverTask, Task]):
    """Hands in all a worker's tasks together, which a queued task refuses: commits its worktree, moves every task it
    holds started to testing, delivers the worktree and queues the tests of its proofs."""

    command = DeliverTask
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, proof_queue: WorkerProofQueue, repository: Repository, task_commit: WorkerTaskCommit, tasks: TaskQuery) -> None:
        self.queries, self.worktrees, self.proof_queue, self.repository, self.task_commit, self.tasks = queries, worktrees, proof_queue, repository, task_commit, tasks

    def handle(self, command: DeliverTask, context: Context) -> Task:
        worktree = self.worktrees.worker_worktree(context.actor.id)
        if worktree is None or worktree.state is not WorktreeState.CUT:
            raise Refusal("only a worker with a started task delivers", "journal worker-worktree list shows the worktrees")
        following = self.tasks.next_delegated(context.actor.id)
        if following is not None:
            raise Refusal(f"task {following.id} is still in your queue, and all your tasks are handed in together", "journal worker next")
        committed = self.task_commit.commit(worktree, self.queries.query(Task).find(worktree.task_id), context)
        for started in tuple(self.tasks.holder(context.actor.id).started().all_rows()):
            self.repository.save(started.moved(TaskLifecycle.test), context)
        self.proof_queue.queue(self.repository.save(committed.moved(WorktreeLifecycle.deliver), context), context)
        return self.queries.query(Task).find(worktree.task_id)
