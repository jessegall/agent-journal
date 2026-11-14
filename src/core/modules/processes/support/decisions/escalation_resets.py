from collections.abc import Sequence

from engine.time.timestamp import Timestamp
from core.modules.processes.support.unreadable.unreadable_mark_registry import UnreadableMarkRegistry


class EscalationResets:
    """The resets of a command's count: a mark that its output cannot be read, and a skip with a reason. Skips are
    not recorded yet, so none has happened."""

    def __init__(self, marks: UnreadableMarkRegistry) -> None:
        self.marks = marks

    def flagged_keys(self, command_keys: Sequence[str]) -> frozenset[str]:
        return self.marks.flagged_among(command_keys)

    def last_flagged_among(self, command_keys: Sequence[str]) -> dict[str, Timestamp | None]:
        return self.marks.last_flagged_among(command_keys)

    def skipped_after(self, command_key: str, timestamp: Timestamp) -> bool:
        return False
