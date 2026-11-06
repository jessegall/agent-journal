from unittest.mock import patch

from core.base.command.bus import Bus
from core.base.database.database import Database
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.commands.end_idle_worker.end_idle_worker import EndIdleWorker
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import delivered_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.worktree_samples import commit_in_worktree

REASON = '--reason "Its work is finished"'


def stopped(story, worker) -> None:
    story.container.get(Bus).run(EndIdleWorker(worker.id), story.agent)


def test_a_worker_with_unmerged_work_is_not_retired(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    stopped(story, worker)
    story.expect_refusal(f"agent retire {worker.id} {REASON}", "unmerged work", actor=story.agent)


def test_retire_refused_with_uncommitted_files(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", "TOTAL = 3\n")
    stopped(story, worker)
    story.expect_refusal(f"agent retire {worker.id} {REASON}", "uncommitted files", actor=story.agent)


def test_retire_settles_what_a_worker_holds(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    stopped(story, worker)
    story.expect_success(f"agent retire {worker.id} {REASON}", f"retired agent {worker.id}", actor=story.agent)
    story.expect_success("worker-worktree show 1", "state: removed")
    story.expect_success("task show 1", "state: open")
    repository.expect_no_folder(worker.id)


def test_retire_refused_with_a_preserved_branch(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    commit_in_worktree(repository, worker.id, "cart.py")
    story.expect_success(f'worker release {worker.id} "Not needed"', actor=story.agent)
    story.expect_refusal(f"agent retire {worker.id} {REASON}", "unmerged work", actor=story.agent)


def test_a_failed_git_status_holds_the_retirement(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    stopped(story, worker)
    folder = repository.worktree_folder(worker.id)
    (folder / ".git").write_text("not a git folder")
    story.expect_refusal(f"agent retire {worker.id} {REASON}", "git status failed", actor=story.agent)


def test_a_retire_runs_git_outside_the_transaction(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    stopped(story, worker)
    database = story.container.get(Database)
    git = WorktreeGit.git
    inside = []

    def recording_git(self, *arguments, **options):
        if "status" in arguments or "rev-parse" in arguments:
            inside.append(database.has_transaction)
        return git(self, *arguments, **options)
    with patch.object(WorktreeGit, "git", recording_git):
        story.expect_success(f"agent retire {worker.id} {REASON}", actor=story.agent)
    story.expect_rows(bool(inside), not any(inside))
