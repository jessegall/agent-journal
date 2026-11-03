import pytest

from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.program_hooks import ProgramHooks
from tests.stories.core.support.fixtures import MainEnvironment


@pytest.mark.parametrize("program,name", [("claude", ".claude/settings.json"), ("codex", ".codex/hooks.json")])
def test_program_manage_imports_the_selected_programs_hooks_into_the_project_store(new_story, program, name):
    story = new_story(fixture=MainEnvironment)
    folder = story.home.project_folder / "project with spaces"
    ProgramHooks.store(folder / name, {"permissions": {"allow": ["read"]}, "hooks": {
        "PreToolUse": [{"matcher": "Bash", "hooks": [{"type": "command", "command": "project-check", "timeout": 60}]}]}})
    story.expect_text(f'program manage {program} "{folder}"', "managed hooks: 1")
    hooks = story.container.get(ManagedHooks).all()
    assert len(hooks) == 1 and hooks[0].program == program and hooks[0].command == "project-check"
    assert hooks[0].source == f"project with spaces/{name}"
    assert ProgramHooks.read(folder / name) == {"permissions": {"allow": ["read"]}, "hooks": {}}
    story.expect_text(f'program manage {program} "{folder}"', "managed hooks: 1")


def test_program_manage_refuses_an_unknown_program(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_refusal(f'program manage unknown "{story.home.project_folder}"', "unknown")
