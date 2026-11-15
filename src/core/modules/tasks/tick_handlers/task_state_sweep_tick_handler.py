from engine.ticker.tick_handler import TickHandler
from core.modules.tasks.ticks.task_state_sweep import SCAN_SECONDS as TASK_SWEEP_SECONDS
from core.modules.tasks.ticks.task_state_sweep import TaskStateSweep
from engine.ticker.tick_interval import TickInterval


class TaskStateSweepTickHandler(TickHandler):
    """The tick handler of TaskStateSweep."""

    interval = TickInterval(seconds=TASK_SWEEP_SECONDS)
    handler = TaskStateSweep()
    name = "task state sweep"
