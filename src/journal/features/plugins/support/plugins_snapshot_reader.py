from journal.config import Config
from journal.features.plugins.support.plugins_snapshot import PluginsSnapshot
from journal.models.agent import Agent


class PluginsSnapshotReader:
    """Reads the plugins feature's part of the Snapshot for an agent."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def read(self, agent: Agent) -> PluginsSnapshot:
        return PluginsSnapshot(root=self.config.root, plugins_folder=(self.config.home / "plugins").resolve())
