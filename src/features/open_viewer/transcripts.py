from dataclasses import asdict, dataclass
from pathlib import Path

from engine.transcript import page
from features.format import VIEWER, formatted
from providers import PROVIDERS
from providers.base import Provider
from resources.base import Missing

TRANSCRIPT_PAGE = 300
SPOKEN = ("agent", "human", "injected")


@dataclass(frozen=True)
class Entry:
    line: int
    text: str
    said: str


@dataclass(frozen=True)
class Transcript:
    provider: Provider
    path: Path

    def turns(self) -> list:
        return self.provider.turns(self.path)

    def links(self) -> list:
        return self.provider.work_links(self.path)


class NoTranscript:
    def turns(self) -> list:
        return []

    def links(self) -> list:
        return []


def transcript_at(row, subagent: str) -> Transcript | NoTranscript:
    kept = row.provider in PROVIDERS and row.transcript
    if not subagent:
        return Transcript(PROVIDERS[row.provider](), Path(row.transcript)) if kept else NoTranscript()
    known = kept and any(r.get("session") == subagent for r in row.subagent_rows)
    path = PROVIDERS[row.provider]().subagent_transcript(Path(row.transcript), subagent) if known else None
    if not path:
        raise Missing("no such subagent session")
    return Transcript(PROVIDERS[row.provider](), path)


def paged(found: Transcript | NoTranscript, since: int, before: int, last: int) -> dict:
    return page(found.turns(), since, before, last)


def whole(found: Transcript | NoTranscript, record, line: int) -> dict:
    """The whole text of one entry of the log, asked for when it is opened."""
    turn = next((turn for turn in found.turns() if turn.line == line), None)
    if turn is None:
        raise Missing(f"no entry {line} in this transcript")
    return asdict(Entry(turn.line, turn.text, formatted(turn.text, record, VIEWER) if turn.kind in SPOKEN and turn.text else ""))
