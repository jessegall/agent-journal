from journal.features.voices.support.voices_standing import VoicesStanding
from journal.models.agent import Agent
from journal.features.voices.support.chosen_voice import ChosenVoice


class VoicesStandingReader:
    """Reads the voices feature's part of the Standing for an agent."""

    def __init__(self, chosen: ChosenVoice) -> None:
        self.chosen = chosen

    def read(self, agent: Agent) -> VoicesStanding:
        return VoicesStanding(instruction=self.chosen.instruction())
