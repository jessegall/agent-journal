import pytest

from core.base.deadline import Deadline, DeadlinePassedError


def test_no_deadline_never_passes_and_has_no_time_left():
    deadline = Deadline()
    deadline.check()
    assert deadline.remaining_seconds() is None


def test_a_deadline_that_passed_refuses_the_commit_and_has_nothing_left():
    deadline = Deadline.timeout(0)
    assert deadline.remaining_seconds() == 0
    with pytest.raises(DeadlinePassedError):
        deadline.check()


def test_a_deadline_ahead_lets_the_commit_through():
    deadline = Deadline.timeout(60)
    deadline.check()
    remaining = deadline.remaining_seconds()
    assert remaining is not None and 0 < remaining <= 60
