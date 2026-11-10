from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.queue_worker_tests.queue_stalled_tests import QueueStalledTests
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue


class QueueStalledTestsHandler(Handler[QueueStalledTests, None]):
    """Queues the tests a worktree's task in testing waits on when nothing else runs for that worktree, unless
    its worker is still working through a phase, whose tests wait for the phase's end."""

    command = QueueStalledTests
    disabled_scopes = [ActorScope]

    def __init__(self, worktrees: WorktreeQuery, proof_queue: WorkerProofQueue, phases: WorkerPhases) -> None:
        self.worktrees, self.proof_queue, self.phases = worktrees, proof_queue, phases

    def handle(self, command: QueueStalledTests, context: Context) -> None:
        for worktree in self.worktrees.all_worktrees():
            if not self.proof_queue.tests_pending(worktree) and not self.phases.has_group_flow(worktree):
                self.proof_queue.queue_delivered(worktree, context)
