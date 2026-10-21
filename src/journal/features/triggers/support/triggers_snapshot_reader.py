from journal.features.triggers.support.triggers_snapshot import TriggersSnapshot
from journal.models.agent import Agent
from journal.repositories.triggers import Triggers


class TriggersSnapshotReader:
    """Reads the triggers feature's part of the Snapshot for an agent."""

    def __init__(self, triggers: Triggers) -> None:
        self.triggers = triggers

    def read(self, agent: Agent) -> TriggersSnapshot:
        return TriggersSnapshot(triggers=tuple(self.triggers.all()))
