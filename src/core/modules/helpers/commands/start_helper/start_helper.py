from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class StartHelper(Command[Agent]):
    """Starts a helper of a profile on a job."""

    profile: str
    brief: str
    program: str = ""
    program_model: str = ""
    given_name: str = ""
    new_agent_reason: str = ""
    review_plan_id: int | None = None
