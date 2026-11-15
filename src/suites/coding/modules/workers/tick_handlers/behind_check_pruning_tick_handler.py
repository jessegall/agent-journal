from engine.ticker.tick_handler import TickHandler
from suites.coding.modules.workers.ticks.behind_check_pruning import BehindCheckPruning
from engine.ticker.tick_interval import TickInterval


class BehindCheckPruningTickHandler(TickHandler):
    """The tick handler of BehindCheckPruning."""

    interval = TickInterval(seconds=3600)
    handler = BehindCheckPruning()
    name = "behind check pruning"
