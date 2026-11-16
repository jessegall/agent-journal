import pytest

from engine.database.errors.wait_during_write_turn_error import WaitDuringWriteTurnError
from engine.database.never_waiting_write_turns import NeverWaitingWriteTurns
from engine.execution.thread_turn_count import THREAD_TURN_COUNT


def test_a_wait_inside_a_held_write_turn_is_refused_and_named():
    turns = NeverWaitingWriteTurns()
    with turns.write_turn(), pytest.raises(WaitDuringWriteTurnError, match="the wait for test run 7"):
        THREAD_TURN_COUNT.refuse_wait("the wait for test run 7")


def test_a_wait_outside_the_write_turn_goes_on():
    THREAD_TURN_COUNT.refuse_wait("the wait for test run 7")
