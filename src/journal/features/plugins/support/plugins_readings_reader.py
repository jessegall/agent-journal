from journal.config import Config
from journal.features.plugins.support.plugins_readings import PluginsReadings
from journal.models.agent import Agent


class PluginsReadingsReader:
    """Reads the plugins feature's part of the Readings for an agent."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def read(self, agent: Agent) -> PluginsReadings:
        return PluginsReadings(root=self.config.root, plugins_folder=(self.config.home / "plugins").resolve())
