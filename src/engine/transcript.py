import time
from pathlib import Path
from dataclasses import dataclass, field
from datetime import datetime

HUMAN, AGENT, TOOL = "human", "agent", "tool"
INJECTED, TASK, PEER, SENT = "injected", "task", "peer", "sent"
SUMMARY, SUPERSEDED = "summary", "superseded"
IDLE = "idle"
SETTLE, SETTLE_STEP = 1.5, 0.05


@dataclass
class Turn:
    line: int
    who: str
    text: str
    kind: str = ""
    at: float = 0.0
    tools: list[str] = field(default_factory=list)
    parent: str = ""
    asked: list[str] = field(default_factory=list)
    answered: list[str] = field(default_factory=list)


def timestamp(value: str) -> float:
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).timestamp()
    except ValueError:
        return 0.0


def page(turns: list[Turn], since: int = 0, before: int = 0, size: int = 300, cap: int = 20_000) -> dict:
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
                "text": turn.text[:cap],
                "clipped": len(turn.text) > cap,
            }
            for turn in rows
        ],
    }


def search(turns: list[Turn], term: str, page: int = 0, size: int = 25) -> list[Turn]:
    want = term.lower()
    hits = [t for t in reversed(turns) if want in t.text.lower()]
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


TURNS: dict[str, tuple] = {}


def settled(provider, path: Path, agent) -> None:
    until = time.time() + SETTLE
    while agent.status == IDLE and provider.settling(path) and time.time() < until:
        time.sleep(SETTLE_STEP)


def turns(record, agent) -> list:
    from providers import PROVIDERS
    provider = PROVIDERS.get(agent.provider)
    if not provider or not agent.transcript:
        return []
    try:
        settled(provider(), Path(agent.transcript), agent)
        size = Path(agent.transcript).stat().st_size
    except OSError:
        return []
    held = TURNS.get(agent.transcript)
    if not held or held[0] != size:
        held = TURNS[agent.transcript] = (size, [t for t in provider().transcript(agent.transcript) if t.who == "agent" and t.text.strip()])
    return held[1]


def last_turn(record, agent):
    from providers import PROVIDERS
    provider = PROVIDERS.get(agent.provider)
    if not provider or not agent.transcript:
        return None
    settled(provider(), Path(agent.transcript), agent)
    recent = [t for t in provider().tail(agent.transcript) if t.who == "agent" and t.text.strip()] or turns(record, agent)
    return recent[-1] if recent else None


def last_text(record, agent) -> str:
    written = last_turn(record, agent)
    return written.text if written else ""
