import time
from dataclasses import asdict, dataclass, field
from pathlib import Path

from engine.sessions import Sessions
from engine.stored import read_json
from engine import runtime
from engine.fields import mapping_of, number_of, text_of

ONLINE_FOR = 5.0


@dataclass(frozen=True)
class SeatReport:
    title: str = ""
    provider: str = ""
    model: str = ""
    status: str = ""
    context: float = 0.0

    @classmethod
    def from_json(cls, raw: dict) -> "SeatReport":
        return cls(text_of(raw, "title"), text_of(raw, "provider"), text_of(raw, "model"), text_of(raw, "status"), number_of(raw, "context"))


@dataclass(frozen=True)
class Seat:
    at: float
    agent: str
    state: str
    env: str
    terminal: str
    report: dict = field(default_factory=dict)
    reported: SeatReport = field(default_factory=SeatReport)

    @classmethod
    def from_json(cls, raw, terminal: str = "") -> "Seat":
        raw = raw if isinstance(raw, dict) else {}
        report = mapping_of(raw, "report")
        return cls(number_of(raw, "at"), text_of(raw, "agent"), text_of(raw, "state"), text_of(raw, "env"), terminal, report, SeatReport.from_json(report))

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
            found.append(Seat.from_json(seat, path.parent.name))
    return found
