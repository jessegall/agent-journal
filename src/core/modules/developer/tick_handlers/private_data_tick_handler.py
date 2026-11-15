from engine.ticker.tick_handler import TickHandler
from core.modules.developer.ticks.private_data_tick import PrivateDataTick
from engine.ticker.tick_interval import TickInterval


class PrivateDataTickHandler(TickHandler):
    """The tick handler of PrivateDataTick."""

    interval = TickInterval(seconds=60)
    handler = PrivateDataTick()
    name = "private data scan"
