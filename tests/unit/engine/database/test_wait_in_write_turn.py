import pytest

from engine.database.errors.wait_in_write_turn_error import WaitInWriteTurnError
from engine.database.never_waiting_write_turns import NeverWaitingWriteTurns
from engine.execution.held_write_turn import HELD_WRITE_TURN


def test_a_wait_inside_a_held_write_turn_is_refused_and_named():
    turns = NeverWaitingWriteTurns()
    with turns.write_turn(), pytest.raises(WaitInWriteTurnError, match="the wait for test run 7"):
        HELD_WRITE_TURN.refuse_wait("the wait for test run 7")


def test_a_wait_outside_the_write_turn_goes_on():
    HELD_WRITE_TURN.refuse_wait("the wait for test run 7")
