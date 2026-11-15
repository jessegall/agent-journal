from engine.ticker.tick_handler import TickHandler
from core.modules.plugins.ticks.plugin_card_reading import PluginCardReading
from engine.ticker.tick_interval import TickInterval


class PluginCardReadingTickHandler(TickHandler):
    """The tick handler of PluginCardReading."""

    interval = TickInterval(seconds=1)
    handler = PluginCardReading()
    name = "plugin card reading"
