from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.model import Model
from core.base.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class HelperJob(EnvironmentScoped, Model):
    """A helper an agent sent out: its profile, model, job and instruction, and what it returned when it ended."""

    model_name = "helper_job"
    shared_rows = True
    cli_name = "helper-job"

    environment_id: int = 0
    agent_id: int
    creator_id: int
    tool_key: str
    profile: str
    program_model: str
    description: str
    instruction: str
    returned: str = ""
    ended_at: Timestamp | None = None
    helper_id: int | None = None
    brief: str = ""
    report_message_id: int | None = None
