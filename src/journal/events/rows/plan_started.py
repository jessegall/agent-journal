from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class PlanStarted(RowEvent):
    """A plan was started, with the task it started first; 0 when it had none to start and the agent follows it until one opens."""

    plan_id: int
    task_id: int
