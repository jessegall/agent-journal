from dataclasses import dataclass
from collections.abc import Mapping

from core.base.agent_role import AgentRole
from core.base.timestamp import Timestamp
from core.modules.usage.models.enums.agent_list_state import AgentListState


@dataclass(frozen=True, kw_only=True)
class AgentListingState:
    id: int
    environment_id: int
    session: str
    role: AgentRole
    access: str
    program: str
    program_model: str
    profile: str
    given_name: str
    paused_at: Timestamp | None
    ended_at: Timestamp | None
    retired_at: Timestamp | None
    retirement_reason: str
    started_task_id: int | None
    started_task_title: str
    tasks: str
    is_blocked: bool
    last_activity: str
    job_model: str
    job_profile: str
    job_description: str
    job_instruction: str
    helper_job_description: str
    helper_job_brief: str
    job_returned: str
    parent_id: int | None
    created_at: Timestamp
    updated_at: Timestamp
    process_started_at: Timestamp | None
    state: AgentListState
    resume_reason: str | None
    facts: Mapping[str, object]
    job_command: tuple[str, ...]
    job_task_flag: str
