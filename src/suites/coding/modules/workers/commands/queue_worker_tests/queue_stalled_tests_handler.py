from engine.command.context import Context
from engine.command.handler import Handler
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.queue_worker_tests.queue_stalled_tests import QueueStalledTests
from core.modules.plans.support.task_plans import TaskPlans
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue


class QueueStalledTestsHandler(Handler[QueueStalledTests, None]):
    """Queues the tests a worktree's task in testing waits on when nothing else runs for that worktree. In a started
    plan no test is queued: a shown proof of a task in testing is committed, as a commit of the worker does,
    and its test waits for a checkpoint of the plan. A committed proof is left as it is."""

    command = QueueStalledTests
    disabled_scopes = [ActorScope]

    def __init__(self, worktrees: WorktreeQuery, proof_queue: WorkerProofQueue, plans: TaskPlans) -> None:
        self.worktrees, self.proof_queue, self.plans = worktrees, proof_queue, plans

    def handle(self, command: QueueStalledTests, context: Context) -> None:
        worktrees = self.worktrees.all_worktrees()
        self.plans.prepare([worktree.task_id for worktree in worktrees])
        for worktree in worktrees:
            if self.plans.is_started_plan(worktree.task_id):
                self.proof_queue.move_delivered(worktree, ProofLifecycle.commit, context)
            elif not self.proof_queue.tests_pending(worktree):
                self.proof_queue.move_delivered(worktree, ProofLifecycle.queue, context)
