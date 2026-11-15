from engine.ticker.tick_handler import TickHandler
from suites.coding.modules.workers.ticks.merger_retry import MergerRetry
from engine.ticker.tick_interval import TickInterval


class MergerRetryTickHandler(TickHandler):
    """The tick handler of MergerRetry."""

    interval = TickInterval(seconds=60)
    handler = MergerRetry()
    name = "merger retry"
