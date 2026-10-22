from journal.features.triggers.support.triggers_data import TriggersData
from journal.models.agent import Agent
from journal.repositories.triggers import Triggers


class TriggersDataReader:
    """Reads the triggers feature's part of the feature data for an agent."""

    def __init__(self, triggers: Triggers) -> None:
        self.triggers = triggers

    def read(self, agent: Agent) -> TriggersData:
        return TriggersData(triggers=tuple(self.triggers.all()))
