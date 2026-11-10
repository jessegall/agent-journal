import pytest

from engine.provider.managed_hooks import ManagedHooks
from engine.provider.hook_effect import HookEffect
from engine.provider.program_hooks import ProgramHooks
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_absent_exists_managed_hooks, expect_answers, expect_command_hooks, expect_program_hooks, expect_program_hooks_2, expect_value_3


@pytest.mark.parametrize("program,name", [("claude", ".claude/settings.json"), ("codex", ".codex/hooks.json")])
def test_session_start_imports_a_hook_added_after_launch(new_story, program, name):
    story = new_story(fixture=MainEnvironment)
    folder = story.home.project_folder / "project with spaces"
    story.expect_text(f'program manage {program} "{folder}"', "managed hooks: 0")
    ProgramHooks.store(folder / name, {"hooks": {
        "PreToolUse": [{"matcher": "Bash", "hooks": [{"type": "command", "command": "added-check"}]}]}})
    sample = HookSamples.session_start().with_fields(program=program).with_raw({"cwd": str(folder)})
    story.hook("s-1", sample)
    expect_changed_program_hooks(folder, name, {"hooks": {}})
    story.run_listeners()
    hooks = story.container.get(ManagedHooks).all()
    expect_answers(hooks, 1)
    expect_command_hooks(hooks, "added-check")
    expect_program_hooks_2(hooks, program)
    expect_effects_hooks_with(hooks, HookEffect.OVERLAPS)
    expect_program_hooks(folder, name, {"hooks": {}})


def test_session_start_with_no_project_hooks_creates_no_managed_files(new_story):
    story = new_story(fixture=MainEnvironment)
    sample = HookSamples.session_start().with_raw({"cwd": str(story.home.project_folder)})
    story.hook("s-1", sample)
    expect_value_3(story, [])
    expect_absent_exists_managed_hooks(story)
    expect_absent_exists_with_suffix(story, ".lock")
    expect_absent_exists_project_folder(story, ".claude/settings.json")
    expect_absent_exists_project_folder(story, ".codex/hooks.json")


def expect_absent_exists_project_folder(story, text) -> None:
    actual = (story.home.project_folder / text).exists()
    assert not actual, actual


def expect_absent_exists_with_suffix(story, text) -> None:
    actual = story.home.managed_hooks_file.with_suffix(text).exists()
    assert not actual, actual


def expect_effects_hooks_with(hooks, expected) -> None:
    actual = hooks[0].effects
    assert expected in actual, actual


def expect_changed_program_hooks(folder, name, expected) -> None:
    actual = ProgramHooks.read(folder / name)
    assert actual != expected, actual
