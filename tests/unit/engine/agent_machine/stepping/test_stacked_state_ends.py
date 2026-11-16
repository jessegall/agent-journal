from dataclasses import replace
from datetime import datetime, timezone

from engine.agent_stack.stacked_state import StackedState
from engine.agent_stack.state_key import StateKey
from engine.agent_stack.open_block import OpenBlock
from engine.agent_stack.reason import Reason
from engine.agent_stack.states.blocked import Blocked
from engine.agent_stack.states.paused import Paused
from engine.agent_stack.row_reference import RowReference
from engine.agent_machine.stepping.refusal_counting import PROGRESS_ENDS
from engine.agent_machine.stepping.stack_builder import StackBuilder
from engine.enums.condition_outcome import ConditionOutcome
from engine.enums.decision_class import DecisionClass
from engine.enums.state_end import StateEnd
from engine.enums.work_stop import WorkStop
from engine.testing.agent_machine.view_samples import ViewSamples

ENTERED = datetime(2026, 10, 31, 9, 0, tzinfo=timezone.utc)
HOLD = StackedState(Blocked(OpenBlock("messages.unread", 3, Reason("messages.unread", DecisionClass.HOLD, "messages.unread", "read your messages"), True, True, True, True, False)),
             StateKey("Blocked", None, "messages.unread"), ENTERED)


def end(stacked_state: StackedState, **outcomes: ConditionOutcome) -> StateEnd | None:
    view = replace(ViewSamples.view("main", WorkStop.REFUSE_DURING_WORK), block_outcomes={3: outcome for outcome in outcomes.values()})
    return StackBuilder.stacked_state_end(view, stacked_state)


def test_a_satisfied_hold_ends_as_progress_and_a_cancelled_or_waived_one_does_not():
    assert end(HOLD, block=ConditionOutcome.SATISFIED) in PROGRESS_ENDS
    assert end(HOLD, block=ConditionOutcome.CANCELLED) not in PROGRESS_ENDS
    assert end(HOLD) not in PROGRESS_ENDS


def test_a_resume_ends_no_work():
    assert end(StackedState(Paused((), "paused"), StateKey("Paused", None, "pause"), ENTERED)) is None


def test_a_stacked_state_whose_source_told_its_end_records_that_end():
    work = StackedState(Paused((), "paused"), StateKey("Working", RowReference("task", 3), "task:3"), ENTERED)
    view = replace(ViewSamples.view("main", WorkStop.REFUSE_DURING_WORK), subject_ends={RowReference("task", 3): StateEnd.CANCELLED})
    assert StackBuilder.stacked_state_end(view, work) is StateEnd.CANCELLED and StateEnd.CANCELLED not in PROGRESS_ENDS


def test_a_stacked_state_a_person_removed_ends_waived_which_is_no_progress():
    work = StackedState(Paused((), "paused"), StateKey("Working", None, "task:4"), ENTERED)
    view = replace(ViewSamples.view("main", WorkStop.REFUSE_DURING_WORK), suppressions=(work.state_key,))
    assert StackBuilder.stacked_state_end(view, work) is StateEnd.WAIVED and StateEnd.WAIVED not in PROGRESS_ENDS
