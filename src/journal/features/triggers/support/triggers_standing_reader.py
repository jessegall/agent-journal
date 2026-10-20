from journal.features.triggers.support.triggers_standing import TriggersStanding
from journal.models.agent import Agent
from journal.repositories.triggers import Triggers


class TriggersStandingReader:
    """Reads the triggers feature's part of the Standing for an agent."""

    def __init__(self, triggers: Triggers) -> None:
        self.triggers = triggers

    def read(self, agent: Agent) -> TriggersStanding:
        return TriggersStanding(triggers=tuple(self.triggers.all()))
