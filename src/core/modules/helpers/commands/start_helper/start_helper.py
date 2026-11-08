from dataclasses import dataclass

from core.base.profile.model_tier import ModelTier

from core.base.command.command import Command
from core.modules.helpers.support.helper_started import HelperStarted


@dataclass(frozen=True)
class StartHelper(Command[HelperStarted]):
    """Starts a helper of a profile on a job."""

    profile: str
    brief: str
    program: str = ""
    program_model: str = ""
    given_name: str = ""
    new_agent_reason: str = ""
    review_plan_id: int | None = None
    tier: ModelTier | None = None
