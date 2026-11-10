from core.base.listener.event_rows import EventRows
from engine.errors.refusal import Refusal
from suites.coding.modules.checks.models.check import Check


class KeptChecks:
    """Finds a check that is not removed, or says it is."""

    def __init__(self, rows: EventRows) -> None:
        self.rows = rows

    def find(self, check_id: int) -> Check:
        check = self.rows.required(Check, check_id)
        if check.removed_at is not None:
            raise Refusal(f"check {check.id} is removed already", "journal check list shows the others")
        return check
