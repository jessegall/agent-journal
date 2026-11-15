from engine.ticker.tick_handler import TickHandler
from core.modules.docking.ticks.dock_item_leaves import DockItemLeaves
from engine.ticker.tick_interval import TickInterval


class DockItemLeavesTickHandler(TickHandler):
    """The tick handler of DockItemLeaves."""

    interval = TickInterval(seconds=2)
    handler = DockItemLeaves()
    name = "dock item leaves"
