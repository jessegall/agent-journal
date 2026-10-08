from engine.machines import Lease, NotTheOwner
from engine.offline import Waiting
from resources.base import Refused


def give(record, scope: str, to: str) -> Lease:
    """The machine that holds a scope hands it to another, which writes it from then on: refused unless this machine holds it and has nothing still waiting for the server."""
    if not record.holds(scope):
        raise NotTheOwner.of(record.scope_name(scope), Lease.read(record.scope_home(scope)))
    waiting = Waiting(record.root).waiting()
    if waiting:
        raise Refused(f"{len(waiting)} writes made here still wait for the server: let them go first, then hand {record.scope_name(scope)} over")
    return record.hand_over(scope, to)


def accept(record, scope: str, lease: Lease) -> Lease:
    """The machine a scope was handed to takes the lease, once and only if its epoch is newer than the one it knows."""
    with record.locked(scope):
        known = Lease.read(record.scope_home(scope))
        if lease.epoch <= known.epoch:
            raise Refused(f"{record.scope_name(scope)} was already handed over at epoch {known.epoch}; this handover, epoch {lease.epoch}, is older")
        lease.write(record.scope_home(scope))
    return lease
