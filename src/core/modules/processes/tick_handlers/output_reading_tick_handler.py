from engine.ticker.tick_handler import TickHandler
from core.modules.processes.ticks.output_reading import OutputReading
from engine.ticker.tick_interval import TickInterval


class OutputReadingTickHandler(TickHandler):
    """The tick handler of OutputReading."""

    interval = TickInterval(seconds=1)
    handler = OutputReading()
    name = "read running outputs"
