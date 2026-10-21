from journal.features.dumps.support.dumps_data import DumpsData
from journal.models.agent import Agent
from journal.repositories.dumps import Dumps


class DumpsDataReader:
    """Reads the dumps feature's part of the feature data for an agent."""

    def __init__(self, dumps: Dumps) -> None:
        self.dumps = dumps

    def read(self, agent: Agent) -> DumpsData:
        dump = self.dumps.current()
        if dump is None:
            return DumpsData(current_dump=0, waiting=0, question_open=False)
        return DumpsData(current_dump=dump.id, waiting=len(dump.waiting()), question_open=bool(dump.question))
