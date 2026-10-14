from journal.engine.clock import Clock
from journal.engine.machine import Machine
from journal.console.creations import Creations
from journal.features.listeners.record_changes import RecordChanges
from journal.events.models.model_event import ModelEvent
from journal.events.agent.agent_event import AgentEvent
from journal.events.models.created import Created
from journal.features.bus import Bus
from journal.features.registry import Registry
from journal.features.switched import Switched
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
        self.bus.listen(Created, Creations())
        self.bus.listen(ModelEvent, self.container.get(RecordChanges))
        for feature in self.registry.features:
            for listener in feature.listeners:
                self.bus.listen(listener.kind(), Switched(feature, self.container.get(listener), self.registry))

    def start(self) -> None:
        self.boot()
        from journal.features.skills.skill_files import SkillFiles
        self.container.get(SkillFiles).write_all()
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
