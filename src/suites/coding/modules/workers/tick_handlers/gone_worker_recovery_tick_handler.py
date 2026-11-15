from engine.ticker.tick_handler import TickHandler
from suites.coding.modules.workers.ticks.gone_worker_recovery import GoneWorkerRecovery
from engine.ticker.tick_interval import TickInterval


class GoneWorkerRecoveryTickHandler(TickHandler):
    """The tick handler of GoneWorkerRecovery."""

    interval = TickInterval(seconds=24 * 60 * 60)
    handler = GoneWorkerRecovery()
    name = "gone worker recovery at start"
    starts_immediately = True
