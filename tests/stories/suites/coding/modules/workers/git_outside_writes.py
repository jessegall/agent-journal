from tests.stories.core.support.agent_labels import agent_number
import subprocess

import pytest

from engine.database.database import Database
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DISPATCH, FIRST_PROOF, checked_worker, dispatched_worker, expect_clean_environment, repository_environment
@pytest.fixture
def git_writes(monkeypatch, new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    git_calls, git = [], WorktreeGit.git

    def watched_git(self, folder, limit_seconds, *arguments):
        if story.container.get(Database).has_transaction:
            git_calls.append(arguments)
        return git(self, folder, limit_seconds, *arguments)

    monkeypatch.setattr(WorktreeGit, "git", watched_git)
    return story, git_calls


def expect_external_git_calls(git_calls):
    assert git_calls == [], f"git ran with a write open: {git_calls}"


def expired_removal(git, folder, worktree):
    raise subprocess.TimeoutExpired("git worktree remove", 1)


def test_a_release_runs_git_with_no_write_open(git_writes):
    story, git_calls = git_writes
    repository_environment(story)
    worker = dispatched_worker(story)
    git_calls.clear()
    story.expect_success(f'worker release {agent_number(story, worker.id)} "it went the wrong way"', actor=story.agent)
    story.expect_text("task show 1", "state: open")
    expect_external_git_calls(git_calls)


@pytest.mark.real_git
def test_a_release_whose_git_timed_out_takes_up_again_from_the_abandoned_worktree(git_writes, monkeypatch):
    story, git_calls = git_writes
    repository_environment(story)
    worker = dispatched_worker(story)
    with monkeypatch.context() as patch:
        patch.setattr(WorktreeGit, "remove", expired_removal)
        failed = story.run(f'worker release {agent_number(story, worker.id)} "it went the wrong way"', actor=story.agent)
    story.expect_rows(failed.code != 0)
    story.expect_text("task show 1", "state: open")
    git_calls.clear()
    story.expect_success(f'worker release {agent_number(story, worker.id)} "it went the wrong way"', actor=story.agent)
    story.expect_refusal(f'worker release {agent_number(story, worker.id)} "it went the wrong way"', "has no worktree out", actor=story.agent)
    expect_external_git_calls(git_calls)
