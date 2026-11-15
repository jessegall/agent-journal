from engine.ticker.tick_handler import TickHandler
from core.modules.drivers.ticks.hook_pruning import HookPruning
from engine.ticker.tick_interval import TickInterval


class HookPruningTickHandler(TickHandler):
    """The tick handler of HookPruning."""

    interval = TickInterval(seconds=60 * 60)
    handler = HookPruning()
    name = "hook pruning"
