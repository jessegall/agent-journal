from dataclasses import dataclass

from engine.command.command import Command
from core.modules.plans.models.plan import Plan


@dataclass(frozen=True)
class RecordPlanAgent(Command[Plan]):
    """Names the agent that works a plan, for a send to a kept worker whose next worktree is not cut yet; the
    plan's tasks go to it by the send itself."""

    plan_id: int
    agent_id: int
