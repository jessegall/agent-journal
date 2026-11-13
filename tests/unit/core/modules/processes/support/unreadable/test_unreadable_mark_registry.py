import pytest

from engine.errors.refusal import Refusal
from core.modules.processes.support.unreadable.unreadable_mark_registry import UnreadableMarkRegistry


def test_an_agents_reason_of_three_words_or_more_is_kept():
    assert UnreadableMarkRegistry.checked_note("  prints only a progress bar ") == "prints only a progress bar"


@pytest.mark.parametrize("note", ["", "   ", "progress bar"])
def test_an_empty_reason_and_a_reason_of_two_words_are_refused_with_how_to_say_it(note):
    with pytest.raises(Refusal) as refused:
        UnreadableMarkRegistry.checked_note(note)
    assert "at least three words" in refused.value.reason and "--note" in refused.value.suggestion


@pytest.mark.parametrize(("command", "covered"), [("pytest", True), ("pytest tests/a", True), ("pytest  tests/a -q", True), ("npm test", False), ("pytestx run", False)])
def test_a_mark_covers_a_command_by_its_leading_words(command, covered):
    assert UnreadableMarkRegistry.covers("pytest", command) is covered


def test_a_mark_of_two_words_covers_only_commands_that_open_with_both():
    assert UnreadableMarkRegistry.covers("npm run", "npm run build") and not UnreadableMarkRegistry.covers("npm run", "npm test")
