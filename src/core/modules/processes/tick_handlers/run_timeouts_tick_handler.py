from engine.ticker.tick_handler import TickHandler
from core.modules.processes.ticks.run_timeouts import RunTimeouts
from engine.ticker.tick_interval import TickInterval


class RunTimeoutsTickHandler(TickHandler):
    """The tick handler of RunTimeouts."""

    interval = TickInterval(seconds=1)
    handler = RunTimeouts()
    name = "run timeouts"
