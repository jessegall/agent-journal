from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class PlanOpenedAgain(RowEvent):
    """A blocked plan was opened again, with what came."""

    plan_id: int
    why: str
