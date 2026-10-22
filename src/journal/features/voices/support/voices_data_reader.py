from journal.features.voices.support.voices_data import VoicesData
from journal.models.agent import Agent
from journal.features.voices.support.voice_choice import VoiceChoice


class VoicesDataReader:
    """Reads the voices feature's part of the feature data for an agent."""

    def __init__(self, selection: VoiceChoice) -> None:
        self.chosen = selection

    def read(self, agent: Agent) -> VoicesData:
        return VoicesData(instruction=self.chosen.instruction())
