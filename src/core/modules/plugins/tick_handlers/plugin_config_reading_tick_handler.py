from engine.ticker.tick_handler import TickHandler
from core.modules.plugins.ticks.plugin_config_reading import PluginConfigReading
from engine.ticker.tick_interval import TickInterval


class PluginConfigReadingTickHandler(TickHandler):
    """The tick handler of PluginConfigReading."""

    interval = TickInterval(seconds=5)
    handler = PluginConfigReading()
    name = "plugin config reading"
    starts_immediately = True
