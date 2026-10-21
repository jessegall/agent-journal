from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class PlanDone(RowEvent):
    """A plan is done: its last task closed."""

    plan_id: int
