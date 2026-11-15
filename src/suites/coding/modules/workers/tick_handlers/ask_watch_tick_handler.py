from engine.ticker.tick_handler import TickHandler
from suites.coding.modules.workers.ticks.ask_watch import AskWatch
from engine.ticker.tick_interval import TickInterval


class AskWatchTickHandler(TickHandler):
    """The tick handler of AskWatch."""

    interval = TickInterval(seconds=60)
    handler = AskWatch()
    name = "worker question watch"
