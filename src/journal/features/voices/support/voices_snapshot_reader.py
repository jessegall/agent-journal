from journal.features.voices.support.voices_snapshot import VoicesSnapshot
from journal.models.agent import Agent
from journal.features.voices.support.chosen_voice import ChosenVoice


class VoicesSnapshotReader:
    """Reads the voices feature's part of the Snapshot for an agent."""

    def __init__(self, chosen: ChosenVoice) -> None:
        self.chosen = chosen

    def read(self, agent: Agent) -> VoicesSnapshot:
        return VoicesSnapshot(instruction=self.chosen.instruction())
