from journal.events.standing import Standing
from journal.models.agent import Agent
from journal.support.standing_reader import StandingReader


class StandingReaders:
    """Every feature's standing reader by the feature's name; builds the Standing an event carries for the agent asked."""

    def __init__(self, readers: dict[str, StandingReader]) -> None:
        self.readers = readers

    def for_agent(self, agent: Agent) -> Standing:
        return Standing({name: reader.read(agent) for name, reader in self.readers.items()})
