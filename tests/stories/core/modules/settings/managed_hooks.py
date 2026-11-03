import pytest

from core.base.change.event_log import EventLog
from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.managed_state import ManagedState
from core.base.provider.program_hooks import ProgramHooks
from tests.stories.core.support.fixtures import MainEnvironment


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
    assert saved.state is ManagedState.DISABLED and saved.timeout == 17
    assert any(event.event == "managed-hook.changed" for event in events.events_past(start))


@pytest.mark.parametrize("timeout", [0, -1])
def test_a_nonpositive_hook_timeout_is_refused_without_changing_the_file(imported_story, timeout):
    story = imported_story
    hook = story.container.get(ManagedHooks).all()[0]
    original = story.home.managed_hooks_file.read_bytes()
    story.expect_refusal(f'managed-hook set "{hook.id}" on {timeout}', "at least 1")
    assert story.home.managed_hooks_file.read_bytes() == original


def test_an_unknown_managed_hook_is_refused(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_refusal('managed-hook set "unknown-hook" off 20', "unknown")
    assert not story.home.managed_hooks_file.exists()
