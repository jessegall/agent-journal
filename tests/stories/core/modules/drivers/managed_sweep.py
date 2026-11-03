import pytest

from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.hook_effect import HookEffect
from core.base.provider.program_hooks import ProgramHooks
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.fixtures import MainEnvironment


@pytest.mark.parametrize("program,name", [("claude", ".claude/settings.json"), ("codex", ".codex/hooks.json")])
def test_session_start_imports_a_hook_added_after_launch(new_story, program, name):
    story = new_story(fixture=MainEnvironment)
    folder = story.home.project_folder / "project with spaces"
    story.expect_text(f'program manage {program} "{folder}"', "managed hooks: 0")
    ProgramHooks.store(folder / name, {"hooks": {
        "PreToolUse": [{"matcher": "Bash", "hooks": [{"type": "command", "command": "added-check"}]}]}})
    sample = HookSamples.session_start().with_fields(program=program).with_raw({"cwd": str(folder)})
    story.hook("s-1", sample)
    assert ProgramHooks.read(folder / name) != {"hooks": {}}
    story.run_listeners()
    hooks = story.container.get(ManagedHooks).all()
    assert len(hooks) == 1 and hooks[0].command == "added-check" and hooks[0].program == program
    assert HookEffect.OVERLAPS in hooks[0].effects
    assert ProgramHooks.read(folder / name) == {"hooks": {}}


def test_session_start_with_no_project_hooks_creates_no_managed_files(new_story):
    story = new_story(fixture=MainEnvironment)
    sample = HookSamples.session_start().with_raw({"cwd": str(story.home.project_folder)})
    story.hook("s-1", sample)
    assert story.container.get(ManagedHooks).all() == []
    assert not story.home.managed_hooks_file.exists()
    assert not story.home.managed_hooks_file.with_suffix(".lock").exists()
    assert not (story.home.project_folder / ".claude/settings.json").exists()
    assert not (story.home.project_folder / ".codex/hooks.json").exists()
