import re
from dataclasses import dataclass

from journal.features.memory.support.memory_row import MemoryRow


@dataclass(frozen=True)
class MemoryData:
    """The memory feature's reading: the context mark the agent owes a decision at, the highest mark it has taken, every fact, rule and reminder with its keywords, the ones standing at least the set days named with their age, each with its presence in the agent's context window."""

    mark_owed: int
    context_mark: int
    rows: tuple[MemoryRow, ...]
    stale: tuple[str, ...]

    def whispered_by(self, text: str) -> list[MemoryRow]:
        terms = set(re.findall(r"[a-z][a-z0-9_-]*", text.lower()))
        return [row for row in self.rows if terms & set(row.keywords) and not row.presence]
