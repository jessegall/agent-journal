from journal.events.feature_data import FeatureData
from journal.models.agent import Agent
from journal.support.data_reader import DataReader


class DataReaders:
    """Every feature's data reader by the feature's name; builds the feature data an event carries for the agent asked."""

    def __init__(self, readers: dict[str, DataReader]) -> None:
        self.readers = readers

    def for_agent(self, agent: Agent) -> FeatureData:
        return FeatureData({name: reader.read(agent) for name, reader in self.readers.items()})
