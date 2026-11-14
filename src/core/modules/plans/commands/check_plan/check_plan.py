from dataclasses import dataclass

from engine.command.command import Command
from core.modules.plans.support.early_run import EarlyRun


@dataclass(frozen=True)
class CheckPlan(Command[EarlyRun]):
    """Has the tasks in testing of a plan's next checkpoint window run now, before the window is done."""

    plan_id: int
