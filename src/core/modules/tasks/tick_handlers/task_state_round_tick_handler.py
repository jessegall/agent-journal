from engine.ticker.tick_handler import TickHandler
from core.modules.tasks.ticks.task_state_round import SCAN_SECONDS as TASK_SWEEP_SECONDS
from core.modules.tasks.ticks.task_state_round import TaskStateRound
from engine.ticker.tick_interval import TickInterval


class TaskStateRoundTickHandler(TickHandler):
    """The tick handler of TaskStateSweep."""

    interval = TickInterval(seconds=TASK_SWEEP_SECONDS)
    handler = TaskStateRound()
    name = "task state sweep"
