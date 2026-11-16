from engine.ticker.tick_handler import TickHandler
from core.modules.tasks.ticks.task_state_round import SCAN_SECONDS as PLAN_SWEEP_SECONDS
from core.modules.plans.ticks.plan_state_round import PlanStateRound
from engine.ticker.tick_interval import TickInterval


class PlanStateRoundTickHandler(TickHandler):
    """The tick handler of PlanStateSweep."""

    interval = TickInterval(seconds=PLAN_SWEEP_SECONDS)
    handler = PlanStateRound()
    name = "plan state sweep"
