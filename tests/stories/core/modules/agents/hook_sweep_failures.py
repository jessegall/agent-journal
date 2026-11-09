import subprocess

from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.program_hooks import ProgramHooks
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_program_hooks, expect_startswith_listed, expect_value_3

SETTINGS = ".claude/settings.json"
HOOKS = {"hooks": {"PreToolUse": [{"matcher": "Bash", "hooks": [{"type": "command", "command": "project-check", "timeout": 30}]}]}}


def git(folder, *arguments) -> None:
    subprocess.run(["git", "-C", str(folder), *arguments], capture_output=True, check=True)


def test_a_tracked_file_stays_whole_while_the_index_is_locked_and_is_swept_after(new_story):
    story = new_story(fixture=MainEnvironment)
    folder = story.home.project_folder
    git(folder, "init", "-q")
    ProgramHooks.store(folder / SETTINGS, HOOKS)
    git(folder, "add", SETTINGS)
    lock = folder / ".git" / "index.lock"
    lock.touch()
    story.expect_text(f'program manage claude "{folder}"', "managed hooks: 0")
    expect_program_hooks(folder, SETTINGS, HOOKS)
    lock.unlink()
    story.expect_text(f'program manage claude "{folder}"', "managed hooks: 1")
    expect_program_hooks(folder, SETTINGS, {"hooks": {}})
    listed = subprocess.run(["git", "-C", str(folder), "ls-files", "-v", SETTINGS], capture_output=True, text=True, check=True).stdout
    expect_startswith_listed(listed, "S ")


def test_a_hook_in_both_settings_files_is_restored_to_both(new_story):
    story = new_story(fixture=MainEnvironment)
    folder = story.home.project_folder
    paths = [folder / SETTINGS, folder / ".claude/settings.local.json"]
    for path in paths:
        ProgramHooks.store(path, HOOKS)
    story.expect_text(f'program manage claude "{folder}"', "managed hooks: 1")
    expect_program_hooks_paths_2("hooks", paths)
    expect_sources(story, 2)
    story.expect_text("hooks give-back", "restored hooks: 1")
    expect_program_hooks_paths(HOOKS, paths)


def expect_program_hooks_paths(item, paths) -> None:
    actual = all((ProgramHooks.read(path) == item for path in paths))
    assert actual, actual


def expect_sources(story, expected) -> None:
    actual = len(story.container.get(ManagedHooks).all()[0].all_sources())
    assert actual == expected, actual


def expect_program_hooks_paths_2(text, paths) -> None:
    actual = all((ProgramHooks.read(path) == {text: {}} for path in paths))
    assert actual, actual
