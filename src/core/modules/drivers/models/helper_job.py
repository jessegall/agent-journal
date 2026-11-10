from dataclasses import dataclass, replace

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp

NEW_SESSION_LAUNCH = "fresh"
RESUMED_SESSION_LAUNCH = "resumed"


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
    program: str = ""
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
    new_session: bool = False
    halted_seconds: float = 0.0

    @property
    def session(self) -> str:
        return self.tool_key.partition(":")[0]

    def on_new_session(self, session: str) -> "HelperJob":
        return replace(self, new_session=True, cost_baseline=0.0, tool_key=f"{session}:{self.tool_key.partition(':')[2]}")

    @property
    def occupant_launch(self) -> str:
        return NEW_SESSION_LAUNCH if self.new_session else RESUMED_SESSION_LAUNCH

    def next_job(self, session: str, program: str, program_model: str, brief: str, instruction: str, title: str, creator_id: int) -> "HelperJob":
        return replace(self, id=0, version=0, created_at=None, updated_at=None, creator_id=creator_id, tool_key=f"{session}:{self.id}", program=program, program_model=program_model, brief=brief, instruction=instruction, title=title, ended_at=None, returned="", report_message_id=None,
                       source_message_id=None, source_version=0, source_unavailable=False, source_line_id=None, started_at=None, cost_baseline=None, halted_seconds=0.0, new_session=False)
