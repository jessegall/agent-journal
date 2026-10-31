from dataclasses import dataclass
from core.base.command.move_command import MoveCommand
from core.modules.plans.plan import Plan
from core.modules.plans.plan_lifecycle import PlanLifecycle


@dataclass(frozen=True)
class PlanCancel(MoveCommand[Plan]):
    move = PlanLifecycle.cancel
    reason: str
