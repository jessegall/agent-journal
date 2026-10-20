import os
import time
from journal.engine.clock import Clock
from journal.engine.menu_watcher import MenuWatcher
from journal.support.service_start import ServiceStart
from journal.engine.machine import Machine
from journal.console.creations import Creations
from journal.features.listeners.record_changes import RecordChanges
from journal.features.listeners.unlink_deleted import UnlinkDeleted
from journal.events.models.model_event import ModelEvent
from journal.events.agent.agent_event import AgentEvent
from journal.events.rows.row_event import RowEvent
from journal.engine.row_events_to_the_top import RowEventsToTheTop
from journal.events.models.created import Created
from journal.events.models.deleted import Deleted
from journal.events.bus import Bus
from journal.features.registry import Registry
from journal.features.switched import Switched
from journal.support.deferred import Deferred
from journal.config import Config
from journal.container import Container
from journal.support.scope import Scope
from journal.http.server import Server
from journal.support.standby import Standby
from journal.http.share_server import ShareServer


STANDBY_EVERY = 2.0
"""Seconds between two looks at whether the other journal of the project still answers."""


class Runtime:
    """What the server process keeps alive: the HTTP server and the share server beside it, the deferred worker, the clock and the menu watcher, with the machine on the bus. State itself is in the database, so a restart loses nothing."""

    def __init__(self, container: Container, server: Server, deferred: Deferred, clock: Clock, machine: Machine, bus: Bus, registry: Registry, scope: Scope, watcher: MenuWatcher, share_server: ShareServer, standby: Standby) -> None:
        self.container, self.server, self.deferred, self.clock, self.machine, self.bus, self.registry, self.scope = container, server, deferred, clock, machine, bus, registry, scope
        self.watcher, self.share_server, self.standby = watcher, share_server, standby

    def boot(self) -> None:
        self.bus.listen(AgentEvent, self.machine)
        self.bus.listen(RowEvent, self.container.get(RowEventsToTheTop))
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
        from journal.support.slow_requests import STARTING
        starting = self.container.get(Config).home / "runtime" / STARTING
        starting.parent.mkdir(parents=True, exist_ok=True)
        starting.touch()
        try:
            self.started_up()
        finally:
            starting.unlink(missing_ok=True)

    def started_up(self) -> None:
        self.share_server.start()
        self.boot()
        from journal.support.skill_files import SkillFiles
        from journal.support.profile_files import ProfileFiles
        self.container.get(SkillFiles).write_all()
        self.container.get(ProfileFiles).write_all()
        self.deferred.start()
        self.clock.start()
        self.watcher.start()
        self.server.start()
        self.container.get(ServiceStart).run()

    def run(self) -> None:
        parent = os.getppid()
        other = self.standby.another()
        if other:
            print(f"a journal of this project answers at {other}: standing by until it is gone", flush=True)
        while other and os.getppid() == parent:
            time.sleep(STANDBY_EVERY)
            other = self.standby.another()
        if os.getppid() != parent:
            return
        self.start()
        while self.server._thread.is_alive() and os.getppid() == parent:
            self.server._thread.join(1.0)
        self.stop()

    def stop(self) -> None:
        self.server.stop()
        self.share_server.stop()
        self.clock.stop()
        self.watcher.stop()
        self.deferred.stop()
