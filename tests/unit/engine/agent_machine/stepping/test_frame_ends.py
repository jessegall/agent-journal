from dataclasses import replace
from datetime import datetime, timezone

from engine.agent_stack.frame import Frame
from engine.agent_stack.need_key import NeedKey
from engine.agent_stack.open_block import OpenBlock
from engine.agent_stack.reason import Reason
from engine.agent_stack.states.blocked import Blocked
from engine.agent_stack.states.paused import Paused
from engine.agent_stack.subject_reference import SubjectReference
from engine.agent_machine.stepping.refusal_counting import PROGRESS_ENDS
from engine.agent_machine.stepping.stack_builder import StackBuilder
from engine.enums.condition_outcome import ConditionOutcome
from engine.enums.decision_class import DecisionClass
from engine.enums.frame_end import FrameEnd
from engine.enums.work_stop import WorkStop
from engine.testing.agent_machine.view_samples import ViewSamples

ENTERED = datetime(2026, 10, 31, 9, 0, tzinfo=timezone.utc)
HOLD = Frame(Blocked(OpenBlock("messages.unread", 3, Reason("messages.unread", DecisionClass.HOLD, "messages.unread", "read your messages"), True, True, True, True, False)),
             NeedKey("Blocked", None, "messages.unread"), ENTERED)


def end(frame: Frame, **outcomes: ConditionOutcome) -> FrameEnd | None:
    view = replace(ViewSamples.view("main", WorkStop.REFUSE_WHILE_WORK_REMAINS), block_outcomes={3: outcome for outcome in outcomes.values()})
    return StackBuilder.frame_end(view, frame)


def test_a_satisfied_hold_ends_as_progress_and_a_cancelled_or_waived_one_does_not():
    assert end(HOLD, block=ConditionOutcome.SATISFIED) in PROGRESS_ENDS
    assert end(HOLD, block=ConditionOutcome.CANCELLED) not in PROGRESS_ENDS
    assert end(HOLD) not in PROGRESS_ENDS


def test_a_resume_ends_no_work():
    assert end(Frame(Paused((), "paused"), NeedKey("Paused", None, "pause"), ENTERED)) is None


def test_a_frame_whose_source_told_its_end_records_that_end():
    work = Frame(Paused((), "paused"), NeedKey("Working", SubjectReference("task", 3), "task:3"), ENTERED)
    view = replace(ViewSamples.view("main", WorkStop.REFUSE_WHILE_WORK_REMAINS), subject_ends={SubjectReference("task", 3): FrameEnd.CANCELLED})
    assert StackBuilder.frame_end(view, work) is FrameEnd.CANCELLED and FrameEnd.CANCELLED not in PROGRESS_ENDS
