from tests.stories.suites.coding.modules.workers.support.commit_command import asked_for_merge
from tests.stories.core.support.agent_labels import agent_number
import pytest

from engine.database.database import Database
from engine.testing.examples.hook_samples import HookSamples
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH


@pytest.mark.parametrize("command,notice", [("worker merge --wait {worker}", "clashed on cart.py"),
                                           ('worker send --wait {worker} "Finish the total"', "takes the job")])
@pytest.mark.real_git
def test_a_conflict_reopens_the_closed_task_before_asking_the_worker_to_edit(new_story, command, notice):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_text("task show 1", "state: completed", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("cart.py", "TOTAL = 2\n", "Another total")
    story.expect_text(command.format(worker=agent_number(story, worker.id)), notice, actor=story.agent)
    story.expect_text(f"agent-line list --agent {worker.id}", "clashes on cart.py")
    story.expect_text("task show 1", "state: started", f"holder_id: {worker.id}")
    path = repository.worktree_folder(worker.id) / "cart.py"
    story.expect_hook_allowed(worker_session(story, worker), HookSamples.edit(str(path)))
    path.write_text("TOTAL = 3\n")
    story.expect_success("worker commit --wait --differences none", actor=worker)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    asked_for_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", "TOTAL = 3\n")


@pytest.mark.real_git
def test_worker_send_runs_git_outside_its_transaction(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    database, transaction_flags, synced = story.container.get(Database), [], WorktreeGit.sync

    def watched_sync(git, worktree):
        transaction_flags.append(database.has_transaction)
        return synced(git, worktree)

    monkeypatch.setattr(WorktreeGit, "sync", watched_sync)
    story.expect_text(f'worker send --wait {agent_number(story, worker.id)} "Finish the total"', "takes the job", actor=story.agent)
    story.expect_rows(transaction_flags == [False])

