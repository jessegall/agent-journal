import pytest

from engine.change.event_log import EventLog
from engine.provider.managed_hooks import ManagedHooks
from engine.enums.managed_state import ManagedState
from engine.provider.program_hooks import ProgramHooks
from tests.stories.core.support.fixtures import MainEnvironment
from engine.testing.expectations.expect_row import expect_row
from tests.stories.support.story_checks import expect_absent_exists_managed_hooks


@pytest.fixture
def imported_story(new_story):
    story = new_story(fixture=MainEnvironment)
    ProgramHooks.store(story.home.project_folder / ".claude/settings.json", {"hooks": {
        "PreToolUse": [{"hooks": [{"type": "command", "command": "project-check"}]}]}})
    story.expect_text(f'program manage claude "{story.home.project_folder}"', "managed hooks: 1")
    return story


def test_a_managed_hook_state_and_timeout_are_saved_and_raise_a_change_event(imported_story):
    story = imported_story
    hook = story.container.get(ManagedHooks).all()[0]
    events = story.container.get(EventLog)
    start = events.newest_id()
    story.expect_text(f'managed-hook set "{hook.id}" off 17', "off", "17")
    saved = story.container.get(ManagedHooks).all()[0]
    expect_row(saved, state=ManagedState.DISABLED)
    expect_row(saved, timeout=17)
    expect_recent_events("managed-hook.changed", events, start)


@pytest.mark.parametrize("timeout", [0, -1])
def test_a_nonpositive_hook_timeout_is_refused_without_changing_the_file(imported_story, timeout):
    story = imported_story
    hook = story.container.get(ManagedHooks).all()[0]
    original = story.home.managed_hooks_file.read_bytes()
    story.expect_refusal(f'managed-hook set "{hook.id}" on {timeout}', "at least 1")
    expect_bytes_managed_hooks(story, original)


def test_an_unknown_managed_hook_is_refused(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_refusal('managed-hook set "unknown-hook" off 20', "unknown")
    expect_absent_exists_managed_hooks(story)


def expect_bytes_managed_hooks(story, expected) -> None:
    actual = story.home.managed_hooks_file.read_bytes()
    assert actual == expected, actual


def expect_recent_events(text, events, start) -> None:
    actual = any((event.event == text for event in events.events_after(start)))
    assert actual, actual
