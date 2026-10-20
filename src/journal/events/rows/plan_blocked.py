from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class PlanBlocked(RowEvent):
    """A plan was blocked, with why."""

    plan_id: int
    why: str
