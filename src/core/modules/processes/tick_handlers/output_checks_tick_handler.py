from engine.ticker.tick_handler import TickHandler
from core.modules.processes.ticks.output_checks import OutputChecks
from engine.ticker.tick_interval import TickInterval


class OutputChecksTickHandler(TickHandler):
    """The tick handler of OutputChecks."""

    interval = TickInterval(seconds=15)
    handler = OutputChecks()
    name = "output checks"
