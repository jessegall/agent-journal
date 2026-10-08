from pathlib import Path

from controllers.types import Notices
from engine.handover import accept, epoch_of, give, ready_to_give
from engine.machines import Lease, this_machine
from engine.offline import Waiting
from engine.record import Record
from engine.sync import PROTOCOL, Hello, Shape, Welcome, connect, pulled_cursor, replay
from engine.version import version
from features.connection.transport import Transport
from migrations import applied
from resources.base import PROJECT, SYSTEM, Refused

SERVER, HERE = "server", "here"
STATE = "connection"


def local_hello(record) -> Hello:
    return Hello(version(), Shape(PROTOCOL, frozenset(applied(record.root)), epoch_of(record.root)), this_machine())


def join(record, transport: Transport) -> Welcome:
    """Asks the server who it is, checks that both can work together, and keeps the answer for the Settings card; a copy too old to carry the sync's checks is refused."""
    welcome = connect(local_hello(record), transport.hello())
    record.state(STATE).set("welcome", {"release": welcome.release.value, "step": welcome.comparison.step.value, "migrations": list(welcome.comparison.migrations)})
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
