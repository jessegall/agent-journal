from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from suites.coding.modules.workers.ticks.worker_tests.unlaunched_worker_test_runs import UnlaunchedWorkerTestRuns


class UnlaunchedWorkerTestRunsTickHandler(TickHandler):
    """The tick handler of UnlaunchedWorkerTestRuns."""

    interval = TickInterval(seconds=15)
    handler = UnlaunchedWorkerTestRuns()
    name = "unlaunched worker tests"
