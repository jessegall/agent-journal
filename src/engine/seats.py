import os
import time
from dataclasses import asdict, dataclass, field, replace
from pathlib import Path

from engine.sessions import Sessions
from engine.state import State
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
    return SessionSeat.from_json({"terminal": session, **State(runtime.session_file(root, session, SEATED)).all()}).terminal


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


def write_seat(root: Path, session: str, seat: dict) -> None:
    write_json(seat_file(root, session), seat)


class SeatFiles:
    """Every seat.json of one root, read again only when its own file changed."""

    def __init__(self, root: Path):
        self.folder = runtime.sessions(root)
        self.kept: dict[str, tuple[tuple[int, int], Seat]] = {}

    def stamped(self, name: str) -> tuple[tuple[int, int], Seat | None]:
        try:
            found = os.stat(self.folder / name / SEAT)
        except OSError:
            self.kept.pop(name, None)
            return (0, 0), None
        stamp = (found.st_mtime_ns, found.st_size)
        held = self.kept.get(name)
        if held and held[0] == stamp:
            return stamp, held[1]
        raw = read_json(self.folder / name / SEAT, dict, None)
        if raw is None:
            return stamp, None
        seat = Seat.of(raw, name)
        self.kept[name] = (stamp, seat)
        return stamp, seat

    def of(self, name: str) -> Seat:
        seat = self.stamped(name)[1]
        return seat if seat else Seat.of({}, name)

    def all(self, within: float | None = None) -> list[Seat]:
        try:
            names = sorted(entry.name for entry in os.scandir(self.folder) if entry.is_dir())
        except OSError:
            return []
        now = time.time()
        found = []
        for name in names:
            stamp, seat = self.stamped(name)
            if seat and (within is None or now - stamp[0] / 1e9 <= within):
                found.append(seat)
        return found


class SeatFilesSet:
    def __init__(self):
        self.by_root: dict[Path, SeatFiles] = {}

    def of(self, root: Path) -> SeatFiles:
        return self.by_root.setdefault(Path(root), SeatFiles(root))


SEAT_FILES = SeatFilesSet()


def read_seat(root: Path, session: str) -> Seat:
    return SEAT_FILES.of(root).of(session)


def seats(root: Path, within: float | None = None) -> list[Seat]:
    return SEAT_FILES.of(root).all(within)
