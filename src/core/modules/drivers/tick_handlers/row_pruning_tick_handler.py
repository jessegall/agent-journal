from engine.ticker.tick_handler import TickHandler
from core.modules.drivers.ticks.row_pruning import RowPruning
from engine.ticker.tick_interval import TickInterval


class RowPruningTickHandler(TickHandler):
    """The tick handler of RowPruning."""

    interval = TickInterval(seconds=60)
    handler = RowPruning()
    name = "row pruning"
