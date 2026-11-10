from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.helpers.commands.end_helper_job.end_helper_job import EndHelperJob


class EndHelperJobHandler(Handler[EndHelperJob, None]):
    """Marks the job ended."""

    command = EndHelperJob

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: EndHelperJob, context: Context) -> None:
        job = self.rows.required(HelperJob, command.job_id)
        self.repository.save(job.changed(ended_at=context.timestamp, returned=command.returned), context)
