from core.base.query.queries import Queries
from core.base.refusal import Refusal
from suites.coding.modules.checks.models.check import Check


class KeptChecks:
    """Finds a check that is not removed, or says it is."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def find(self, check_id: int) -> Check:
        check = self.queries.query(Check).find(check_id)
        if check.removed_at is not None:
            raise Refusal(f"check {check.id} is removed already", "journal check list shows the others")
        return check
