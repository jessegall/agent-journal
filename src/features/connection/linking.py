from dataclasses import dataclass
from pathlib import Path

from controllers.types import Notices
from engine.handover import accept, epoch_of, give, ready_to_give
from engine.machines import Lease, this_machine
from engine.offline import Waiting
from engine.record import Record
from engine.sync import PROTOCOL, Hello, Release, Shape, Step, Welcome, connect, pulled_cursor, replay, travels
from engine.version import version
from features.connection.transport import Transport
from migrations import applied
from resources.base import PROJECT, SYSTEM, Refused

@dataclass(frozen=True)
class Travelling:
    """What connecting would send to the server: how many files, how many bytes, from which environments; what never leaves this machine is not counted."""

    files: int
    bytes: int
    environments: tuple[str, ...]


@dataclass(frozen=True)
class ConnectionView:
    """What the viewer shows of the connection: the server's address, whether this copy is joined and how it stands, and what connecting would send."""

    address: str
    connected: bool
    release: str
    step: str
    travels: Travelling
    role: str
    synced_at: float


SERVER, HERE = "server", "here"
SERVER_ROLE, YOUR_COPY = "the server", "your copy"
STATE = "connection"


def local_hello(record) -> Hello:
    return Hello(version(), Shape(PROTOCOL, frozenset(applied(record.root)), epoch_of(record.root)), this_machine())


def join(record, transport: Transport) -> Welcome:
    """Asks the server who it is, checks that both can work together, and keeps the answer for the Settings card; a copy too old to carry the sync's checks is refused."""
    welcome = connect(local_hello(record), transport.hello())
    record.state(STATE).set("welcome", {"release": welcome.release.value, "step": welcome.comparison.step.value, "migrations": list(welcome.comparison.migrations)})
    if welcome.release is not Release.SAME or welcome.comparison.step is not Step.IN_STEP:
        Notices(record, actor=SYSTEM).create("This copy is not in step with the server", brief=f"Compared with the server this copy's release is {welcome.release.value}, and its record must {welcome.comparison.step.value} before it syncs.", tone="warn")
    return welcome


def fail_to_join(record, error: Exception) -> None:
    Notices(record, actor=SYSTEM).create("Could not connect to the server", brief=str(error), tone="warn")


def hand(record_root: Path, env: str, to: str, transport: Transport) -> Lease:
    """Moves one environment between this machine and the server through the lease: the server is asked first, and this machine lets go only once it has taken the new epoch."""
    record = Record(record_root, env)
    if to == HERE:
        return accept(record, "", transport.handback(env))
    if to != SERVER:
        raise Refused(f"hand an environment to {SERVER} or to {HERE}, not to {to!r}")
    ready_to_give(record, "")
    lease = Lease.read(record.scope_home("")).handed_to(transport.hello().machine)
    transport.handover(env, lease)
    return give(record, "", lease.machine)


def sync(record, transport: Transport) -> dict:
    """Sends what was written here while the server was away, oldest first, then takes in what happened on the server in the scopes it holds, without firing features."""
    sent = Waiting(record.root).flush(transport.send)
    pulled = 0
    for found in Record.every(record.root):
        if not found.holds(""):
            pulled += replay(found, "", transport.events("", found.env, found.event_log.cursor(pulled_cursor(""))))
    if not record.holds(PROJECT):
        pulled += replay(record, PROJECT, transport.events(PROJECT, record.env, record.event_log.cursor(pulled_cursor(PROJECT))))
    return {"sent": sent, "pulled": pulled}


def what_travels(root: Path) -> Travelling:
    found = [path for path in sorted(Path(root).rglob("*")) if path.is_file() and travels(path.relative_to(root).as_posix())]
    environments = sorted({path.relative_to(root).parts[1] for path in found if path.relative_to(root).parts[0] == "environments" and len(path.relative_to(root).parts) > 2})
    return Travelling(len(found), sum(path.stat().st_size for path in found), tuple(environments))


def role_of(connected: bool) -> str:
    """Which side this journal is: the server when it runs on one, otherwise a copy of it once it has joined."""
    if os.environ.get("JOURNAL_ADDRESS"):
        return SERVER_ROLE
    return YOUR_COPY if connected else ""


def view(record, address: str) -> ConnectionView:
    welcome = record.state(STATE).get("welcome") or {}
    connected = bool(address and welcome)
    return ConnectionView(address, connected, welcome.get("release", ""), welcome.get("step", ""), what_travels(record.root), role_of(connected),
                          float(record.state(STATE).get("synced_at", 0.0)))


def leave(record) -> None:
    """Disconnects: the server's address and what was learned of it are forgotten, and nothing already sent is taken back."""
    record.change_setting("connection", {"address": ""})
    record.state(STATE).remove("welcome")
