from pathlib import Path

from core.base.provider.provider import Provider
from core.base.provider.transcript_growth import TranscriptGrowth
from core.base.provider.written_row import WrittenRow
from core.base.timestamp import Timestamp


class WrittenRows:
    """What each session file gained, for a server that keeps one object over its hooks so a hook reads only the
    new lines. A row written after the time asked waits here for a later ask, since its own hook may still be on
    its way."""

    def __init__(self) -> None:
        self.growth: dict[Path, TranscriptGrowth] = {}
        self.waiting: dict[Path, list[WrittenRow]] = {}

    def settled(self, provider: Provider, path: Path, written_before: Timestamp) -> list[WrittenRow]:
        lines = self.growth.setdefault(path, TranscriptGrowth(path)).new_lines()
        rows = [*self.waiting.get(path, []), *(row for row in map(provider.written_row, lines) if row is not None)]
        self.waiting[path] = [row for row in rows if row.written_at > written_before]
        return [row for row in rows if row.written_at <= written_before]
