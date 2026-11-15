from collections.abc import Sequence
from typing import ClassVar

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.decision_record import DecisionRecord
from engine.agent_stack.states.compacting import Compacting
from engine.agent_stack.states.paused import Paused
from engine.agent_stack.states.waiting import Waiting
from engine.agent_stack.states.working import Working
from engine.command.command import Command
from engine.driver.rule_answer import RuleAnswer
from engine.enums.effect_timing import EffectTiming
from engine.enums.hook_event_name import HookEventName
from engine.enums.work_stop import WorkStop
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.helpers.commands.record_unsaved_report.record_unsaved_report import RecordUnsavedReport
from core.modules.helpers.needs.job_work_needs import HELPER_TYPE
from core.modules.helpers.nudges.unsaved_report_nudge import UnsavedReportNudge
from core.modules.helpers.support.helper_report_text import HelperReportText
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport

REPORT_RULE = "helpers.report"


class JobReportEffect(Effect):
    """The hand-in (doc 1310 section 4.9): the allowed, decided stop of a hand-in helper whose work lane holds its
    open job, with nothing waiting above it and neither Paused nor Compacting, saves its report with the stop,
    in the stop's own write, as today's helpers.report does."""

    events = tuple([HookEventName.STOP])
    agent_types = [HELPER_TYPE]
    # the work stop under which this type's allowed stop hands its job in
    report_contract: ClassVar[WorkStop] = WorkStop.HANDOVER
    replaced_rules = tuple([REPORT_RULE])
    timing = EffectTiming.ON_ADMISSION
    is_required = True
    completes_work = True
    failure = UnsavedReportNudge

    def __init__(self, agents: AgentRows, report_text: HelperReportText, jobs: HelperJobRows) -> None:
        self.agents, self.report_text, self.jobs = agents, report_text, jobs

    def commands(self, view: AgentView, record: DecisionRecord) -> Sequence[Command[object]]:
        event = record.action.event
        jobs = [need.state.work for need in view.needs if isinstance(need.state, Working) and need.state.work.is_job()]
        if event is None or not jobs or view.work_stop is not self.report_contract or not self.is_report_stop(view):
            return []
        helper = self.agents.find(view.agent.agent_id)
        if helper.parent_id is None:
            return []
        return [RecordParentReport(helper.id, helper.parent_id, self.report_text.text(event, helper), jobs[-1].work_id)]

    # a stop that rests because an escalation defers the job's work hands nothing in (doc 1310 section 4.9)
    @staticmethod
    def is_report_stop(view: AgentView) -> bool:
        waits = any(isinstance(need.state, Waiting) for need in view.needs)
        deferred = view.escalation is not None and any(view.escalation.defers_work(need.key) for need in view.needs if isinstance(need.state, Working))
        return not waits and not deferred and not view.stack.has(Paused) and not view.stack.has(Compacting)

    # the first failed save refuses the stop once; the second keeps the text and lets the helper rest
    def failed(self, view: AgentView, record: DecisionRecord) -> RuleAnswer:
        event, job = record.action.event, self.jobs.open_job(view.agent.agent_id)
        helper = self.agents.find(view.agent.agent_id)
        if event is None or job is None:
            return RuleAnswer(refusal=UnsavedReportNudge.declared().nudge().text)
        keep = RecordUnsavedReport(job.id, self.report_text.text(event, helper))
        if job.handover_failures == 0:
            return RuleAnswer(refusal=UnsavedReportNudge.declared().nudge().text, commands=tuple([keep]))
        return RuleAnswer(commands=tuple([keep]))
