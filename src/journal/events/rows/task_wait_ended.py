from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class TaskWaitEnded(RowEvent):
    """What a parked task waited on came, with the reason as a clause: task 12 it waited on is done. The task stays parked until it is resumed."""

    task_id: int
    reason: str
