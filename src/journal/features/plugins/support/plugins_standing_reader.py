from journal.config import Config
from journal.features.plugins.support.plugins_standing import PluginsStanding
from journal.models.agent import Agent


class PluginsStandingReader:
    """Reads the plugins feature's part of the Standing for an agent."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def read(self, agent: Agent) -> PluginsStanding:
        return PluginsStanding(root=self.config.root, plugins_folder=(self.config.home / "plugins").resolve())
