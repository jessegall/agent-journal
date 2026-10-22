import gc
import os
import time
from journal.engine.clock import Clock
from journal.engine.job_runner import JobRunner
from journal.engine.menu_watcher import MenuWatcher
from journal.features.plugins.support.service_start import ServiceStart
from journal.engine.state_machine import StateMachine
from journal.console.creations import Creations
from journal.features.listeners.record_changes import RecordChanges
from journal.features.listeners.unlink_deleted import UnlinkDeleted
from journal.events.models.model_event import ModelEvent
from journal.events.agent.agent_event import AgentEvent
from journal.events.rows.row_event import RowEvent
from journal.engine.row_event_delivery import RowEventDelivery
from journal.engine.nudge_registry import NudgeRegistry
from journal.events.models.created import Created
from journal.events.models.deleted import Deleted
from journal.events.bus import Bus
from journal.features.registry import Registry
from journal.features.switches import Switches
from journal.support.listener_queue import ListenerQueue
from journal.config import Config
from journal.container import Container
from journal.repositories.scope import Scope
from journal.http.server import Server
from journal.support.instance_guard import InstanceGuard
from journal.http.share_server import ShareServer
from journal.sync.record_outgoing_change import RecordOutgoingChange


INSTANCE_CHECK_SECONDS = 2.0


class Runtime:
    """What the server process keeps alive: the HTTP server and the share server beside it, the deferred worker and the job runner with the clock, the menu watcher and every feature's jobs, with the machine on the bus. State itself is in the database, so a restart loses nothing."""

    def __init__(self, container: Container, server: Server, deferred: ListenerQueue, clock: Clock, machine: StateMachine, bus: Bus, registry: Registry, scope: Scope, watcher: MenuWatcher, share_server: ShareServer, reserve: InstanceGuard, jobs: JobRunner) -> None:
        self.container, self.server, self.deferred, self.clock, self.machine, self.bus, self.registry, self.scope = container, server, deferred, clock, machine, bus, registry, scope
        self.watcher, self.share_server, self.standby, self.jobs = watcher, share_server, reserve, jobs

    def register_nudges(self) -> None:
        nudges = self.container.get(NudgeRegistry)
        for feature in self.registry.features:
            for nudge in feature.nudges:
                nudges.register(nudge)

    def boot(self) -> None:
        self.register_nudges()
        self.bus.listen(AgentEvent, self.machine)
        self.bus.listen(RowEvent, self.container.get(RowEventDelivery))
        self.bus.listen(Created, Creations())
        self.bus.listen(ModelEvent, self.container.get(RecordChanges))
        self.bus.listen(ModelEvent, self.container.get(RecordOutgoingChange))
        self.bus.listen(Deleted, self.container.get(UnlinkDeleted))
        for feature in self.registry.features:
            for listener in feature.listeners:
                self.bus.listen(listener.kind(), Switches(feature, self.container.get(listener), self.registry, self.scope))
            for seed in feature.seeds:
                self.container.get(seed).run()
        self.machine.compactions_ended()
        from journal.repositories.environments import Environments
        if not self.container.get(Environments).all():
            self.container.get(Environments).lookup("main")

    def start(self) -> None:
        from journal.features.faults.support.slow_requests import STARTING
        starting = self.container.get(Config).home / "runtime" / STARTING
        starting.parent.mkdir(parents=True, exist_ok=True)
        starting.touch()
        try:
            self.startup()
        finally:
            starting.unlink(missing_ok=True)

    def startup(self) -> None:
        self.share_server.start()
        self.boot()
        from journal.features.skills.support.skill_files import SkillFiles
        from journal.features.profiles.support.profile_files import ProfileFiles
        self.container.get(SkillFiles).write_all()
        self.container.get(ProfileFiles).write_all()
        self.deferred.start()
        self.register_jobs()
        self.jobs.start()
        self.server.start()
        self.container.get(ServiceStart).run()
        gc.freeze()

    def register_jobs(self) -> None:
        self.jobs.register(self.clock)
        self.jobs.register(self.watcher)
        for feature in self.registry.features:
            for job in feature.jobs:
                self.jobs.register(self.container.get(job))

    def run(self) -> None:
        parent = os.getppid()
        counterpart = self.standby.other_address()
        if counterpart:
            print(f"a journal of this project answers at {counterpart}: waiting until it is gone", flush=True)
        while counterpart and os.getppid() == parent:
            time.sleep(INSTANCE_CHECK_SECONDS)
            counterpart = self.standby.other_address()
        if os.getppid() != parent:
            return
        self.start()
        while self.server._thread.is_alive() and os.getppid() == parent:
            self.server._thread.join(1.0)
        self.stop()

    def stop(self) -> None:
        self.server.stop()
        self.share_server.stop()
        self.jobs.stop()
        self.deferred.stop()
        gc.unfreeze()
