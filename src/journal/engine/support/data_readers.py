from journal.events.feature_data import FeatureData
from journal.models.agent import Agent
from journal.engine.support.data_reader import DataReader
from journal.engine.support.feature_parts import FeatureParts
from journal.repositories.scope import Scope


class DataReaders:
    """Every feature's data reader by the feature's name; builds the feature data an event carries for the agent asked, each part read when a listener first asks for it."""

    def __init__(self, readers: dict[str, DataReader], scope: Scope) -> None:
        self.readers, self.scope = readers, scope

    def agent_data(self, agent: Agent) -> FeatureData:
        return FeatureData(FeatureParts(self.readers, agent, self.scope))
