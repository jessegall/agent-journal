import re
from dataclasses import dataclass

from journal.features.memory.support.memory_row import MemoryRow
from journal.features.memory.support.timed_reminder import TimedReminder


@dataclass(frozen=True)
class MemoryData:
    """The memory feature's reading: the context mark the agent owes a decision at, the highest mark it has taken, every fact, rule and reminder with its keywords, the ones standing at least the set days named with their age, each with its presence in the agent's context window, and the reminders set for a moment."""

    threshold_due: int
    context_threshold: int
    rows: tuple[MemoryRow, ...]
    stale: tuple[str, ...]
    timed: tuple[TimedReminder, ...] = ()

    def due(self, time: float) -> list[TimedReminder]:
        return [reminder for reminder in self.timed if reminder.due_at <= time]

    def hinted(self, text: str) -> list[MemoryRow]:
        terms = set(re.findall(r"[a-z][a-z0-9_-]*", text.lower()))
        return [row for row in self.rows if terms & set(row.keywords) and not row.presence]
