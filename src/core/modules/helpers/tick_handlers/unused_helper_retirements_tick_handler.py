from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.helpers.ticks.unused_helper_retirements import UnusedHelperRetirements


class UnusedHelperRetirementsTickHandler(TickHandler):
    """The tick handler of UnusedHelperRetirements."""

    interval = TickInterval(seconds=600)
    handler = UnusedHelperRetirements()
    name = "unused helper retirements"
