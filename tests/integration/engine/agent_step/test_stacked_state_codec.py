import pytest

from engine.agent_stack.open_block import OpenBlock
from engine.agent_stack.reason import Reason
from engine.agent_stack.states.blocked import Blocked
from engine.agent_stack.states.waiting import Waiting
from engine.agent_stack.states.working import Working
from engine.agent_stack.row_reference import RowReference
from engine.agent_stack.work_reference import WorkReference
from engine.agent_step.stack_codec import StackCodec
from engine.enums.decision_class import DecisionClass
from engine.enums.wait_mode import WaitMode
from engine.enums.work_type import WorkType
from engine.testing.agent_machine.stack_samples import StackSamples

REASON = Reason("documents.open", DecisionClass.BLOCK, "documents.open", "close document 41", ("journal doc close 41",), RowReference("document", 41))


def test_every_state_and_its_nested_values_come_back_as_they_were_stored() -> None:
    stack = StackSamples.built(Working(WorkReference(WorkType.TASK, 6, "task 6"), True, REASON),
                               Waiting((RowReference("question", 2),), WaitMode.ALL, False, "question 2"),
                               Blocked(OpenBlock("documents.open", 3, REASON, True, True, False, True, False, RowReference("document", 41))))
    assert StackCodec.decoded(StackCodec.encoded(stack.stacked_states)) == list(stack.stacked_states)


def test_a_state_the_code_no_longer_knows_raises_so_the_step_reseeds() -> None:
    with pytest.raises(KeyError):
        StackCodec.decoded('[{"state_name": "Dreaming", "state": {}, "state_key": {}, "entered_at": "2026-11-15T00:00:00+00:00"}]')
