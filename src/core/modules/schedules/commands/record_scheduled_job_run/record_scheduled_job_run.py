from dataclasses import dataclass

from engine.command.command import Command
from core.modules.schedules.models.scheduled_job import ScheduledJob


@dataclass(frozen=True)
class RecordScheduledJobRun(Command[ScheduledJob]):
    """Records that a scheduled job's prompt reached its agent."""

    scheduled_job_id: int
