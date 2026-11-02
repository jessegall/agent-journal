from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class ScheduledJob(Model):
    """A prompt an agent scheduled for itself in its own program: the id the program gave it, its cron
    schedule, the prompt, whether it repeats, when a person asked it stopped, and when it ended."""

    model_name = "scheduled_job"
    cli_name = "scheduled-job"

    agent_id: int
    environment_id: int
    creator_id: int
    job_id: str
    cron: str
    prompt: str
    is_recurring: bool = True
    stop_requested_at: Timestamp | None = None
    ended_at: Timestamp | None = None
