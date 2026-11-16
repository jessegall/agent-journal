from dataclasses import replace

from engine.agent_machine.states.required_state import RequiredState
from engine.agent_stack.escalation import Escalation
from engine.agent_stack.open_block import OpenBlock
from engine.agent_stack.state_key import StateKey
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

JOB_KEY = StateKey("Working", None, "job:5")
JOB = RequiredState(Working(WorkReference(WorkType.JOB, 5, "job 5"), True, Reason("helpers.job-open", DecisionClass.HOLD, "", "job 5 is open")), "", JOB_KEY)


def test_a_stop_that_rests_through_an_escalation_hands_nothing_in():
    view = replace(ViewSamples.view("helper", WorkStop.HANDOVER), states=(JOB,))
    escalated = replace(view, escalation=Escalation(1, EscalationType.STOPS, Responder.PARENT, (), (JOB_KEY,), 5))
    assert JobReportEffect.is_report_stop(view) and not JobReportEffect.is_report_stop(escalated)


def test_a_stop_that_rests_because_an_escalation_defers_a_hold_on_it_hands_nothing_in():
    hold = OpenBlock("documents.open", 3, Reason("documents.open", DecisionClass.HOLD, "documents.open", "close your document"), True, True, True, True, False)
    view = replace(ViewSamples.view("helper", WorkStop.HANDOVER), states=(JOB,), blocks=(hold,),
                   escalation=Escalation(1, EscalationType.STOPS, Responder.PARENT, (3,), (), 5))
    assert not JobReportEffect.is_report_stop(view)


def test_a_stop_under_an_open_escalation_hands_nothing_in_even_when_it_defers_neither_the_job_nor_a_hold():
    view = replace(ViewSamples.view("helper", WorkStop.HANDOVER), states=(JOB,),
                   escalation=Escalation(1, EscalationType.TOOLS, Responder.PARENT, (8,), (), 5))
    assert not JobReportEffect.is_report_stop(view)
