from engine.ticker.tick_handler import TickHandler
from core.modules.tasks.ticks.task_state_sweep import SCAN_SECONDS as PLAN_SWEEP_SECONDS
from core.modules.plans.ticks.plan_state_sweep import PlanStateSweep
from engine.ticker.tick_interval import TickInterval


class PlanStateSweepTickHandler(TickHandler):
    """The tick handler of PlanStateSweep."""

    interval = TickInterval(seconds=PLAN_SWEEP_SECONDS)
    handler = PlanStateSweep()
    name = "plan state sweep"
