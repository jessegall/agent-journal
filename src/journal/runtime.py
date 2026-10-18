import os
from journal.engine.clock import Clock
from journal.engine.menu_watcher import MenuWatcher
from journal.service_start import ServiceStart
from journal.engine.machine import Machine
from journal.console.creations import Creations
from journal.features.listeners.record_changes import RecordChanges
from journal.features.listeners.unlink_deleted import UnlinkDeleted
from journal.events.models.model_event import ModelEvent
from journal.events.agent.agent_event import AgentEvent
from journal.events.models.created import Created
from journal.events.models.deleted import Deleted
from journal.events.bus import Bus
from journal.features.registry import Registry
from journal.features.switched import Switched
from journal.engine.deferred import Deferred
from journal.container import Container
from journal.repositories.scope import Scope
from journal.http.server import Server


class Runtime:
    """What the server process keeps alive: the HTTP server, the deferred worker, the clock and the menu watcher, with the machine on the bus. State itself is in the database, so a restart loses nothing."""

    def __init__(self, container: Container, server: Server, deferred: Deferred, clock: Clock, machine: Machine, bus: Bus, registry: Registry, scope: Scope, watcher: MenuWatcher) -> None:
        self.container, self.server, self.deferred, self.clock, self.machine, self.bus, self.registry, self.scope = container, server, deferred, clock, machine, bus, registry, scope
        self.watcher = watcher

    def boot(self) -> None:
        """Resolves everything once: the machine and every feature's listeners go on the bus, so the first request pays nothing."""
        self.bus.listen(AgentEvent, self.machine)
        self.bus.listen(Created, Creations())
        self.bus.listen(ModelEvent, self.container.get(RecordChanges))
        self.bus.listen(Deleted, self.container.get(UnlinkDeleted))
        for feature in self.registry.features:
            for listener in feature.listeners:
                self.bus.listen(listener.kind(), Switched(feature, self.container.get(listener), self.registry, self.scope))
            for seed in feature.seeds:
                self.container.get(seed).run()
        from journal.repositories.environments import Environments
        if not self.container.get(Environments).all():
            self.container.get(Environments).named("main")

    def start(self) -> None:
        self.boot()
        from journal.features.skills.skill_files import SkillFiles
        self.container.get(SkillFiles).write_all()
        self.deferred.start()
        self.clock.start()
        self.watcher.start()
        self.server.start()
        self.container.get(ServiceStart).run()

    def run(self) -> None:
        """Blocks until stop(), or until the process that started it is gone, so a journal never outlives its supervisor."""
        self.start()
        parent = os.getppid()
        while self.server._thread.is_alive() and os.getppid() == parent:
            self.server._thread.join(1.0)
        self.stop()

    def stop(self) -> None:
        self.server.stop()
        self.clock.stop()
        self.watcher.stop()
        self.deferred.stop()
