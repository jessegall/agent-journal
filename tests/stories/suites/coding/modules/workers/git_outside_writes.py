import subprocess

import pytest

from core.base.database.database import Database
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DELIVERY, DISPATCH, FIRST_PROOF, checked_worker, dispatched_worker, expect_clean_environment, repository_environment
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


def removal_past_its_limit(git, folder, worktree):
    raise subprocess.TimeoutExpired("git worktree remove", 1)


def test_a_dispatch_runs_git_with_no_write_open(git_in_writes):
    story, git_calls = git_in_writes
    repository_environment(story)
    dispatched_worker(story)
    expect_git_calls_outside(git_calls)


def test_a_dispatch_whose_cut_fails_undoes_its_rows_with_no_write_open(git_in_writes):
    story, git_calls = git_in_writes
    repository = repository_environment(story)
    story.expect_success("""setting make journal.suites.coding.workers.worktree-commands '["echo npm is not installed >&2; exit 1"]' --environment main""", "key: journal.suites.coding.workers.worktree-commands")
    story.expect_refusal(DISPATCH, "npm is not installed", actor=story.agent)
    expect_clean_environment(story, repository)
    expect_git_calls_outside(git_calls)


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
    story.expect_success(f"worker logs {worker.id}", actor=story.agent)
    story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)
    expect_git_calls_outside(git_calls)


def test_a_release_runs_git_with_no_write_open(git_in_writes):
    story, git_calls = git_in_writes
    repository_environment(story)
    worker = dispatched_worker(story)
    git_calls.clear()
    story.expect_success(f'worker release {worker.id} "it went the wrong way"', actor=story.agent)
    story.expect_text("task show 1", "state: open")
    expect_git_calls_outside(git_calls)


def test_a_release_whose_git_timed_out_takes_up_again_from_the_abandoned_worktree(git_in_writes, monkeypatch):
    story, git_calls = git_in_writes
    repository_environment(story)
    worker = dispatched_worker(story)
    with monkeypatch.context() as patch:
        patch.setattr(WorktreeGit, "remove", removal_past_its_limit)
        failed = story.run(f'worker release {worker.id} "it went the wrong way"', actor=story.agent)
    story.expect_rows(failed.code != 0)
    story.expect_text("task show 1", "state: open")
    git_calls.clear()
    story.expect_success(f'worker release {worker.id} "it went the wrong way"', actor=story.agent)
    story.expect_refusal(f'worker release {worker.id} "it went the wrong way"', "has no worktree out", actor=story.agent)
    expect_git_calls_outside(git_calls)
