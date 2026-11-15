from engine.ticker.tick_handler import TickHandler
from core.modules.drivers.ticks.panic_watch import PanicWatch
from engine.ticker.tick_interval import TickInterval


class PanicWatchTickHandler(TickHandler):
    """The tick handler of PanicWatch."""

    interval = TickInterval(seconds=2)
    handler = PanicWatch()
    name = "panic watch"
