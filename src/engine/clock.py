import time

from engine import bus
from resources.base import SYSTEM, Event

TICKED = "ticked"


def tick(record, agent: int) -> None:
    bus.emit(Event(0, time.time(), "agent", agent, TICKED, SYSTEM), record)
