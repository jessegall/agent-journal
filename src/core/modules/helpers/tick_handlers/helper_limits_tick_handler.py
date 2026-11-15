from engine.ticker.tick_handler import TickHandler
from core.modules.helpers.ticks.helper_limits_tick import HelperLimitsTick
from engine.ticker.tick_interval import TickInterval


class HelperLimitsTickHandler(TickHandler):
    """The tick handler of HelperLimitsTick."""

    interval = TickInterval(seconds=60)
    handler = HelperLimitsTick()
    name = "helper limits"
