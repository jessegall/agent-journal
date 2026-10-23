from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class PlanReviewed(RowEvent):
    """Every reviewer of a plan in review is back, so what they found waits to be put into the plan."""

    plan_id: int
