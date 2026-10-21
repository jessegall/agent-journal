from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class PlanAbandoned(RowEvent):
    """A plan was given up, by the user or by a command, with the tasks that were its alone."""

    plan_id: int
    user_origin: bool
