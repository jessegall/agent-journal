from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from suites.coding.modules.workers.ticks.unused_worker_retirements import UnusedWorkerRetirements


class UnusedWorkerRetirementsTickHandler(TickHandler):
    """The tick handler of UnusedWorkerRetirements."""

    interval = TickInterval(seconds=60)
    handler = UnusedWorkerRetirements()
    name = "unused worker retirements"
