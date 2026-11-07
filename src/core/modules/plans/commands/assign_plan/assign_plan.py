from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.plans.models.plan import Plan


@dataclass(frozen=True)
class AssignPlan(Command[Plan]):
    """Gives a plan to a worker, or to the main agent when no worker is named, and moves its open tasks to it."""

    plan_id: int
    worker_id: int | None = None
