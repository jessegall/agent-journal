from engine.provider.managed_hooks import ManagedHooks
from engine.provider.program_hooks import ProgramHooks
from tests.stories.core.support.fixtures import MainEnvironment

SETTINGS = ".claude/settings.json"
HOOKS = {"hooks": {"PreToolUse": [{"matcher": "Bash", "hooks": [{"type": "command", "command": "project-check", "timeout": 30}]}]}}


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
