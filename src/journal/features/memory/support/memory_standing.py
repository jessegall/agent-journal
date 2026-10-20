import re
from dataclasses import dataclass

from journal.features.memory.support.memory_row import MemoryRow


@dataclass(frozen=True)
class MemoryStanding:
    """The memory feature's reading: the context mark the agent owes a decision at, the highest mark it has taken, and every fact, rule and reminder with its keywords."""

    mark_owed: int
    context_mark: int
    rows: tuple[MemoryRow, ...]

    def whispered_by(self, text: str) -> list[MemoryRow]:
        words = set(re.findall(r"[a-z][a-z0-9_-]*", text.lower()))
        return [row for row in self.rows if words & set(row.keywords)]
