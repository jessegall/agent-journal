from collections.abc import Sequence
from pathlib import Path

from core.base.provider.peer_note import PeerNote
from core.base.provider.provider import Provider
from core.base.provider.transcript_growth import TranscriptGrowth
from core.base.provider.transcript_entry import TranscriptEntry
from engine.time.timestamp import Timestamp


class TranscriptEntries:
    """Read new transcript entries once and retain entries until their cutoff."""

    def __init__(self) -> None:
        self.growth: dict[Path, TranscriptGrowth] = {}
        self.waiting: dict[Path, list[TranscriptEntry]] = {}
        self.notes: dict[Path, list[PeerNote]] = {}

    def read_ready(self, provider: Provider, path: Path, cutoff_at: Timestamp) -> list[TranscriptEntry]:
        self.read(provider, path)
        rows = self.waiting[path]
        self.waiting[path] = [row for row in rows if row.created_at > cutoff_at]
        return [row for row in rows if row.created_at <= cutoff_at]

    def peer_notes(self, provider: Provider, path: Path) -> Sequence[PeerNote]:
        self.read(provider, path)
        notes = self.notes[path]
        self.notes[path] = []
        return notes

    def recent(self, provider: Provider, path: Path, cutoff_at: Timestamp) -> Sequence[TranscriptEntry]:
        self.read(provider, path)
        return [row for row in self.waiting[path] if row.created_at >= cutoff_at]

    def read(self, provider: Provider, path: Path) -> None:
        lines = self.growth.setdefault(path, TranscriptGrowth(path)).new_lines()
        self.waiting.setdefault(path, []).extend(row for row in map(provider.transcript_entry, lines) if row is not None)
        self.notes.setdefault(path, []).extend(note for line in lines for note in provider.peer_note(line))
