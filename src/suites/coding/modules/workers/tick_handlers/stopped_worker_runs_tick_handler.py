from engine.ticker.tick_handler import TickHandler
from suites.coding.modules.workers.ticks.stopped_worker_runs import StoppedWorkerRuns
from engine.ticker.tick_interval import TickInterval


class StoppedWorkerRunsTickHandler(TickHandler):
    """The tick handler of StoppedWorkerRuns."""

    interval = TickInterval(seconds=60)
    handler = StoppedWorkerRuns()
    name = "stopped worker runs"
