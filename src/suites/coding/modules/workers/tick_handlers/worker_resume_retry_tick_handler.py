from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry


class WorkerResumeRetryTickHandler(TickHandler):
    """The tick handler of WorkerResumeRetry."""

    interval = TickInterval(seconds=10)
    handler = WorkerResumeRetry()
    name = "worker resume retry"
