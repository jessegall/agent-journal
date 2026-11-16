from datetime import UTC, datetime

from engine.agent_stack.escalation import Escalation
from engine.agent_stack.stacked_state import StackedState
from engine.agent_stack.state_key import StateKey
from engine.agent_stack.open_block import OpenBlock
from engine.agent_stack.reason import Reason
from engine.agent_stack.stack import Stack
from engine.agent_stack.states.blocked import Blocked
from engine.agent_stack.states.compacting import Compacting
from engine.agent_stack.states.pause_cause import PauseCause
from engine.agent_stack.states.paused import Paused
from engine.agent_stack.states.state import State
from engine.agent_stack.states.stopped import Stopped
from engine.agent_stack.states.waiting import Waiting
from engine.agent_stack.states.working import Working
from engine.agent_stack.work_reference import WorkReference
from engine.enums.decision_class import DecisionClass
from engine.enums.escalation_type import EscalationType
from engine.enums.responder import Responder
from engine.enums.stop_answer_type import StopAnswerType
from engine.enums.wait_mode import WaitMode
from engine.enums.work_stop import WorkStop
from engine.enums.work_type import WorkType

STARTED_AT = datetime(2026, 11, 15, tzinfo=UTC)
TASK_REFUSAL = Reason("tasks.stop", DecisionClass.HOLD, "tasks.started", "task 6 is started")
MESSAGES_REFUSAL = Reason("messages.unread-at-stop", DecisionClass.HOLD, "messages.unread", "read message 7")


def stacked_state(state: State, name: str) -> StackedState:
    return StackedState(state, StateKey(name, None, "1"), STARTED_AT)


def stack(*states: State) -> Stack:
    return Stack([stacked_state(Stopped(STARTED_AT, "started", True), "stopped"), *(stacked_state(state, type(state).__name__) for state in states)])


def working(work_type: WorkType, work_remains: bool) -> Working:
    return Working(WorkReference(work_type, 6, "task 6"), work_remains, TASK_REFUSAL)


def message_hold() -> Blocked:
    return Blocked(OpenBlock("messages.unread", 3, MESSAGES_REFUSAL, True, True, False, True, False))


def test_an_empty_work_lane_lets_the_stop_through() -> None:
    assert stack().stop_answer(WorkStop.REFUSE_WHILE_WORK_REMAINS, None).answer_type is StopAnswerType.ALLOWED


def test_a_started_task_refuses_the_stop_of_a_main_agent() -> None:
    answer = stack(working(WorkType.TASK, True)).stop_answer(WorkStop.REFUSE_WHILE_WORK_REMAINS, None)
    assert (answer.answer_type, answer.refusal_reasons()) == (StopAnswerType.REFUSED, (TASK_REFUSAL,))


def test_a_helper_stop_on_its_open_job_is_the_handover() -> None:
    answer = stack(working(WorkType.JOB, True)).stop_answer(WorkStop.HANDOVER, None)
    assert (answer.answer_type, answer.work) == (StopAnswerType.HANDOVER, WorkReference(WorkType.JOB, 6, "task 6"))


def test_a_running_sequence_on_a_helper_refuses_its_stop() -> None:
    assert stack(working(WorkType.SEQUENCE, True)).stop_answer(WorkStop.HANDOVER, None).answer_type is StopAnswerType.REFUSED


def test_a_wait_on_top_of_the_work_lets_the_stop_through_and_hands_in_nothing() -> None:
    waiting = Waiting((), WaitMode.ANY, True, "waits on question 2")
    assert stack(working(WorkType.JOB, True), waiting).stop_answer(WorkStop.HANDOVER, None).answer_type is StopAnswerType.ALLOWED


def test_every_hold_with_a_stop_scope_refuses_before_the_work_answer() -> None:
    answer = stack(working(WorkType.TASK, False), message_hold()).stop_answer(WorkStop.REFUSE_WHILE_WORK_REMAINS, None)
    assert answer.refusal_reasons() == (MESSAGES_REFUSAL,)


def test_an_open_escalation_defers_the_stop_scope_of_its_holds() -> None:
    escalation = Escalation(9, EscalationType.STOPS, Responder.PARENT, (3,), (), 5)
    assert stack(message_hold()).stop_answer(WorkStop.REFUSE_WHILE_WORK_REMAINS, escalation).answer_type is StopAnswerType.ALLOWED


def test_paused_rests_whatever_else_refuses() -> None:
    paused = Paused((PauseCause(1, 4, STARTED_AT),), "The user paused you")
    answer = stack(working(WorkType.TASK, True), message_hold(), paused).stop_answer(WorkStop.REFUSE_WHILE_WORK_REMAINS, None)
    assert answer.answer_type is StopAnswerType.SAFETY_REST


def test_compacting_answers_the_stop_itself() -> None:
    compacting = Compacting(2, "context limit", 1, False)
    answer = stack(working(WorkType.TASK, True), compacting).stop_answer(WorkStop.REFUSE_WHILE_WORK_REMAINS, None)
    assert answer.answer_type is StopAnswerType.COMPACTION_HANDOFF
