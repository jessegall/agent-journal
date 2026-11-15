from engine.ticker.tick_handler import TickHandler
from core.modules.phone.ticks.phone_notices import PhoneNotices
from engine.ticker.tick_interval import TickInterval


class PhoneNoticesTickHandler(TickHandler):
    """The tick handler of PhoneNotices."""

    interval = TickInterval(seconds=60)
    handler = PhoneNotices()
    name = "phone notices"
    starts_immediately = True
