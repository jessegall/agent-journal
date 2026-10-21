from journal.events.readings import Readings
from journal.models.agent import Agent
from journal.support.readings_reader import ReadingsReader


class ReadingsReaders:
    """Every feature's readings reader by the feature's name; builds the Readings an event carries for the agent asked."""

    def __init__(self, readers: dict[str, ReadingsReader]) -> None:
        self.readers = readers

    def for_agent(self, agent: Agent) -> Readings:
        return Readings({name: reader.read(agent) for name, reader in self.readers.items()})
