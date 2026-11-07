from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle
from core.modules.plans.models.plan import Plan


@dataclass(frozen=True)
class ClosePlan(MoveCommand[Plan]):
    move = PlanLifecycle.close
