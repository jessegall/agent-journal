from core.base.command.bus import Bus
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.environments.models.environment import Environment
from core.modules.plugins.commands.clear_plugin_faults import ClearPluginFaults
from core.modules.plugins.commands.record_plugin_fault import RecordPluginFault
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.plugin_services import PluginServices
from core.modules.plugins.support.service_processes import ServiceProcesses

MODULE_NAME = "journal.core.plugins"


class PluginHealthCheck:
    """Checks the health of the plugin services running and records it as the plugins module: a miss as
    the plugin's fault, and a healthy plugin after faults as the end of them, shown in the first environment's
    chat, since a plugin serves the whole project."""

    def __init__(self, services: PluginServices, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.services, self.bus, self.actors, self.queries = services, bus, actors, queries

    def run(self, processes: ServiceProcesses) -> None:
        misses = self.services.check_health(processes)
        missed = {miss.plugin.id for miss in misses}
        environment_id = self.queries.query(Environment).oldest().page(1, 1).rows[0].id
        for miss in misses:
            self.bus.run(RecordPluginFault(miss.plugin.id, miss.fault), self.actors.actor(MODULE_NAME), environment_id=environment_id)
        for plugin in [plugin for plugin in self.queries.query(Plugin).filter(enabled=True).all_rows() if plugin.fault_count and plugin.id not in missed]:
            self.bus.run(ClearPluginFaults(plugin.id), self.actors.actor(MODULE_NAME), environment_id=environment_id)
