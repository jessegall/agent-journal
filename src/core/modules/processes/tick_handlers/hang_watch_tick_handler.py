from engine.ticker.tick_handler import TickHandler
from core.modules.processes.ticks.hang_watch import HangWatch
from engine.ticker.tick_interval import TickInterval


class HangWatchTickHandler(TickHandler):
    """The tick handler of HangWatch."""

    interval = TickInterval(seconds=15)
    handler = HangWatch()
    name = "hang watch"
