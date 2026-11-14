import pytest

from engine.ticker.due_tick_handlers import DueTickHandlers
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval


def handler(label, seconds, starts_immediately=False):
    return TickHandler(TickInterval(seconds=seconds), lambda container: None, label, starts_immediately=starts_immediately)


def labels(handlers):
    return [tick_handler.label for tick_handler in handlers]


def test_a_handler_is_due_once_its_interval_has_passed_since_the_beginning():
    due = DueTickHandlers([handler("slow", 10)], began_seconds=100.0)
    assert labels(due.start_due(109.0, ())) == [] and labels(due.start_due(110.0, ())) == ["slow"]


def test_a_handler_that_starts_immediately_is_due_at_the_first_tick():
    due = DueTickHandlers([handler("first", 10, starts_immediately=True)], began_seconds=100.0)
    assert labels(due.start_due(100.0, ())) == ["first"]


def test_a_started_handler_is_due_again_only_after_its_interval():
    due = DueTickHandlers([handler("slow", 10, starts_immediately=True)], began_seconds=0.0)
    due.start_due(0.0, ())
    assert labels(due.start_due(9.0, ())) == [] and labels(due.start_due(10.0, ())) == ["slow"]


def test_a_handler_that_still_runs_is_not_started_and_its_start_is_not_noted():
    due = DueTickHandlers([handler("slow", 10, starts_immediately=True), handler("other", 10, starts_immediately=True)], began_seconds=0.0)
    assert labels(due.start_due(0.0, {"slow"})) == ["other"]
    assert labels(due.start_due(1.0, ())) == ["slow"]


def test_two_handlers_with_one_label_are_refused():
    due = DueTickHandlers([handler("same", 1)], began_seconds=0.0)
    with pytest.raises(ValueError, match="same"):
        due.register(handler("same", 2))
