from dataclasses import dataclass
from core.base.command.move_command import MoveCommand
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle


@dataclass(frozen=True)
class BlockPlan(MoveCommand[Plan]):
    move = PlanLifecycle.block
    reason: str
