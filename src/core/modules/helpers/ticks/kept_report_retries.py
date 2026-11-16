from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.setting.setting_values import SettingValues
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.enums.job_report_state import JobReportState
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.drivers.support.driver_settings import REPORT_RETRIES_SETTING
from core.modules.helpers.commands.record_unsaved_report.record_unsaved_report import RecordUnsavedReport
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport

KEPT_REPORTS_REASON = "the jobs whose report could not be saved are a few at a time"
# two failed saves at the stop, then the handover-retries setting's tries from the kept text
STOP_SAVE_FAILURES = 2


class KeptReportRetries:
    """Each minute, saves each kept report again from its text, never from the helper's later words, as many
    times as handover-retries says (doc 1310 section 4.9); one that saves closes its job, and the parent gets
    the report once."""

    def __call__(self, container: Container) -> None:
        tries = container.get(SettingValues).number(REPORT_RETRIES_SETTING)
        jobs = container.get(Queries).query(HelperJob).every_environment(KEPT_REPORTS_REASON).filter(report_state=JobReportState.CAPTURE_FAILED, ended_at=None).every_row(KEPT_REPORTS_REASON)
        for job in jobs:
            if job.helper_id is None or job.report_failures >= STOP_SAVE_FAILURES + tries:
                continue
            helper = container.get(AgentRows).find_unscoped(job.helper_id)
            if helper.parent_id is None:
                continue
            try:
                container.get(Bus).run(RecordParentReport(helper.id, helper.parent_id, job.failed_text, job.id), Actor.core(), environment_id=job.environment_id)
            # a try that fails is counted, and the next minute tries again
            except Refusal:
                container.get(Bus).run(RecordUnsavedReport(job.id, job.failed_text), Actor.core(), environment_id=job.environment_id)
