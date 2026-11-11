from dataclasses import replace
from datetime import datetime, timedelta, timezone

from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.ask_deadline import AskDeadline

ASKED = datetime(2026, 3, 1, 9, 0, tzinfo=timezone.utc)
VISITS_LIMIT = 2


def minutes_later(minutes: int) -> Timestamp:
    return Timestamp(ASKED + timedelta(minutes=minutes))


QUESTION = MergerLine(text="worker 4 asks", fallback_source="workers.ask", worker_id=4, due_at=minutes_later(10), forward_at=minutes_later(30))


def deadline(line: MergerLine = QUESTION, visits_limit: int = VISITS_LIMIT) -> AskDeadline:
    return AskDeadline.from_line(line, visits_limit)


def test_a_question_is_not_overdue_before_its_due_time():
    assert not deadline().is_answer_overdue(minutes_later(9))
    assert not deadline().is_forward_due(minutes_later(9))


def test_a_question_is_overdue_from_its_due_time_and_not_yet_forwarded():
    assert deadline().is_answer_overdue(minutes_later(10))
    assert not deadline().is_forward_due(minutes_later(29))


def test_a_question_is_forwarded_at_its_forward_time():
    assert deadline().is_forward_due(minutes_later(30))


def test_a_question_is_forwarded_once_the_merger_read_it_as_often_as_the_limit():
    assert not deadline(replace(QUESTION, visit_count=1)).is_forward_due(minutes_later(1))
    assert deadline(replace(QUESTION, visit_count=2)).is_forward_due(minutes_later(1))


def test_a_closed_question_is_never_overdue_and_never_forwarded():
    closed = deadline(replace(QUESTION, outcome=AskOutcome.ANSWERED, closed_at=minutes_later(5), visit_count=5))
    assert not closed.is_answer_overdue(minutes_later(60))
    assert not closed.is_forward_due(minutes_later(60))


def test_the_times_are_the_stored_ones_whatever_the_limit_given_later():
    assert deadline(visits_limit=9).due_at == minutes_later(10)
    assert deadline(visits_limit=9).forward_at == minutes_later(30)
    assert not deadline(visits_limit=9).is_forward_due(minutes_later(29))


def test_a_line_with_no_stored_times_is_only_forwarded_by_its_readings():
    untimed = replace(QUESTION, due_at=None, forward_at=None)
    assert not deadline(untimed).is_answer_overdue(minutes_later(600))
    assert not deadline(untimed).is_forward_due(minutes_later(600))
    assert deadline(replace(untimed, visit_count=2)).is_forward_due(minutes_later(0))
