from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class ProofShort(RowEvent):
    """A proof was checked and found short: what is missing goes back to the worker that holds the task."""

    task_id: int
    worker_id: int
    point: int
    shortfall: str
