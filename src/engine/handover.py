import time
from pathlib import Path

from engine.machines import Lease, NotTheOwner
from engine.offline import Waiting
from engine.outbox import Outbox
from engine.paths import environments
from engine.record import RESOURCES
from resources.base import Refused


def ready_to_give(record, scope: str) -> None:
    """Refuses unless this machine holds the scope and has nothing made here still waiting for the server or for another scope's holder."""
    if not record.holds(scope):
        raise NotTheOwner.of(record.scope_name(scope), Lease.read(record.scope_home(scope)))
    nothing_waits(record, f"hand {record.scope_name(scope)} over")


def nothing_waits(record, then: str) -> None:
    """Refuses while writes made here still wait for the server or for another scope's holder."""
    waiting = [*Waiting(record.root).waiting(), *Outbox(record.root).waiting()]
    if waiting:
        raise Refused(f"{len(waiting)} writes made here still wait for the server: let them go first, then {then}")


def give(record, scope: str, to: str) -> Lease:
    """The machine that holds a scope hands it to another, which writes it from then on."""
    ready_to_give(record, scope)
    return record.hand_over(scope, to)


def accept(record, scope: str, lease: Lease) -> Lease:
    """The machine a scope was handed to takes the lease, once and only if its epoch is newer than the one it knows."""
    with record.locked(scope):
        known = Lease.read(record.scope_home(scope))
        if lease.epoch <= known.epoch:
            raise Refused(f"{record.scope_name(scope)} was already handed over at epoch {known.epoch}; this handover, epoch {lease.epoch}, is older")
        lease.write(record.scope_home(scope))
    return lease


RESTORED = "restored"


def epoch_of(root: Path) -> int:
    """The epoch a copy of the record is in: the project's, which a restore moves on for every copy."""
    return Lease.read(Path(root) / RESOURCES).epoch


def restored(root: Path) -> int:
    """Starts a new epoch after a backup was put back: the project and every environment keep their holder and get an epoch above any a copy saw before, so copies pull again instead of pushing rows from before the restore."""
    epoch = int(time.time())
    for home in (found for found in (Path(root) / RESOURCES, *environments(root).glob("*/")) if found.is_dir()):
        held = Lease.read(home)
        Lease(held.machine, max(held.epoch + 1, epoch)).write(home)
    return epoch


def after_restore(root: Path) -> bool:
    """On the server's start: a restore leaves a marker beside the record, and the new epoch begins once, then the marker goes."""
    marker = Path(root) / RESTORED
    if not marker.is_file():
        return False
    restored(root)
    marker.unlink()
    return True
