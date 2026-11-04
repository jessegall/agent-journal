import pytest

from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.program_hooks import ProgramHooks
from tests.stories.core.support.fixtures import MainEnvironment
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_answers, expect_command_hooks, expect_program_hooks, expect_program_hooks_2


@pytest.mark.parametrize("program,name", [("claude", ".claude/settings.json"), ("codex", ".codex/hooks.json")])
def test_program_manage_imports_the_selected_programs_hooks_into_the_project_store(new_story, program, name):
    story = new_story(fixture=MainEnvironment)
    folder = story.home.project_folder / "project with spaces"
    ProgramHooks.store(folder / name, {"permissions": {"allow": ["read"]}, "hooks": {
        "PreToolUse": [{"matcher": "Bash", "hooks": [{"type": "command", "command": "project-check", "timeout": 60}]}]}})
    story.expect_text(f'program manage {program} "{folder}"', "managed hooks: 1")
    hooks = story.container.get(ManagedHooks).all()
    expect_answers(hooks, 1)
    expect_program_hooks_2(hooks, program)
    expect_command_hooks(hooks, "project-check")
    expect_row(hooks[0], source=f"project with spaces/{name}")
    expect_program_hooks(folder, name, {"permissions": {"allow": ["read"]}, "hooks": {}})
    story.expect_text(f'program manage {program} "{folder}"', "managed hooks: 1")


def test_program_manage_refuses_an_unknown_program(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_refusal(f'program manage unknown "{story.home.project_folder}"', "unknown")
