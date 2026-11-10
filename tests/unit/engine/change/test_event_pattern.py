import pytest

from engine.change.event_pattern import EventPattern
from engine.change.event_pattern_error import EventPatternError


def test_a_name_matches_only_itself():
    assert EventPattern("task.start").matches("task.start")
    assert not EventPattern("task.start").matches("task.cancel")


def test_a_star_stands_for_any_one_part():
    assert EventPattern("task.*").matches("task.update")
    assert EventPattern("*.delete").matches("plan.delete")
    assert not EventPattern("*.delete").matches("plan.cancel")


def test_a_star_alone_matches_every_event():
    assert EventPattern("*").matches("task_dependency.create")


def test_patterns_joined_by_a_bar_match_any_of_them():
    pattern = EventPattern("journal.booting|registry.sync|alias.*")
    assert pattern.matches("registry.sync") and pattern.matches("alias.create")
    assert not pattern.matches("task.create")


def test_a_pattern_with_the_wrong_number_of_parts_is_refused():
    for text in ("task", "task.start.now", "task.", ".start"):
        with pytest.raises(EventPatternError):
            EventPattern(text)
