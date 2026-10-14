import threading

from journal.features.bus import Bus
from journal.repositories.agents import Agents


class Clock:
    """A thread that tells the bus Ticked for every live agent, every interval, as long as the server runs."""

    def __init__(self, agents: Agents, bus: Bus, interval: float = 5.0) -> None: ...

    def start(self) -> None: ...

    def tick(self) -> None: ...

    def stop(self) -> None: ...
