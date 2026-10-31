from core.base.command.bus import Bus
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.environments.models.environment import Environment
from core.modules.plugins.commands.clear_plugin_faults import ClearPluginFaults
from core.modules.plugins.commands.record_plugin_fault import RecordPluginFault
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.service_fault import ServiceFault

MODULE_NAME = "journal.core.plugins"


class ServiceFaults:
    """Records the faults of plugin services as the plugins module, and the end of a plugin's faults once its
    services are healthy, in the first environment's chat, since a plugin serves the whole project."""

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def record(self, faults: list[ServiceFault]) -> None:
        for fault in faults:
            self.bus.run(RecordPluginFault(fault.plugin.id, fault.fault), self.actors.actor(MODULE_NAME), environment_id=self.environment_id())

    def clear(self, faults: list[ServiceFault]) -> None:
        faulted = {fault.plugin.id for fault in faults}
        for plugin in [plugin for plugin in self.queries.query(Plugin).filter(enabled=True).all_rows() if plugin.fault_count and plugin.id not in faulted]:
            self.bus.run(ClearPluginFaults(plugin.id), self.actors.actor(MODULE_NAME), environment_id=self.environment_id())

    def environment_id(self) -> int:
        return self.queries.query(Environment).oldest().page(1, 1).rows[0].id
