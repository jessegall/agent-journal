from engine.ticker.tick_handler import TickHandler
from core.modules.assign_rules.ticks.judge_skipped_tasks_tick import JudgeSkippedTasksTick
from engine.ticker.tick_interval import TickInterval


class JudgeSkippedTasksTickHandler(TickHandler):
    """The tick handler of JudgeSkippedTasksTick."""

    interval = TickInterval(seconds=60)
    handler = JudgeSkippedTasksTick()
    name = "assign rules retry"
