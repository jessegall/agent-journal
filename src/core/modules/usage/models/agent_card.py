from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.view_model import ViewModel
from engine.time.timestamp import Timestamp
from core.modules.usage.models.support.views import AGENT_CARDS_SELECT


@dataclass(frozen=True, kw_only=True)
class AgentCard(EnvironmentScoped, ViewModel):
    """An agent with what its card shows besides its status line: its started task, its tasks as a JSON list, whether
    a block holds it, and what its dispatch gave it, read from the agent_cards view."""

    cli_name = "agent-card"
    view = "agent_cards"
    key = "id"
    select = AGENT_CARDS_SELECT

    id: int
    environment_id: int
    session: str
    role: str
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
    job_returned: str
