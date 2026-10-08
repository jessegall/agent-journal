import os
import time
from dataclasses import dataclass
from pathlib import Path

from controllers.requests import request
from controllers.types import Notices
from engine.handover import accept, epoch_of, give, nothing_waits
from engine.machines import Lease, this_machine
from engine.offline import Waiting, Write
from engine.outbox import Request
from engine.record import Record
from engine.sync import CONNECTION, PROTOCOL, Hello, Release, Shape, Step, Welcome, connect, replay, travelling_files
from engine.version import version
from features.connection.transport import EventQuery, ServerKey, Transport
from engine.ledger import applied
from resources.base import PROJECT, SYSTEM, Refused

@dataclass(frozen=True)
class Travelling:
    """What connecting would send to the server: how many files, how many bytes, from which environments; what never leaves this machine is not counted."""

    files: int
    bytes: int
    environments: tuple[str, ...]


@dataclass(frozen=True)
class ConnectionView:
    """What the viewer shows of the connection: the server's address, whether this copy is joined and how it stands, what connecting would send, and whether a machine key is kept here, never the key."""

    address: str
    connected: bool
    release: str
    step: str
    travels: Travelling
    role: str
    synced_at: float
    has_key: bool


SERVER, HERE = "server", "here"
SERVER_ROLE, YOUR_COPY = "the server", "your copy"
STATE = CONNECTION


def local_hello(record) -> Hello:
    return Hello(version(), Shape(PROTOCOL, frozenset(applied(record.root)), epoch_of(record.root)), this_machine())


def join(record, transport: Transport) -> Welcome:
    """Asks the server who it is, checks that both can work together, and keeps the answer for the Settings card; a copy too old to carry the sync's checks is refused."""
    welcome = connect(local_hello(record), transport.hello())
    record.state(STATE).set("welcome", {"release": welcome.release.value, "step": welcome.comparison.step.value, "migrations": list(welcome.comparison.migrations)})
    if welcome.release is not Release.SAME or welcome.comparison.step is not Step.IN_STEP:
        warn(record, "This copy is not in step with the server", f"Compared with the server this copy's release is {welcome.release.value}, and its record must {welcome.comparison.step.value} before it syncs.")
    return welcome


def fail_to_join(record, error: Exception) -> None:
    warn(record, "Could not connect to the server", str(error))


def hand(record_root: Path, env: str, to: str, transport: Transport) -> Lease:
    """Moves one environment between this machine and the server through the lease: the server is asked first, and this machine lets go only once it has taken the new epoch."""
    record = Record(record_root, env)
    if to == HERE:
        nothing_waits(record, f"take {env} back")
        return take_back(record, transport)
    if to != SERVER:
        raise Refused(f"hand an environment to {SERVER} or to {HERE}, not to {to!r}")
    return hand_to_server(record, transport)


def hand_to_server(record, transport: Transport) -> Lease:
    """This machine lets go first, under the next epoch, then tells the server; a lost answer is settled by asking the server who holds that epoch, and running hand again sends the same lease."""
    if record.holds(""):
        lease = give(record, "", transport.hello().machine)
    else:
        lease = Lease.read(record.scope_home(""))
    try:
        transport.handover(record.env, lease)
    except OSError as lost:
        settle(record, transport, lease, lost)
    return lease


def take_back(record, transport: Transport) -> Lease:
    """The server lets go first and names this machine under the next epoch; a lost answer is settled by asking the server who holds the environment now."""
    try:
        lease = transport.handback(record.env)
    except OSError as lost:
        lease = held_by(record, transport, lost)
    if lease.machine != this_machine():
        raise Refused(f"the server handed {record.env} to {lease.machine}, not to this machine")
    if Lease.read(record.scope_home("")) == lease:
        return lease
    return accept(record, "", lease)


def settle(record, transport: Transport, lease: Lease, lost: OSError) -> None:
    if held_by(record, transport, lost) != lease:
        raise Refused(f"this machine let go of {record.env} at epoch {lease.epoch} and the server has not taken it yet: run hand again to finish") from lost


def held_by(record, transport: Transport, lost: OSError) -> Lease:
    try:
        return transport.holder(record.env)
    except OSError as unknown:
        raise Refused(f"the server's answer about {record.env} was lost and it cannot be asked who holds it now: run hand again once it answers") from unknown


def heard(transport: Transport) -> Hello:
    try:
        return transport.hello()
    except OSError as error:
        raise Refused(f"the server does not answer: {error}") from error


@dataclass(frozen=True)
class Synced:
    sent: int
    pulled: int


def sync(record, transport: Transport) -> Synced:
    """Sends what was written here while the server was away, oldest first, then takes in what happened on the server in the scopes it holds, without firing features."""
    epoch = heard(transport).shape.epoch
    flushed = Waiting(record.root).flush(transport.send)
    if flushed.refused:
        notice_refused(record, flushed.refused)
        Waiting(record.root).flush(transport.send)
    if heard(transport).shape.epoch != epoch:
        raise Refused("the server has a new epoch since this sync began, so nothing is taken in; connect again to pull everything")
    pulled = 0
    for found in Record.every(record.root):
        if not found.holds(""):
            pulled += replay(found, "", transport.events(EventQuery.of(found, "")))
    if not record.holds(PROJECT):
        pulled += replay(record, PROJECT, transport.events(EventQuery.of(record, PROJECT)))
    record.state(STATE).set("synced_at", time.time())
    return Synced(flushed.sent, pulled)


def notice_refused(record, refused: tuple[Write, ...]) -> None:
    turned_down = "\n".join(f"- {held.asked.line()}" for held in refused)
    warn(record, "The server turned down changes made here", f"The server refused these changes, so they were set aside and the changes after them went on:\n{turned_down}")


def warn(record, title: str, brief: str) -> None:
    """A notice about the connection, written where the environment is written: here while this machine holds it, otherwise queued for the server with the other writes."""
    request(record.root, Request(record.env, Notices.resource.type, "create", [title], {"brief": brief, "tone": "warn"}, actor=SYSTEM))


def what_travels(root: Path) -> Travelling:
    found = travelling_files(root)
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
                          float(record.state(STATE).get("synced_at", 0.0)), ServerKey(record.root).is_kept())


def leave(record) -> None:
    """Disconnects: the server's address and what was learned of it are forgotten, and nothing already sent is taken back."""
    record.change_setting("connection", {"address": ""})
    record.state(STATE).remove("welcome")
    record.state(STATE).remove("synced_at")
