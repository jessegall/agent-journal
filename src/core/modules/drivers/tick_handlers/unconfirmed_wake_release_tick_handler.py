from engine.ticker.tick_handler import TickHandler
from core.modules.drivers.ticks.unconfirmed_wake_release import UnconfirmedWakeRelease
from engine.ticker.tick_interval import TickInterval


class UnconfirmedWakeReleaseTickHandler(TickHandler):
    """The tick handler of UnconfirmedWakeRelease."""

    interval = TickInterval(seconds=1)
    handler = UnconfirmedWakeRelease()
    name = "unconfirmed wakes"
