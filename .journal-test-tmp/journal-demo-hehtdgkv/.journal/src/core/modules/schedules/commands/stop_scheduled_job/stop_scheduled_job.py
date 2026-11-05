from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.schedules.models.scheduled_job import ScheduledJob


@dataclass(frozen=True)
class StopScheduledJob(Command[ScheduledJob]):
    """A person asks an agent to delete a job it scheduled."""

    row_id: int
