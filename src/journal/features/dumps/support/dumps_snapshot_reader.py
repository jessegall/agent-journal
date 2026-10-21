from journal.features.dumps.support.dumps_snapshot import DumpsSnapshot
from journal.models.agent import Agent
from journal.repositories.dumps import Dumps


class DumpsSnapshotReader:
    """Reads the dumps feature's part of the Snapshot for an agent."""

    def __init__(self, dumps: Dumps) -> None:
        self.dumps = dumps

    def read(self, agent: Agent) -> DumpsSnapshot:
        dump = self.dumps.in_hand()
        if dump is None:
            return DumpsSnapshot(in_hand=0, waiting=0, question_open=False)
        return DumpsSnapshot(in_hand=dump.id, waiting=len(dump.waiting()), question_open=bool(dump.question))
