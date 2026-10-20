import threading
from pathlib import Path

from journal.http.transcripts.transcript_read import TranscriptRead
from journal.providers.provider import Provider
from journal.providers.support.turn import Turn

KEPT = 8
"""How many transcripts' turns are kept between polls, the ones polled last."""


class TranscriptTurns:
    """The turns of the transcripts the viewer polls, kept between polls, so a poll parses only the lines written since the last."""

    def __init__(self) -> None:
        self.reads: dict[Path, TranscriptRead] = {}
        self._lock = threading.Lock()

    def of(self, provider: Provider, path: Path) -> list[Turn]:
        with self._lock:
            had = self.reads.pop(path, TranscriptRead())
        read = (TranscriptRead() if path.stat().st_size < had.offset else had).further(provider, path)
        with self._lock:
            self.reads[path] = read
            for stale in list(self.reads)[:-KEPT]:
                del self.reads[stale]
        return list(read.turns)
