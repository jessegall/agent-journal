import pytest

from core.base.change.event_pattern import EventPattern, EventPatternError


def test_a_name_matches_only_itself():
    assert EventPattern("task.start").matches("task.start")
    assert not EventPattern("task.start").matches("task.cancel")


def test_a_star_stands_for_any_one_part():
    assert EventPattern("task.*").matches("task.update")
    assert EventPattern("*.delete").matches("plan.delete")
    assert not EventPattern("*.delete").matches("plan.cancel")


def test_a_star_alone_matches_every_event():
    assert EventPattern("*").matches("task_dependency.create")


def test_a_pattern_with_the_wrong_number_of_parts_is_refused():
    for text in ("task", "task.start.now", "task.", ".start"):
        with pytest.raises(EventPatternError):
            EventPattern(text)
