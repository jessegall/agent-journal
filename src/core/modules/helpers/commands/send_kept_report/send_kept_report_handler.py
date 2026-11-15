from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.helpers.commands.send_kept_report.send_kept_report import SendKeptReport
from core.modules.helpers.support.kept_reports import KeptReports
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport


class SendKeptReportHandler(Handler[SendKeptReport, str]):
    """Saves the kept text as the job's report, once: the job closes and the parent gets the report."""

    command = SendKeptReport

    def __init__(self, reports: KeptReports, agents: AgentRows, bus: Bus) -> None:
        self.reports, self.agents, self.bus = reports, agents, bus

    def handle(self, command: SendKeptReport, context: Context) -> str:
        job = self.reports.required_job(command.helper_id)
        helper = self.agents.find(command.helper_id)
        self.bus.run(RecordParentReport(helper.id, helper.required_parent_id(), job.failed_text, job.id), context.actor, environment_id=helper.environment_id)
        return f"job {job.id} handed its kept report in"
