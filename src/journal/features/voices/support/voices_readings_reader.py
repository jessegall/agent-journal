from journal.features.voices.support.voices_readings import VoicesReadings
from journal.models.agent import Agent
from journal.features.voices.support.chosen_voice import ChosenVoice


class VoicesReadingsReader:
    """Reads the voices feature's part of the Readings for an agent."""

    def __init__(self, chosen: ChosenVoice) -> None:
        self.chosen = chosen

    def read(self, agent: Agent) -> VoicesReadings:
        return VoicesReadings(instruction=self.chosen.instruction())
