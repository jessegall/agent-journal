from dataclasses import dataclass, replace

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
    session_agent_id: int
    creator_id: int
    tool_key: str
    profile: str
    program_model: str
    description: str
    title: str = ""
    instruction: str
    returned: str = ""
    ended_at: Timestamp | None = None
    helper_id: int | None = None
    brief: str = ""
    new_agent_reason: str = ""
    review_plan_id: int | None = None
    report_message_id: int | None = None
    source_message_id: int | None = None
    source_version: int = 0
    source_unavailable: bool = False
    source_line_id: int | None = None
    started_at: Timestamp | None = None
    cost_baseline: float | None = None

    def next_job(self, session: str, brief: str, instruction: str, title: str, creator_id: int) -> "HelperJob":
        return replace(self, id=0, version=0, created_at=None, updated_at=None, creator_id=creator_id, tool_key=f"{session}:{self.id}", brief=brief, instruction=instruction, title=title, ended_at=None, returned="", report_message_id=None,
                       source_message_id=None, source_version=0, source_unavailable=False, source_line_id=None, started_at=None, cost_baseline=None)
