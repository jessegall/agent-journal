from journal.features.dumps.support.dumps_readings import DumpsReadings
from journal.models.agent import Agent
from journal.repositories.dumps import Dumps


class DumpsReadingsReader:
    """Reads the dumps feature's part of the Readings for an agent."""

    def __init__(self, dumps: Dumps) -> None:
        self.dumps = dumps

    def read(self, agent: Agent) -> DumpsReadings:
        dump = self.dumps.in_hand()
        if dump is None:
            return DumpsReadings(in_hand=0, waiting=0, question_open=False)
        return DumpsReadings(in_hand=dump.id, waiting=len(dump.waiting()), question_open=bool(dump.question))
