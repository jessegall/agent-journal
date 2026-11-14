import pytest

from engine.database.errors.wait_in_write_turn_error import WaitInWriteTurnError
from engine.database.never_waiting_write_turns import NeverWaitingWriteTurns
from engine.time.clock import Clock
from engine.time.polled_wait import PolledWait


def test_a_poll_whose_condition_holds_passes_inside_a_write_turn():
    with NeverWaitingWriteTurns().write_turn():
        assert Clock().poll(lambda: True, 1, 0.01) and PolledWait(1, 0.01).poll(lambda: True)


def test_a_poll_that_would_pause_inside_a_write_turn_is_refused():
    with NeverWaitingWriteTurns().write_turn(), pytest.raises(WaitInWriteTurnError):
        Clock().poll(lambda: False, 1, 0.01)
    with NeverWaitingWriteTurns().write_turn(), pytest.raises(WaitInWriteTurnError):
        PolledWait(1, 0.01).poll(lambda: False)
