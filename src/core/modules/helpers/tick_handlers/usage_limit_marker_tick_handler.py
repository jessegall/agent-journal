from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from core.modules.helpers.ticks.usage_limit_marker import UsageLimitMarker


class UsageLimitMarkerTickHandler(TickHandler):
    """The tick handler of UsageLimitMarker."""

    interval = TickInterval(seconds=3)
    handler = UsageLimitMarker()
    name = "usage limit marks"
