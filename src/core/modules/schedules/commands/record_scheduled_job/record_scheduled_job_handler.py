from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.schedules.commands.record_scheduled_job.record_scheduled_job import RecordScheduledJob
from core.modules.schedules.models.scheduled_job import ScheduledJob


class RecordScheduledJobHandler(Handler[RecordScheduledJob, ScheduledJob]):
    """Keeps the job an agent scheduled."""

    command = RecordScheduledJob

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordScheduledJob, context: Context) -> ScheduledJob:
        return self.repository.save(ScheduledJob(session_agent_id=command.agent_id, creator_id=command.agent_id, job_id=command.job_id, cron=command.cron,
                                                 prompt=command.prompt, is_recurring=command.is_recurring), context)
