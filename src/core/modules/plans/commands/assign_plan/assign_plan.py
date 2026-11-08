from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.plans.models.plan import Plan


@dataclass(frozen=True)
class AssignPlan(Command[Plan]):
    """Gives a plan or one of its phases to the agent named, which reserves its open tasks for it, or leaves
    them free for the main agent to pick when none is named."""

    plan_id: int
    agent_id: int | None = None
    phase_id: int | None = None
