from dataclasses import dataclass
from collections.abc import Mapping

from engine.enums.agent_role import AgentRole
from engine.time.timestamp import Timestamp
from core.modules.usage.models.enums.agent_list_state import AgentListState


@dataclass(frozen=True, kw_only=True)
class AgentListingState:
    id: int
    number: int
    environment_id: int
    session: str
    role: AgentRole
    access: str
    program: str
    program_model: str
    profile: str
    given_name: str
    paused_at: Timestamp | None
    usage_limit_ends_at: Timestamp | None
    ended_at: Timestamp | None
    retired_at: Timestamp | None
    retirement_reason: str
    started_task_id: int | None
    started_task_title: str
    tasks: str
    block_started_at: str
    block_reason: str
    task_blocked: bool
    last_activity: str
    job_model: str
    job_profile: str
    job_description: str
    job_instruction: str
    helper_job_description: str
    helper_job_brief: str
    helper_job_title: str
    helper_job_program: str
    helper_job_new_session: bool | None
    is_helper_job_open: bool
    compaction_ended_at: str | None
    session_count: int
    replaced_session_end_reason: str | None
    memory_count: int
    retiring_actor_name: str | None
    job_returned: str
    parent_id: int | None
    created_at: Timestamp
    updated_at: Timestamp
    process_started_at: Timestamp | None
    state: AgentListState
    standing: str
    resume_reason: str | None
    facts: Mapping[str, object]
    job_command: tuple[str, ...]
    job_task_flag: str
