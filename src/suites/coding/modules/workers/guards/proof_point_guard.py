from core.base.guard.guard import Guard
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.support.brief_points import brief_point_count
from core.base.change.created import Created
from core.base.command.context import Context


class ProofPointGuard(Guard[Created[Proof]]):
    """Refuses a proof for a point beyond the points of its task's brief."""

    name = "workers.proof-point-exists"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Created[Proof], context: Context) -> None:
        proof = event.row
        count = brief_point_count(self.queries.query(Task).find(proof.task_id).brief)
        if proof.point > count:
            raise Refusal(f"task {proof.task_id}'s brief has {count} points, not {proof.point}", f"journal task show {proof.task_id} lists them")
