from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class CheckCompleted(RowEvent):
    """A check ran: whether it passed, the end of what it printed, whether it was failing before, and whether a task waits on it rather than the agent."""

    check_id: int
    title: str
    passed: bool
    output: str
    prior_failure: bool
    wait_target: bool
