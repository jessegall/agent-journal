from core.modules.plugins.commands.support.service_faults import ServiceFaults
from core.modules.plugins.support.plugin_services import PluginServices
from core.modules.plugins.support.service_processes import ServiceProcesses


class PluginServiceRound:
    """One round of keeping the plugin services running, its faults recorded as the plugins' own."""

    def __init__(self, services: PluginServices, faults: ServiceFaults) -> None:
        self.services, self.faults = services, faults

    def run(self, processes: ServiceProcesses) -> None:
        self.faults.record(self.services.follow(processes))
