from tests.stories.suites.coding.modules.workers.support.commit_command import request_merge
from tests.stories.core.support.agent_labels import agent_number
import pytest

from engine.database.database import Database
from engine.testing.examples.hook_samples import HookSamples
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import FIRST_PROOF, checked_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH




@pytest.mark.real_git
def test_worker_send_runs_git_outside_its_transaction(played, monkeypatch):
    story = played(OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    database, transaction_flags, synced = story.container.get(Database), [], WorktreeGit.sync

    def watched_sync(git, worktree):
        transaction_flags.append(database.has_transaction)
        return synced(git, worktree)

    monkeypatch.setattr(WorktreeGit, "sync", watched_sync)
    story.expect_text(f'worker send --wait {agent_number(story, worker.agent_id())} "Finish the total"', "takes the job", actor=story.agent)
    story.expect_rows(transaction_flags == [False])



