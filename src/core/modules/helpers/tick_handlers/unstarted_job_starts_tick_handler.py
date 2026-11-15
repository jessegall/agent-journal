from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.helpers.ticks.unstarted_job_starts import UnstartedJobStarts


class UnstartedJobStartsTickHandler(TickHandler):
    """The tick handler of UnstartedJobStarts."""

    interval = TickInterval(seconds=60)
    handler = UnstartedJobStarts()
    name = "helper jobs that never started"
