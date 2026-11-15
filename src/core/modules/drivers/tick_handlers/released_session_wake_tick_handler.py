from engine.ticker.tick_handler import TickHandler
from core.modules.drivers.ticks.released_session_wake import ReleasedSessionWake
from engine.ticker.tick_interval import TickInterval


class ReleasedSessionWakeTickHandler(TickHandler):
    """The tick handler of ReleasedSessionWake."""

    interval = TickInterval(seconds=5)
    handler = ReleasedSessionWake()
    name = "held session wake"
