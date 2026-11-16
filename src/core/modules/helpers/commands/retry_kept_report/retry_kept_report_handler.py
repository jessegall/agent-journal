from engine.command.bus import Bus
from engine.database.database import Database
from engine.errors.refusal import Refusal
from core.modules.helpers.commands.record_unsaved_report.record_unsaved_report import RecordUnsavedReport
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.helpers.commands.retry_kept_report.retry_kept_report import RetryKeptReport
from core.modules.helpers.support.kept_reports import KeptReports
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport


class RetryKeptReportHandler(Handler[RetryKeptReport, str]):
    """Saves the kept text as the job's report, once: the job closes and the parent gets the report. A save that is
    refused again is counted on the job, so the minute step stops trying after handover-retries."""

    command = RetryKeptReport

    def __init__(self, reports: KeptReports, agents: AgentRows, bus: Bus, database: Database) -> None:
        self.reports, self.agents, self.bus, self.database = reports, agents, bus, database

    def handle(self, command: RetryKeptReport, context: Context) -> str:
        job = self.reports.required_job(command.helper_id)
        helper = self.agents.find(command.helper_id)
        try:
            with self.database.savepoint(type(command).__name__):
                self.bus.dispatch(RecordParentReport(helper.id, helper.required_parent_id(), job.failed_text, job.id), context)
        except Refusal:
            self.bus.dispatch(RecordUnsavedReport(job.id, job.failed_text), context)
            return f"job {job.id} could not hand its kept report in again"
        return f"job {job.id} handed its kept report in"
