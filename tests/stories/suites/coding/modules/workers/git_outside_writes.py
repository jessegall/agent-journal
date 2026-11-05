import pytest

from core.base.database.database import Database
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DELIVERY, FIRST_PROOF, checked_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH


@pytest.fixture
def git_in_writes(monkeypatch, new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    git_calls, git = [], WorktreeGit.git

    def watched_git(self, folder, limit_seconds, *arguments):
        if story.container.get(Database).has_transaction:
            git_calls.append(arguments)
        return git(self, folder, limit_seconds, *arguments)

    monkeypatch.setattr(WorktreeGit, "git", watched_git)
    return story, git_calls


def expect_git_calls_outside(git_calls):
    assert git_calls == [], f"git ran with a write open: {git_calls}"


def test_a_hand_in_runs_git_with_no_write_open(git_in_writes):
    story, git_calls = git_in_writes
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, actor=worker)
    git_calls.clear()
    story.expect_success(DELIVERY, actor=worker)
    expect_git_calls_outside(git_calls)


def test_a_merge_runs_git_with_no_write_open(git_in_writes):
    story, git_calls = git_in_writes
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    git_calls.clear()
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    expect_git_calls_outside(git_calls)
