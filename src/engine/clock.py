from engine import bus
from resources.base import SYSTEM

TICKED = "ticked"


def tick(record, agent: int) -> None:
    bus.announce(record, "agent", agent, TICKED, SYSTEM)
