from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.schedules.commands.end_scheduled_job.end_scheduled_job import EndScheduledJob
from core.modules.schedules.models.scheduled_job import ScheduledJob


class EndScheduledJobHandler(Handler[EndScheduledJob, int]):
    """Ends the open jobs named, and gives back how many."""

    command = EndScheduledJob

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: EndScheduledJob, context: Context) -> int:
        jobs = list(self.queries.query(ScheduledJob).filter(session_agent_id=command.agent_id, job_id=command.job_id).matching(IsNull("ended_at")).all_rows())
        for job in jobs:
            self.repository.save(job.changed(ended_at=context.timestamp), context)
        return len(jobs)
