from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.schedules.models.scheduled_job import ScheduledJob


@dataclass(frozen=True)
class RecordScheduledJob(Command[ScheduledJob]):
    """An agent's program scheduled a job."""

    lock = False

    agent_id: int
    job_id: str
    cron: str
    prompt: str
    is_recurring: bool
