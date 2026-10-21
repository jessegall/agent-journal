from journal.config import Config
from journal.features.plugins.support.plugins_data import PluginsData
from journal.models.agent import Agent


class PluginsDataReader:
    """Reads the plugins feature's part of the feature data for an agent."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def read(self, agent: Agent) -> PluginsData:
        return PluginsData(root=self.config.root, plugins_folder=(self.config.home / "plugins").resolve())
