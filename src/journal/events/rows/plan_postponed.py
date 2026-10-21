from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class PlanPostponed(RowEvent):
    """A plan was postponed, by the user or by a command: its task in hand was parked with it."""

    plan_id: int
    by_user: bool
