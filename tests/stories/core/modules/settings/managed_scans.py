import pytest

from core.base.change.event_log import EventLog
from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.program_hooks import ProgramHooks
from tests.stories.core.support.fixtures import MainEnvironment


@pytest.fixture
def project_story(new_story):
    story = new_story(fixture=MainEnvironment)
    for name in (".claude/settings.json", ".codex/hooks.json"):
        ProgramHooks.store(story.home.project_folder / name, {"hooks": {
            "PreToolUse": [{"matcher": "Bash", "hooks": [{"type": "command", "command": "project-check"}]}]}})
    return story


def test_scan_imports_every_program_and_finds_new_hooks(project_story):
    story = project_story
    story.expect_text("managed-hook scan", "managed hooks: 2")
    path = story.home.project_folder / ".claude/settings.json"
    ProgramHooks.store(path, {"hooks": {"Stop": [{"hooks": [{"type": "command", "command": "added-check"}]}]}})
    story.expect_text("managed-hook scan", "managed hooks: 3")
    assert {hook.command for hook in story.container.get(ManagedHooks).all()} == {"project-check", "added-check"}
    assert ProgramHooks.read(path) == {"hooks": {}}


def test_give_back_restores_disabled_hooks_and_records_both_actions(project_story):
    story = project_story
    events = story.container.get(EventLog)
    start = events.newest_id()
    story.expect_text("managed-hook scan", "managed hooks: 2")
    hook = story.container.get(ManagedHooks).all()[0]
    story.expect_text(f'managed-hook set "{hook.id}" off 45', "off")
    story.expect_text("managed-hook give-back", "restored hooks: 2", "off until the next scan")
    assert story.container.get(ManagedHooks).all() == []
    for name in (".claude/settings.json", ".codex/hooks.json"):
        entries = ProgramHooks.partitioned(ProgramHooks.read(story.home.project_folder / name)["hooks"])[1]
        assert len(entries) == 1 and entries[0][2]["command"] == "project-check"
    names = {event.event for event in events.events_past(start)}
    assert {"managed-hook.scanned", "managed-hook.restored"} <= names
