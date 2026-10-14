from journal.engine.clock import Clock
from journal.engine.machine import Machine
from journal.events.agent.agent_event import AgentEvent
from journal.features.bus import Bus
from journal.features.registry import Registry
from journal.hooks.deferred import Deferred
from journal.container import Container
from journal.http.server import Server


class Runtime:
    """What the server process keeps alive: the HTTP server, the deferred worker and the clock, with the machine on the bus. State itself is in the database, so a restart loses nothing."""

    def __init__(self, container: Container, server: Server, deferred: Deferred, clock: Clock, machine: Machine, bus: Bus, registry: Registry) -> None:
        self.container, self.server, self.deferred, self.clock, self.machine, self.bus, self.registry = container, server, deferred, clock, machine, bus, registry

    def boot(self) -> None:
        """Resolves everything once: the machine and every feature's listeners go on the bus, so the first request pays nothing."""
        self.bus.listen(AgentEvent, self.machine)
        for feature in self.registry.features:
            for listener in feature.listeners:
                self.bus.listen(listener.kind(), self.container.get(listener))

    def start(self) -> None:
        self.boot()
        self.deferred.start()
        self.clock.start()
        self.server.start()

    def run(self) -> None:
        """Blocks until stop()."""
        self.start()
        self.server._thread.join()

    def stop(self) -> None:
        self.server.stop()
        self.clock.stop()
        self.deferred.stop()
