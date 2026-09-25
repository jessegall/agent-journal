import time
from dataclasses import asdict, dataclass, field, replace
from pathlib import Path

from engine.sessions import Sessions
from engine.stored import read_json
from engine import runtime
from engine.fields import Loaded

ONLINE_FOR = 5.0


@dataclass(frozen=True)
class SeatReport(Loaded):
    title: str = ""
    provider: str = ""
    model: str = ""
    status: str = ""
    context: float = 0.0


@dataclass(frozen=True)
class Seat(Loaded):
    aliases = {"reported": ("report",)}
    at: float = 0.0
    agent: str = ""
    state: str = ""
    env: str = ""
    terminal: str = ""
    report: dict = field(default_factory=dict)
    reported: SeatReport = field(default_factory=SeatReport)

    @classmethod
    def of(cls, raw, terminal: str) -> "Seat":
        return replace(cls.from_json(raw), terminal=terminal)

    @property
    def session(self) -> str:
        return self.reported.title

    @property
    def provider(self) -> str:
        return self.reported.provider if self.reported.provider else self.agent

    @property
    def model(self) -> str:
        return self.reported.model

    @property
    def status(self) -> str:
        return self.state if self.state else self.reported.status

    @property
    def context(self) -> float:
        return self.reported.context


@dataclass(frozen=True)
class LiveAgent:
    session: str
    provider: str
    model: str
    status: str
    environment: str
    at: float
    terminal: str

    def to_json(self) -> dict:
        return asdict(self)


def live(root: Path, within: float = ONLINE_FOR) -> list[tuple[Seat, LiveAgent]]:
    now = time.time()
    sessions = Sessions(root)
    found = {}
    for seat in seats(root, within=within):
        if not seat.session or now - seat.at > within:
            continue
        environment = sessions.environment(seat.session)
        found[seat.session] = (seat, LiveAgent(seat.session, seat.provider, seat.model, seat.status, environment if environment else seat.env, seat.at, seat.terminal))
    return sorted(found.values(), key=lambda pair: (-pair[1].at, pair[1].session))


def terminal_of(root: Path, session: str) -> str:
    matching = [seat for seat in seats(root) if session in (seat.session, seat.terminal)]
    return max(matching, key=lambda seat: seat.at).terminal if matching else ""


def seats(root: Path, within: float | None = None) -> list[Seat]:
    found, now = [], time.time()
    for path in runtime.sessions(root).glob("*/seat.json"):
        try:
            if within is not None and now - path.stat().st_mtime > within:
                continue
        except OSError:
            continue
        seat = read_json(path)
        if seat is not None:
            found.append(Seat.of(seat, path.parent.name))
    return found
