from pathlib import Path

from journal.config import Config
from journal.features.secrets.support.secrets_readings import SecretsReadings
from journal.models.agent import Agent
from journal.support.private_folder import PrivateFolder
from journal.support.secret_values import SecretValues


class SecretsReadingsReader:
    """Reads the secrets feature's part of the Readings for an agent."""

    def __init__(self, config: Config, values: SecretValues) -> None:
        self.config, self.values = config, values

    def read(self, agent: Agent) -> SecretsReadings:
        named = [self.values.path.parent, PrivateFolder(self.config.root).keys_file().parent]
        folders = [folder.resolve() for folder in named]
        home = str(Path.home())
        spellings = [s for folder in {*named, *folders} for s in (str(folder), str(folder).replace(home, "~", 1), str(folder).replace(home, "$HOME", 1))]
        return SecretsReadings(root=self.config.root, folders=tuple(folders), spellings=tuple(spellings))
