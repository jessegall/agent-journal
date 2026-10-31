from typing import Protocol


class DriverChoice(Protocol):
    """The driver that drives an agent, as the drivers module chooses it."""

    def driver(self, agent_id: int) -> str: ...
