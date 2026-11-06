from core.base.plugin_script_processes import PluginScriptProcesses
from core.modules.plugins.commands.support.service_faults import ServiceFaults
from core.modules.plugins.support.plugin_services import PluginServices
from core.modules.plugins.support.runnable_plugins import RunnablePlugins
from core.modules.plugins.support.service_processes import ServiceProcesses


class PluginServiceRound:
    """One round of keeping the plugin services running, its faults recorded as the plugins' own, and of stopping the
    running scripts of each plugin that is no longer on."""

    def __init__(self, services: PluginServices, faults: ServiceFaults, scripts: PluginScriptProcesses, runnable: RunnablePlugins) -> None:
        self.services, self.faults, self.scripts, self.runnable = services, faults, scripts, runnable

    def run(self, processes: ServiceProcesses) -> None:
        self.faults.record(self.services.follow(processes))
        for name in self.scripts.plugin_names() - {plugin.name for plugin in self.runnable.enabled_rows()}:
            self.scripts.stop(name)
