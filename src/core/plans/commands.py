from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from core.plans.plan import Plan, PlanLifecycle


@dataclass(frozen=True)
class PlanPause(MoveCommand[Plan]):
    move = PlanLifecycle.pause
    reason: str


@dataclass(frozen=True)
class PlanBlock(MoveCommand[Plan]):
    move = PlanLifecycle.block
    reason: str


@dataclass(frozen=True)
class PlanCancel(MoveCommand[Plan]):
    move = PlanLifecycle.cancel
    reason: str
