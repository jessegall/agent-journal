from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.schedules.commands.end_scheduled_job.end_scheduled_job import EndScheduledJob
from core.modules.schedules.models.scheduled_job import ScheduledJob


class EndScheduledJobHandler(Handler[EndScheduledJob, int]):
    """Ends the open jobs named, and gives back how many."""

    command = EndScheduledJob

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: EndScheduledJob, context: Context) -> int:
        jobs = list(self.queries.query(ScheduledJob).filter(session_agent_id=command.agent_id).matching(IsNull("ended_at")).all_rows())
        ended = [job for job in jobs if command.job_id is None or job.job_id == command.job_id]
        for job in ended:
            self.repository.save(job.changed(ended_at=context.timestamp), context)
        return len(ended)
