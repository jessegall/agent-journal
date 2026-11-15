from engine.ticker.tick_handler import TickHandler
from core.modules.demo.ticks.demo_owner_watch import DemoOwnerWatch
from engine.ticker.tick_interval import TickInterval


class DemoOwnerWatchTickHandler(TickHandler):
    """The tick handler of DemoOwnerWatch."""

    interval = TickInterval(seconds=5)
    handler = DemoOwnerWatch()
    name = "demo owner watch"
