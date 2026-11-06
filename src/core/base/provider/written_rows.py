from collections.abc import Sequence
from pathlib import Path

from core.base.provider.peer_note import PeerNote
from core.base.provider.provider import Provider
from core.base.provider.transcript_growth import TranscriptGrowth
from core.base.provider.written_row import WrittenRow
from core.base.timestamp import Timestamp


class WrittenRows:
    """What each session file gained, for a server that keeps one object over its hooks so a hook reads only the
    new lines, and reads them once for all who ask. A row written after the time asked waits here for a later ask,
    since its own hook may still be on its way."""

    def __init__(self) -> None:
        self.growth: dict[Path, TranscriptGrowth] = {}
        self.waiting: dict[Path, list[WrittenRow]] = {}
        self.notes: dict[Path, list[PeerNote]] = {}

    def settled(self, provider: Provider, path: Path, written_before: Timestamp) -> list[WrittenRow]:
        self.read(provider, path)
        rows = self.waiting[path]
        self.waiting[path] = [row for row in rows if row.written_at > written_before]
        return [row for row in rows if row.written_at <= written_before]

    def peer_notes(self, provider: Provider, path: Path) -> Sequence[PeerNote]:
        self.read(provider, path)
        notes = self.notes[path]
        self.notes[path] = []
        return notes

    def read(self, provider: Provider, path: Path) -> None:
        lines = self.growth.setdefault(path, TranscriptGrowth(path)).new_lines()
        self.waiting.setdefault(path, []).extend(row for row in map(provider.written_row, lines) if row is not None)
        self.notes.setdefault(path, []).extend(note for line in lines for note in provider.peer_note(line))
