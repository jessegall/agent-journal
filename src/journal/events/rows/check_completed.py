from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class CheckCompleted(RowEvent):
    """A check ran: whether it passed, why it could not run when it could not, the end of what it printed, whether it was failing or could not run before and when its failure was last reported, and whether a task waits on it rather than the agent."""

    feature_name = "checks"

    check_id: int
    title: str
    passed: bool
    fault: str
    output: str
    prior_failure: bool
    prior_fault: bool
    wait_target: bool
    failure_reported_at: float
