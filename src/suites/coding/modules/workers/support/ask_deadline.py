from dataclasses import dataclass

from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.models.merger_line import MergerLine


@dataclass(frozen=True)
class AskDeadline:
    """When a worker's question needs the merger again and when it goes to the main agent, read from the times
    and the read count stored on its line. A setting changed later moves no stored time."""

    is_closed: bool
    due_at: Timestamp | None
    forward_at: Timestamp | None
    reads: int
    visits_limit: int

    @classmethod
    def from_line(cls, line: MergerLine, visits_limit: int) -> "AskDeadline":
        return cls(not line.is_open_question(), line.due_at, line.forward_at, line.reads, visits_limit)

    def is_answer_overdue(self, timestamp: Timestamp) -> bool:
        return not self.is_closed and self.due_at is not None and timestamp >= self.due_at

    def is_forward_due(self, timestamp: Timestamp) -> bool:
        if self.is_closed:
            return False
        return self.reads >= self.visits_limit or (self.forward_at is not None and timestamp >= self.forward_at)
