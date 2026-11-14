from dataclasses import dataclass

from engine.command.move_command import MoveCommand
from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle
from core.modules.plans.models.plan import Plan


@dataclass(frozen=True)
class ApprovePlan(MoveCommand[Plan]):
    """Approves a plan with an optional message from the user approving it."""

    move = PlanLifecycle.approve
    message: str = ""
