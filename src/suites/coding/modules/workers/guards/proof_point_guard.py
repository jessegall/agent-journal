from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.tasks.task import Task
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.support.brief_points import brief_point_count


class ProofPointGuard(Guard):
    """Refuses a proof for a point beyond the points of its task's brief."""

    name = "workers.proof-point-exists"
    event = "proof.create"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, change: Change[Model]) -> None:
        proof = change.row
        if not isinstance(proof, Proof):
            return
        count = brief_point_count(self.queries.query(Task).find(proof.task_id).brief)
        if proof.point > count:
            raise Refusal(f"task {proof.task_id}'s brief has {count} points, not {proof.point}", f"journal task show {proof.task_id} lists them")
