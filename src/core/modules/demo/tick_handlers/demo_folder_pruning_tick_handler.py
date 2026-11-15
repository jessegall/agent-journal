from engine.ticker.tick_handler import TickHandler
from core.modules.demo.ticks.demo_folder_pruning import DemoFolderPruning
from engine.ticker.tick_interval import TickInterval


class DemoFolderPruningTickHandler(TickHandler):
    """The tick handler of DemoFolderPruning."""

    interval = TickInterval(seconds=15 * 60)
    handler = DemoFolderPruning()
    name = "demo folder pruning"
