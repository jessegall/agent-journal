from dataclasses import dataclass

from engine.command.command import Command
from core.modules.tasks.support.task_waits_updated_together import TaskWaitsUpdatedTogether
from core.modules.plans.models.plan import Plan


@dataclass(frozen=True)
class AssignPlan(Command[Plan], TaskWaitsUpdatedTogether):
    """Gives a plan or one of its phases to the agent named, and with it the tasks that have no assignee yet, or
    with override every task; with no agent named the plan goes to the main agent and its tasks stay as they are."""

    plan_id: int
    agent_id: int | None = None
    phase_id: int | None = None
    override: bool = False
