from engine.ticker.tick_handler import TickHandler
from core.modules.drivers.ticks.end_silent_helpers_tick import EndSilentHelpersTick
from engine.ticker.tick_interval import TickInterval


class EndSilentHelpersTickHandler(TickHandler):
    """The tick handler of EndSilentHelpersTick."""

    interval = TickInterval(seconds=60)
    handler = EndSilentHelpersTick()
    name = "silent helpers"
