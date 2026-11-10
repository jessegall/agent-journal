from engine.process.plugin_script_processes import PluginScriptProcesses
from core.modules.plugins.commands.support.service_faults import ServiceFaults
from core.modules.plugins.support.plugin_places import PluginPlaces
from core.modules.plugins.support.plugin_services import PluginServices
from core.modules.plugins.support.runnable_plugins import RunnablePlugins
from core.modules.plugins.support.service_processes import ServiceProcesses


class PluginServiceRound:
    """One round of keeping the plugin services running, its faults recorded as the plugins' own, and of stopping the
    running scripts of each plugin that is no longer on."""

    def __init__(self, services: PluginServices, faults: ServiceFaults, scripts: PluginScriptProcesses, runnable: RunnablePlugins, places: PluginPlaces) -> None:
        self.services, self.faults, self.scripts, self.runnable, self.places = services, faults, scripts, runnable, places

    def run(self, processes: ServiceProcesses) -> None:
        with processes.lock:
            self.faults.record(self.services.follow(processes))
        wanted = {plugin.name for plugin in self.runnable.enabled_rows()}
        for name in self.scripts.plugin_names() - wanted:
            self.scripts.stop(name)
        self.places.stop_unwanted(wanted)
