import json

from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.program_hooks import ProgramHooks
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import CHECKOUT_BRANCH, ENVIRONMENT_BRANCH


def test_a_new_worktree_strips_committed_hooks_and_keeps_the_shared_store_unchanged(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    name = ".claude/settings.json"
    settings = {"permissions": {"allow": ["Bash(ls)"]}, "hooks": {
        "PreToolUse": [{"matcher": "Bash", "hooks": [{"type": "command", "command": "project-check", "timeout": 60}]}]}}
    ProgramHooks.store(repository.folder / name, settings)
    story.expect_text(f'program manage claude "{repository.folder}"', "managed hooks: 1")
    store = story.container.get(ManagedHooks)
    source_hooks = store.all()
    assert len(source_hooks) == 1
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed(name, json.dumps(settings), "Project hooks")
    repository.checkout(CHECKOUT_BRANCH)
    worker = dispatched_worker(story)
    folder = repository.worktree_folder(worker.id)
    assert ProgramHooks.read(folder / name) == {"permissions": {"allow": ["Bash(ls)"]}, "hooks": {}}
    assert store.all() == source_hooks
    worktree_store = folder / ".journal/hooks/managed.json"
    if worktree_store.exists():
        assert worktree_store.samefile(story.home.managed_hooks_file)
