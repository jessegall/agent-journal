from dataclasses import dataclass
from engine.command.move_command import MoveCommand
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle


@dataclass(frozen=True)
class ReturnPlan(MoveCommand[Plan]):
    move = PlanLifecycle.rework
    reason: str
