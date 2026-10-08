import time
from dataclasses import asdict, dataclass, field, replace
from pathlib import Path

from engine.sessions import Sessions
from engine.stored import read_json, write_json
from engine import runtime
from resources.fields import Loaded

SEAT = "seat.json"
SEATED = "seated.json"

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

    def live_agent(self, sessions: Sessions) -> "LiveAgent":
        environment = sessions.environment(self.session)
        return LiveAgent(self.session, self.provider, self.model, self.status, environment if environment else self.env, self.at, self.terminal)


@dataclass(frozen=True)
class SessionSeat(Loaded):
    terminal: str = ""


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


def live_session(root: Path, session: str, within: float = ONLINE_FOR) -> tuple[Seat, LiveAgent] | None:
    seat = read_seat(root, seated_terminal(root, session))
    if seat.session != session or time.time() - seat.at > within:
        return None
    return seat, seat.live_agent(Sessions(root))


def seated_terminal(root: Path, session: str) -> str:
    return read_json(runtime.session_file(root, session, SEATED), SessionSeat.from_json, SessionSeat(terminal=session)).terminal


def remember_terminal(root: Path, session: str, terminal: str) -> None:
    write_json(runtime.session_file(root, session, SEATED), {"terminal": terminal})


def offline(root: Path, session: str, within: float = ONLINE_FOR) -> str:
    held = Sessions(root).read(session)
    if held.evicted_since_start:
        return f"session {session!r} is not online: session {held.evicted['by']!r} took environment {held.evicted['environment']!r} from it ({held.evicted['why']})"
    seated = [seat for seat in seats(root) if seat.session == session]
    if not seated:
        return f"session {session!r} is not online: no agent's terminal reports it as its session"
    age = time.time() - max(seat.at for seat in seated)
    return f"session {session!r} is not online: its terminal last checked in {age:.0f}s ago, and a session counts as online for {within:.0f}s"


def live(root: Path, within: float = ONLINE_FOR) -> list[tuple[Seat, LiveAgent]]:
    now = time.time()
    sessions = Sessions(root)
    found = {}
    for seat in seats(root, within=within):
        if not seat.session or now - seat.at > within:
            continue
        found[seat.session] = (seat, seat.live_agent(sessions))
    return sorted(found.values(), key=lambda pair: (-pair[1].at, pair[1].session))


def terminal_of(root: Path, session: str) -> str:
    matching = [seat for seat in seats(root) if session in (seat.session, seat.terminal)]
    return max(matching, key=lambda seat: seat.at).terminal if matching else ""


def seat_file(root: Path, session: str) -> Path:
    return runtime.session_file(root, session, SEAT)


def read_seat(root: Path, session: str) -> Seat:
    return Seat.of(read_json(seat_file(root, session), dict, {}), session)


def seats(root: Path, within: float | None = None) -> list[Seat]:
    found, now = [], time.time()
    for path in runtime.sessions(root).glob(f"*/{SEAT}"):
        try:
            if within is not None and now - path.stat().st_mtime > within:
                continue
        except OSError:
            continue
        seat = read_json(path, dict, None)
        if seat is not None:
            found.append(Seat.of(seat, path.parent.name))
    return found
