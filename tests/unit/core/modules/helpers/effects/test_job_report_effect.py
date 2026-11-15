from dataclasses import replace

from engine.agent_machine.needs.need import Need
from engine.agent_stack.escalation import Escalation
from engine.agent_stack.need_key import NeedKey
from engine.agent_stack.reason import Reason
from engine.agent_stack.states.working import Working
from engine.agent_stack.work_reference import WorkReference
from engine.enums.decision_class import DecisionClass
from engine.enums.escalation_type import EscalationType
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop
from engine.enums.work_type import WorkType
from engine.testing.agent_machine.view_samples import ViewSamples
from core.modules.helpers.effects.job_report_effect import JobReportEffect

JOB_KEY = NeedKey("Working", None, "job:5")
JOB = Need(Working(WorkReference(WorkType.JOB, 5, "job 5"), True, Reason("helpers.job-open", DecisionClass.HOLD, "", "job 5 is open")), "", JOB_KEY)


def test_a_stop_that_rests_through_an_escalation_hands_nothing_in():
    view = replace(ViewSamples.view("helper", WorkStop.HANDOVER), needs=tuple([JOB]))
    escalated = replace(view, escalation=Escalation(1, EscalationType.STOPS, Responder.PARENT, (), tuple([JOB_KEY]), 5))
    assert JobReportEffect.is_report_stop(view) and not JobReportEffect.is_report_stop(escalated)
