import subprocess

from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.program_hooks import ProgramHooks
from tests.stories.core.support.fixtures import MainEnvironment

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
    assert ProgramHooks.read(folder / SETTINGS) == HOOKS
    lock.unlink()
    story.expect_text(f'program manage claude "{folder}"', "managed hooks: 1")
    assert ProgramHooks.read(folder / SETTINGS) == {"hooks": {}}
    listed = subprocess.run(["git", "-C", str(folder), "ls-files", "-v", SETTINGS], capture_output=True, text=True, check=True).stdout
    assert listed.startswith("S ")


def test_a_restore_passes_over_a_hook_whose_worktree_is_gone(new_story):
    story = new_story(fixture=MainEnvironment)
    folder = story.home.project_folder / "worktree"
    ProgramHooks.store(folder / SETTINGS, HOOKS)
    story.expect_text(f'program manage claude "{folder}"', "managed hooks: 1")
    (folder / SETTINGS).unlink()
    (folder / ".claude").rmdir()
    story.expect_text("hooks give-back", "restored hooks: 1")
    assert story.container.get(ManagedHooks).all() == []
    assert not (folder / ".claude").exists()
