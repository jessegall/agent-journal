from typing import Protocol

from journal.models.agent import Agent


class DataReader(Protocol):
    """A feature's reading of its rows for the agent the state machine asks: one frozen part, read before every event."""

    def read(self, agent: Agent) -> object: ...
