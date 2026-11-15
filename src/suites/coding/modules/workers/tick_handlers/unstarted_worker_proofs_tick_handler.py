from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from suites.coding.modules.workers.ticks.worker_tests.unstarted_worker_proofs import UnstartedWorkerProofs


class UnstartedWorkerProofsTickHandler(TickHandler):
    """The tick handler of UnstartedWorkerProofs."""

    interval = TickInterval(seconds=60)
    handler = UnstartedWorkerProofs()
    name = "unstarted worker proofs"
