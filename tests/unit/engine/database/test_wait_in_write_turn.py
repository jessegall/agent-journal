import pytest

from engine.database.errors.wait_in_write_turn_error import WaitInWriteTurnError
from engine.database.never_waiting_write_turns import NeverWaitingWriteTurns


def test_a_wait_inside_a_held_write_turn_is_refused_and_named():
    turns = NeverWaitingWriteTurns()
    with turns.write_turn(), pytest.raises(WaitInWriteTurnError, match="the wait for test run 7"):
        turns.refuse_wait("the wait for test run 7")


def test_a_wait_outside_the_write_turn_goes_on():
    NeverWaitingWriteTurns().refuse_wait("the wait for test run 7")
