from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.drivers.models.enums.job_report_state import JobReportState
from core.modules.helpers.commands.drop_kept_report.drop_kept_report import DropKeptReport
from core.modules.helpers.support.kept_reports import KeptReports


class DropKeptReportHandler(Handler[DropKeptReport, str]):
    """Ends the job with no report; its kept text stays on the job for anyone who reads it."""

    command = DropKeptReport

    def __init__(self, reports: KeptReports, repository: Repository) -> None:
        self.reports, self.repository = reports, repository

    def handle(self, command: DropKeptReport, context: Context) -> str:
        job = self.reports.required_job(command.helper_id)
        self.repository.save(job.changed(ended_at=context.timestamp, report_state=JobReportState.REPORT_MISSING), context)
        return f"job {job.id} ended with no report"
