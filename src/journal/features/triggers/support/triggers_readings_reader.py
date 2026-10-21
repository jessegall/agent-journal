from journal.features.triggers.support.triggers_readings import TriggersReadings
from journal.models.agent import Agent
from journal.repositories.triggers import Triggers


class TriggersReadingsReader:
    """Reads the triggers feature's part of the Readings for an agent."""

    def __init__(self, triggers: Triggers) -> None:
        self.triggers = triggers

    def read(self, agent: Agent) -> TriggersReadings:
        return TriggersReadings(triggers=tuple(self.triggers.all()))
