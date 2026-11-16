from collections.abc import Sequence

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.decision_record import DecisionRecord
from engine.command.command import Command
from engine.enums.effect_timing import EffectTiming
from engine.query.queries import Queries
from engine.setting.setting_values import SettingValues
from core.modules.drivers.models.enums.job_report_state import JobReportState
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.drivers.support.driver_settings import REPORT_RETRIES_SETTING
from core.modules.helpers.commands.retry_hand_in.retry_hand_in import RetryHandIn

FAILED_HAND_INS_REASON = "the jobs of one agent's helpers whose report could not be saved, a few at a time"
STOP_SAVE_FAILURES = 2


class HandInRetryEffect(Effect):
    """At its minute step, an agent's helpers whose hand-in could not be saved try it again from the kept text, as
    many times as handover-retries says (doc 1310 sections 4.9 and 6.2); one that saves closes its job, and the agent
    gets the report once."""

    events = ()
    includes_steps = True
    timing = EffectTiming.UNCONDITIONAL

    def __init__(self, queries: Queries, settings: SettingValues) -> None:
        self.queries, self.settings = queries, settings

    def commands(self, view: AgentView, record: DecisionRecord) -> Sequence[Command[object]]:
        if record.action.event is not None:
            return []
        tries = self.settings.number(REPORT_RETRIES_SETTING)
        jobs = self.queries.query(HelperJob).filter(session_agent_id=view.agent.agent_id, report_state=JobReportState.CAPTURE_FAILED, ended_at=None).every_row(FAILED_HAND_INS_REASON)
        return [RetryHandIn(job.helper_id) for job in jobs if job.helper_id is not None and job.report_failures < STOP_SAVE_FAILURES + tries]
