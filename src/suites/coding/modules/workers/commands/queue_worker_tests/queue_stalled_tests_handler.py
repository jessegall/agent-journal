from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.queue_worker_tests.queue_stalled_tests import QueueStalledTests
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue


class QueueStalledTestsHandler(Handler[QueueStalledTests, None]):
    """Queues the tests a worktree's task in testing waits on when nothing else runs for that worktree."""

    command = QueueStalledTests
    disabled_scopes = [ActorScope]

    def __init__(self, worktrees: WorktreeQuery, proof_queue: WorkerProofQueue) -> None:
        self.worktrees, self.proof_queue = worktrees, proof_queue

    def handle(self, command: QueueStalledTests, context: Context) -> None:
        for worktree in self.worktrees.all_worktrees():
            if not self.proof_queue.tests_pending(worktree):
                self.proof_queue.queue_delivered(worktree, context)
