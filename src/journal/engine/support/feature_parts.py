from collections.abc import Iterator, Mapping

from journal.engine.support.data_reader import DataReader
from journal.models.agent import Agent
from journal.repositories.scope import Scope


class FeatureParts(Mapping[str, object]):
    """The feature data parts of one agent, each read by its feature's reader in the agent's environment the first time a listener asks for it."""

    def __init__(self, readers: dict[str, DataReader], agent: Agent, scope: Scope) -> None:
        self.readers, self.agent, self.scope = readers, agent, scope
        self.read_parts: dict[str, object] = {}

    def __getitem__(self, name: str) -> object:
        if name not in self.read_parts:
            with self.scope.environment(self.agent.environment_id):
                self.read_parts[name] = self.readers[name].read(self.agent)
        return self.read_parts[name]

    def __contains__(self, name: object) -> bool:
        return name in self.readers

    def __iter__(self) -> Iterator[str]:
        return iter(self.readers)

    def __len__(self) -> int:
        return len(self.readers)
