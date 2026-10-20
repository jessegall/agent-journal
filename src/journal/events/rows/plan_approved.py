from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class PlanApproved(RowEvent):
    """A plan was approved, by the user or by a command."""

    plan_id: int
    by_user: bool
