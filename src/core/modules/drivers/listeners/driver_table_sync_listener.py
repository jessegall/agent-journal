from engine.agent_machine.compiling.driver_compiler import DriverCompiler
from engine.module.machine_check import MachineCheck
from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.event.registry_synced import RegistrySynced
from engine.listener.commit.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.module.module_finder import ModuleFinder
from engine.module.module_order import ModuleOrder
from engine.scope.actor_scope import ActorScope
from engine.scope.environment_scope import EnvironmentScope
from core.modules.drivers.commands.record_driver_tables.record_driver_tables import RecordDriverTables

DRIVERS_MODULE_NAME = "journal.core.drivers"


class DriverTableSyncListener(CommitListener[RegistrySynced]):
    """As the modules sync, compiles one table per driver of the agent machine from the installed modules and
    records each new digest, so what changed between two digests can be read; nothing answers from it yet."""

    name = "drivers.driver-table-sync"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, finder: ModuleFinder, order: ModuleOrder, check: MachineCheck, bus: Bus, actors: ModuleActors) -> None:
        self.finder, self.order, self.check, self.bus, self.actors = finder, order, check, bus, actors

    def handle(self, event: RegistrySynced, logged: LoggedEvent) -> None:
        modules = self.order.ordered(self.finder.modules())
        tables = DriverCompiler(self.check.contributions(modules)).tables(self.check.drivers(modules))
        self.bus.run(RecordDriverTables(tables), self.actors.actor(DRIVERS_MODULE_NAME), cause_id=logged.id)
