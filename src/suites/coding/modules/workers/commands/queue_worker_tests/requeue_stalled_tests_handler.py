from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.queue_worker_tests.requeue_stalled_tests import RequeueStalledTests
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue


class RequeueStalledTestsHandler(Handler[RequeueStalledTests, None]):
    """Queues the tests a worktree's task in testing waits on when nothing else runs for that worktree."""

    command = RequeueStalledTests
    disabled_scopes = [ActorScope]

    def __init__(self, worktrees: WorktreeQuery, proof_queue: WorkerProofQueue) -> None:
        self.worktrees, self.proof_queue = worktrees, proof_queue

    def handle(self, command: RequeueStalledTests, context: Context) -> None:
        for worktree in self.worktrees.all_worktrees():
            if not self.proof_queue.has_tests_going(worktree):
                self.proof_queue.queue_delivered(worktree, context)
