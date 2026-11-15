from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class AgentLaunch(Model):
    """One attempt to start an agent's program, written by the launcher: its session generation, when it was
    asked for, launched and first sent a hook, when and why it failed, and whether it may be tried again."""

    model_name = "agent_launch"
    cli_name = "agent-launch"

    session_agent_id: int
    attempt: int
    session_generation: int
    requested_at: Timestamp
    launched_at: Timestamp | None = None
    first_hook_at: Timestamp | None = None
    failed_at: Timestamp | None = None
    failure: str = ""
    can_retry: bool = True
    helper_job_id: int | None = None
