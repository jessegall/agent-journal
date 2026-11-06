from core.base.running_scripts import RunningScripts
from core.modules.plugins.commands.support.service_faults import ServiceFaults
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_services import PluginServices
from core.modules.plugins.support.service_processes import ServiceProcesses


class PluginServiceRound:
    """One round of keeping the plugin services running, its faults recorded as the plugins' own, and of stopping the
    running scripts of each plugin that is no longer on."""

    def __init__(self, services: PluginServices, faults: ServiceFaults, scripts: RunningScripts, plugins: PluginQuery) -> None:
        self.services, self.faults, self.scripts, self.plugins = services, faults, scripts, plugins

    def run(self, processes: ServiceProcesses) -> None:
        self.faults.record(self.services.follow(processes))
        for name in self.scripts.plugin_names() - {plugin.name for plugin in self.plugins.enabled_plugins()}:
            self.scripts.stop(name)
