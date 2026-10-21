from journal.events.snapshot import Snapshot
from journal.models.agent import Agent
from journal.support.snapshot_reader import SnapshotReader


class SnapshotReaders:
    """Every feature's snapshot reader by the feature's name; builds the Snapshot an event carries for the agent asked."""

    def __init__(self, readers: dict[str, SnapshotReader]) -> None:
        self.readers = readers

    def for_agent(self, agent: Agent) -> Snapshot:
        return Snapshot({name: reader.read(agent) for name, reader in self.readers.items()})
