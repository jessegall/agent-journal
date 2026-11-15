from engine.ticker.tick_handler import TickHandler
from suites.coding.modules.workers.ticks.worker_tests.stalled_worker_test_runs import STALLED_TESTS_TICK
from suites.coding.modules.workers.ticks.worker_tests.stalled_worker_test_runs import StalledWorkerTestRuns
from engine.ticker.tick_interval import TickInterval


class StalledWorkerTestRunsTickHandler(TickHandler):
    """The tick handler of StalledWorkerTestRuns."""

    interval = TickInterval(seconds=60)
    handler = StalledWorkerTestRuns()
    name = STALLED_TESTS_TICK
