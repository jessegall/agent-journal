from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.drivers.models.enums.handover_state import HandoverState
from core.modules.helpers.commands.end_kept_report.end_kept_report import EndKeptReport
from core.modules.helpers.support.kept_reports import KeptReports


class EndKeptReportHandler(Handler[EndKeptReport, str]):
    """Ends the job with no report; its kept text stays on the job for anyone who reads it."""

    command = EndKeptReport

    def __init__(self, reports: KeptReports, repository: Repository) -> None:
        self.reports, self.repository = reports, repository

    def handle(self, command: EndKeptReport, context: Context) -> str:
        job = self.reports.required_job(command.helper_id)
        self.repository.save(job.changed(ended_at=context.timestamp, handover_state=HandoverState.REPORT_MISSING), context)
        return f"job {job.id} ended with no report"
