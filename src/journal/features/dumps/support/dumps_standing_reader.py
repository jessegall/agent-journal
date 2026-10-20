from journal.features.dumps.support.dumps_standing import DumpsStanding
from journal.models.agent import Agent
from journal.repositories.dumps import Dumps


class DumpsStandingReader:
    """Reads the dumps feature's part of the Standing for an agent."""

    def __init__(self, dumps: Dumps) -> None:
        self.dumps = dumps

    def read(self, agent: Agent) -> DumpsStanding:
        dump = self.dumps.in_hand()
        return DumpsStanding(in_hand=dump.id if dump else 0)
