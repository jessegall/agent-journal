from engine.ticker.tick_handler import TickHandler
from suites.coding.modules.workers.ticks.stopped_worker_libraries import StoppedWorkerLibraries
from engine.ticker.tick_interval import TickInterval


class StoppedWorkerLibrariesTickHandler(TickHandler):
    """The tick handler of StoppedWorkerLibraries."""

    interval = TickInterval(seconds=60)
    handler = StoppedWorkerLibraries()
    name = "stopped worker libraries"
