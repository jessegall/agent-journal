from engine import bus
from resources.base import SYSTEM

TICKED, BEAT = "ticked", "beat"


def tick(record, agent: int) -> None:
    bus.announce(record, "agent", agent, TICKED, SYSTEM)


def beat(record, agent: int) -> None:
    """The engine's own pulse, every second, for what must be answered at once; the clock's tick carries the slow upkeep and may come far apart."""
    bus.announce(record, "agent", agent, BEAT, SYSTEM)
