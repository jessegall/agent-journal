from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.schedules.commands.record_scheduled_job_run.record_scheduled_job_run import RecordScheduledJobRun
from core.modules.schedules.models.scheduled_job import ScheduledJob


class RecordScheduledJobRunHandler(Handler[RecordScheduledJobRun, ScheduledJob]):
    """Keeps when a job last ran; a job that does not repeat ends with its run."""

    command = RecordScheduledJobRun

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RecordScheduledJobRun, context: Context) -> ScheduledJob:
        job = self.queries.query(ScheduledJob).find(command.scheduled_job_id)
        return self.repository.update(job, context, last_run_at=context.timestamp, ended_at=job.ended_at if job.is_recurring else context.timestamp)
