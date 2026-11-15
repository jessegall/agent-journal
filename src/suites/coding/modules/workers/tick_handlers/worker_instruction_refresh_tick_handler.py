from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from suites.coding.modules.workers.ticks.worker_instruction_refresh import WorkerInstructionRefresh


class WorkerInstructionRefreshTickHandler(TickHandler):
    """The tick handler of WorkerInstructionRefresh."""

    interval = TickInterval(seconds=60)
    handler = WorkerInstructionRefresh()
    name = "worker instruction files"
