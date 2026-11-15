from engine.ticker.tick_handler import TickHandler
from core.modules.processes.ticks.cadence_watch import CadenceWatch
from engine.ticker.tick_interval import TickInterval


class CadenceWatchTickHandler(TickHandler):
    """The tick handler of CadenceWatch."""

    interval = TickInterval(seconds=10)
    handler = CadenceWatch()
    name = "cadence watch"
