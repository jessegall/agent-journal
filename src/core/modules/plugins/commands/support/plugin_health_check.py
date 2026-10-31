from core.modules.plugins.commands.support.service_faults import ServiceFaults
from core.modules.plugins.support.plugin_services import PluginServices
from core.modules.plugins.support.service_processes import ServiceProcesses


class PluginHealthCheck:
    """Checks the health of the plugin services running and records it: a miss as the plugin's fault, and a
    healthy plugin after faults as the end of them."""

    def __init__(self, services: PluginServices, faults: ServiceFaults) -> None:
        self.services, self.faults = services, faults

    def run(self, processes: ServiceProcesses) -> None:
        misses = self.services.check_health(processes)
        self.faults.record(misses)
        self.faults.clear(misses)
