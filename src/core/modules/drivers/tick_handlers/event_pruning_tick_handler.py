from engine.ticker.tick_handler import TickHandler
from core.modules.drivers.ticks.event_pruning import EventPruning
from engine.ticker.tick_interval import TickInterval


class EventPruningTickHandler(TickHandler):
    """The tick handler of EventPruning."""

    interval = TickInterval(seconds=5)
    handler = EventPruning()
    name = "event pruning"
