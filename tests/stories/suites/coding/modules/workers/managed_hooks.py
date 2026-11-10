import json

from engine.provider.managed_hooks import ManagedHooks
from engine.provider.program_hooks import ProgramHooks
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import CHECKOUT_BRANCH, ENVIRONMENT_BRANCH
from tests.stories.support.story_checks import expect_answers, expect_program_hooks


def test_a_new_worktree_strips_committed_hooks_and_keeps_the_shared_store_unchanged(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    name = ".claude/settings.json"
    settings = {"permissions": {"allow": ["Bash(ls)"]}, "hooks": {
        "PreToolUse": [{"matcher": "Bash", "hooks": [{"type": "command", "command": "project-check", "timeout": 60}]}]}}
    ProgramHooks.store(repository.folder / name, settings)
    story.expect_text(f'program manage claude "{repository.folder}"', "managed hooks: 1")
    store = story.container.get(ManagedHooks)
    source_hooks = store.all()
    expect_answers(source_hooks, 1)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed(name, json.dumps(settings), "Project hooks")
    repository.checkout(CHECKOUT_BRANCH)
    worker = dispatched_worker(story)
    folder = repository.worktree_folder(worker.id)
    expect_program_hooks(folder, name, {"permissions": {"allow": ["Bash(ls)"]}, "hooks": {}})
    expect_store(store, 1)
    expect_sources_store(store, 2)
    worktree_store = folder / ".journal/hooks/managed.json"
    if worktree_store.exists():
        expect_samefile_worktree_store(worktree_store, story)


def expect_samefile_worktree_store(worktree_store, story) -> None:
    actual = worktree_store.samefile(story.home.managed_hooks_file)
    assert actual, actual


def expect_sources_store(store, expected) -> None:
    actual = len(store.all()[0].all_sources())
    assert actual == expected, actual


def expect_store(store, expected) -> None:
    actual = len(store.all())
    assert actual == expected, actual
