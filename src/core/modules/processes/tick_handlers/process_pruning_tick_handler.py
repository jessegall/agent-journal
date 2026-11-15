from engine.ticker.tick_handler import TickHandler
from core.modules.processes.ticks.process_pruning import ProcessPruning
from engine.ticker.tick_interval import TickInterval


class ProcessPruningTickHandler(TickHandler):
    """The tick handler of ProcessPruning."""

    interval = TickInterval(seconds=15 * 60)
    handler = ProcessPruning()
    name = "process pruning"
