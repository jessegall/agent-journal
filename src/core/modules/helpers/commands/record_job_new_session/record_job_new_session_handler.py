from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.helpers.commands.record_job_new_session.record_job_new_session import RecordJobNewSession


class RecordJobNewSessionHandler(Handler[RecordJobNewSession, None]):
    """Marks the job as one that began a new program session."""

    command = RecordJobNewSession

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: RecordJobNewSession, context: Context) -> None:
        self.repository.save(self.rows.required(HelperJob, command.job_id).changed(new_session=True), context)
