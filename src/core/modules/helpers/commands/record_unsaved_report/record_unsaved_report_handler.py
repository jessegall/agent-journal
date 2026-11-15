from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.nudger import Nudger
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.enums.handover_state import HandoverState
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.helpers.commands.record_unsaved_report.record_unsaved_report import RecordUnsavedReport
from core.modules.helpers.nudges.kept_report_nudge import KeptReportNudge

REPORT_SOURCE = "helpers.unsaved-report"


class RecordUnsavedReportHandler(Handler[RecordUnsavedReport, None]):
    """Counts the failed save on the job; at the second it keeps the text as capture-failed and tells the parent
    that the helper's report waits to be tried again or dropped."""

    command = RecordUnsavedReport

    def __init__(self, queries: Queries, repository: Repository, agents: AgentRows, nudger: Nudger) -> None:
        self.queries, self.repository, self.agents, self.nudger = queries, repository, agents, nudger

    def handle(self, command: RecordUnsavedReport, context: Context) -> None:
        job = self.queries.query(HelperJob).find(command.job_id)
        failures = job.handover_failures + 1
        if failures < 2:
            self.repository.save(job.changed(handover_failures=failures), context)
            return
        self.repository.save(job.changed(handover_failures=failures, handover_state=HandoverState.CAPTURE_FAILED, failed_text=command.text), context)
        helper = self.agents.find(job.helper_id) if job.helper_id is not None else None
        if helper is not None and helper.parent_id is not None:
            self.nudger.send(helper.parent_id, KeptReportNudge.declared(), REPORT_SOURCE, context, helper=helper.number, job=job.id)
