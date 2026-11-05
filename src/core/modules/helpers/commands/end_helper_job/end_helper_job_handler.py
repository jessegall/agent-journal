from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.helpers.commands.end_helper_job.end_helper_job import EndHelperJob


class EndHelperJobHandler(Handler[EndHelperJob, None]):
    """Marks the job ended."""

    command = EndHelperJob

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: EndHelperJob, context: Context) -> None:
        job = self.queries.query(HelperJob).find(command.job_id)
        self.repository.save(job.changed(ended_at=context.timestamp), context)
