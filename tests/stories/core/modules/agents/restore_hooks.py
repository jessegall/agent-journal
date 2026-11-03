import pytest

from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.program_hooks import ProgramHooks
from tests.stories.core.support.fixtures import MainEnvironment


@pytest.mark.parametrize("program,name", [("claude", ".claude/settings.json"), ("codex", ".codex/hooks.json")])
def test_give_back_restores_project_hooks_and_empties_the_store(new_story, program, name):
    story = new_story(fixture=MainEnvironment)
    path = story.home.project_folder / name
    ProgramHooks.store(path, {"permissions": {"allow": ["read"]}, "hooks": {
        "PreToolUse": [{"matcher": "Bash", "hooks": [{"type": "command", "command": "project-check", "timeout": 30}]}]}})
    story.expect_text(f'program manage {program} "{story.home.project_folder}"', "managed hooks: 1")
    story.expect_text("hooks give-back", "restored hooks: 1")
    assert story.container.get(ManagedHooks).all() == []
    assert ProgramHooks.read(path) == {"permissions": {"allow": ["read"]}, "hooks": {
        "PreToolUse": [{"matcher": "Bash", "hooks": [{"type": "command", "command": "project-check", "timeout": 30}]}]}}
    story.expect_text("hooks give-back", "restored hooks: 0")
