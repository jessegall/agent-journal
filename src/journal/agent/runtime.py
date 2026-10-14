from journal.agent.clock import Clock
from journal.agent.machine import Machine
from journal.features.bus import Bus
from journal.hooks.deferred import Deferred
from journal.http.server import Server


class Runtime:
    """What the server process keeps alive: the HTTP server, the deferred worker and the clock, with the machine on the bus. State itself is in the database, so a restart loses nothing."""

    def __init__(self, server: Server, deferred: Deferred, clock: Clock, machine: Machine, bus: Bus) -> None: ...

    def run(self) -> None:
        """Registers the machine, starts the threads, serves until stopped, then stops them in reverse."""
        ...

    def stop(self) -> None: ...
