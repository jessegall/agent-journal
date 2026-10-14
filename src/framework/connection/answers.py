from engine.machines import Lease
from engine.sync import PROTOCOL, Hello, Shape
from engine.version import version


def lease(machine: str, epoch: int) -> Lease:
    """The lease a server names for an environment: who writes it, from which epoch."""
    return Lease(machine, epoch)


def hello(epoch: int = 0) -> Hello:
    """What a server of this release says of itself, in the epoch the record is in."""
    return Hello(version(), Shape(PROTOCOL, frozenset(), epoch), "server-1")
