from journal.features.memory.support.memory_standing import MemoryStanding
from journal.models.agent import Agent


class MemoryStandingReader:
    """Reads the memory feature's part of the Standing for an agent."""

    def read(self, agent: Agent) -> MemoryStanding:
        return MemoryStanding(mark_owed=agent.mark_owed)
