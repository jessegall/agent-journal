from journal.features.plugins.plugin_services import PluginServices
from journal.features.seed import Seed
from journal.repositories.plugins import Plugins


class PluginServicesAtBoot(Seed):
    """At boot, the services of every plugin that is on are started where a supervisor runs; one already running is left as it is."""

    def __init__(self, plugins: Plugins, services: PluginServices) -> None:
        self.plugins, self.services = plugins, services

    def run(self) -> None:
        for plugin in self.plugins.enabled():
            self.services.start(plugin)
