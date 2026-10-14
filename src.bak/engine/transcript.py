from functools import cached_property
from dataclasses import dataclass, field
from datetime import datetime
from typing import TypedDict

from resources.text import digest

from resources.types import IDLE

from resources.turns import AGENT, HUMAN, INJECTED, PEER, SENT, SUMMARY, SUPERSEDED, TASK, TOOL  # noqa: F401


@dataclass(frozen=True)
class PeerNote:
    direction: str
    address: str
    name: str | None = None


@dataclass
class Turn:
    line: int
    who: str
    text: str = ""
    kind: str = ""
    at: float = 0.0
    tools: list[str] = field(default_factory=list)
    parent: str = ""
    asked: list[str] = field(default_factory=list)
    answered: list[str] = field(default_factory=list)
    peer: PeerNote | None = None

    @property
    def key(self) -> str:
        return f"transcript:{self.at}:{digest(self.text, 12)}"

    @cached_property
    def lowered(self) -> str:
        return self.text.lower()

    def __getstate__(self) -> dict:
        return {name: value for name, value in self.__dict__.items() if name != "lowered"}

    @property
    def has_agent_text(self) -> bool:
        return self.who == "agent" and bool(self.text.strip())


def timestamp(value: str) -> float:
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).timestamp()
    except ValueError:
        return 0.0


class TranscriptPage(TypedDict):
    total: int
    first: int
    turns: list[dict]


def page(turns: list[Turn], since: int = 0, before: int = 0, size: int = 300) -> TranscriptPage:
    """A page of the log: what a person said and the agent answered in full, and every other entry as its heading alone, its text asked for when it is opened."""
    kept = [turn for turn in turns if turn.line > since and (not before or turn.line < before)]
    rows = kept[-max(1, min(size, 1000)):]
    return {
        "total": len(turns),
        "first": turns[0].line if turns else 0,
        "turns": [
            {
                "line": turn.line,
                "who": turn.who,
                "kind": turn.kind,
                "at": turn.at,
                "tools": turn.tools,
                "text": turn.text if turn.kind in (HUMAN, AGENT) else "",
                "has_text": bool(turn.text),
            }
            for turn in rows
        ],
    }


def search(turns: list[Turn], term: str, page: int = 0, size: int = 25) -> list[Turn]:
    want = term.lower()
    hits = [t for t in reversed(turns) if want in t.lowered]
    return hits[page * size:(page + 1) * size]


def conversation(turns: list[Turn], back: int = 1) -> list[Turn]:
    marks = [i for i, t in enumerate(turns) if t.who == "summary"]
    if len(marks) < back:
        return turns[:marks[0]] if marks else turns
    end = marks[-back]
    start = marks[-back - 1] + 1 if len(marks) > back else 0
    return turns[start:end]


def user(turns: list[Turn]) -> list[Turn]:
    return [t for t in turns if t.who == "user" and t.kind != SUPERSEDED]
