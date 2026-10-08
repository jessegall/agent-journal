from dataclasses import dataclass
from pathlib import Path

from engine.transcript import page
from features.format import VIEWER, formatted
from providers import PROVIDERS
from providers.base import Provider
from resources.base import Missing

TRANSCRIPT_PAGE = 300
SPOKEN = ("agent", "human", "injected")


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


def paged(found: Transcript | NoTranscript, record, since: int, before: int, last: int) -> dict:
    got = page(found.turns(), since, before, last)
    got["turns"] = [{**t, "said": formatted(t["text"], record, VIEWER)} if t["kind"] in SPOKEN and t["text"] else t for t in got["turns"]]
    return got
