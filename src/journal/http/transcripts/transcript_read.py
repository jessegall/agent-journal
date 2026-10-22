from dataclasses import dataclass
from pathlib import Path

from journal.providers.provider import Provider
from journal.providers.support.turn import Turn


@dataclass(frozen=True)
class TranscriptRead:
    """How far a transcript was read: the bytes and lines taken, and the turns they held."""

    offset: int = 0
    lines: int = 0
    turns: tuple[Turn, ...] = ()

    def more(self, provider: Provider, path: Path) -> "TranscriptRead":
        with path.open("rb") as file:
            file.seek(self.offset)
            saved = file.read()
        full = saved[: saved.rfind(b"\n") + 1]
        if not full:
            return self
        text = full.decode(errors="replace")
        return TranscriptRead(self.offset + len(full), self.lines + len(text.splitlines()), self.turns + tuple(provider.turn_rows(Provider.rows(text, self.lines))))
