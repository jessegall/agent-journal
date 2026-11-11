from engine.actor.actor import Actor
from engine.command.context import Context
from engine.event.moved import Moved
from engine.listener.event_rows import EventRows
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from core.modules.plans.support.task_plans import TaskPlans
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test_handler import RecordWorkerTestHandler
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree


class CheckedProofListener(SaveListener[Moved[Proof]]):
    """When the main agent or a person checks a proof, the tasks of its worktree whose proofs are all checked
    are completed. A proof the journal checked by its test, a proof of a merged worktree and a proof of a
    task of a started plan are settled where their result is recorded."""

    name = "workers.checked-proof"
    moves = tuple([ProofLifecycle.check])
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, plans: TaskPlans, results: RecordWorkerTestHandler) -> None:
        self.rows, self.plans, self.results = rows, plans, results

    def handle(self, event: Moved[Proof], context: Context) -> None:
        if context.actor == Actor.core():
            return
        worktree = self.rows.required(Worktree, event.row.worktree_id)
        if worktree.merged_at is not None or self.plans.is_started_plan(event.row.task_id):
            return
        self.results.finish_checked(worktree, context)
