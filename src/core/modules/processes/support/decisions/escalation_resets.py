from collections.abc import Sequence

from engine.time.timestamp import Timestamp
from core.modules.processes.support.reading.unreadable_marks import UnreadableMarks


class EscalationResets:
    """The resets of a command's count: a mark that its output cannot be read, and a skip with a reason. Skips are
    not recorded yet, so none has happened."""

    def __init__(self, marks: UnreadableMarks) -> None:
        self.marks = marks

    def marked_keys(self, command_keys: Sequence[str]) -> frozenset[str]:
        return self.marks.marked_among(command_keys)

    def last_marked_at(self, command_key: str) -> Timestamp | None:
        return self.marks.last_marked_at(command_key)

    def skipped_since(self, command_key: str, timestamp: Timestamp) -> bool:
        return False
