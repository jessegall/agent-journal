from datetime import timedelta
from pathlib import Path

from unittest.mock import patch

from core.base.command.bus import Bus
from core.base.database.database import Database
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.commands.end_idle_worker.end_idle_worker import EndIdleWorker
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from core.base.journal_home import LAUNCHER_SOCKET
from core.testing.fake_launcher import FakeLauncher
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, delivered_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
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


def test_at_the_kept_maximum_a_dispatch_is_refused_with_a_retire_line(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.expect_success("setting set journal.suites.coding.workers.worker-kept-limit 1 --environment main", actor=story.user)
    worker = dispatched_worker(story)
    task_id = story.new_row_id('task make "A second task"', actor=story.agent)
    story.expect_refusal(f"worker dispatch --model sonnet {task_id}", f"1 workers are kept: agent:{worker.id}", actor=story.agent)


def test_a_worker_resume_at_the_run_limit_is_held_and_starts_when_a_place_frees(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET), answer=b"started\n", request_count=3)
    worker = delivered_worker(story, repository)
    story.run_listeners()
    stopped(story, worker)
    story.run_listeners()
    story.expect_success("setting set journal.suites.coding.workers.worker-run-limit 0 --environment main", actor=story.user)
    story.advance(timedelta(seconds=1))
    story.expect_success(f'worker send {worker.id} "Add the tax"', actor=story.agent)
    story.run_listeners()
    WorkerResumeRetry()(story.container)
    started_before = len(launcher.starts)
    story.expect_success("setting set journal.suites.coding.workers.worker-run-limit 2 --environment main", actor=story.user)
    WorkerResumeRetry()(story.container)
    story.expect_rows(started_before == 1, len(launcher.starts) == 2)


def test_a_kept_worker_takes_a_new_task_on_its_open_worktree_and_what_it_delivered_stays(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    task_id = story.new_row_id('task make "A second task"', actor=story.agent)
    story.expect_success(f"worker send {worker.id} --task {task_id}", actor=story.agent)
    story.expect_text(f"task show {task_id}", "state: started", f"holder_id: {worker.id}", actor=story.agent)
    story.expect_text("task show 1", "state: testing", actor=story.agent)
    story.expect_text("proof list --task 1", "cart.py:1", actor=story.agent)


def test_a_merged_worker_gets_a_new_cut_on_its_session(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker logs {worker.id}", actor=story.agent)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    task_id = story.new_row_id('task make "A second task"', actor=story.agent)
    story.expect_success(f"worker send {worker.id} --task {task_id}", actor=story.agent)
    story.expect_text(f"task show {task_id}", "state: started", f"holder_id: {worker.id}", actor=story.agent)
    worktree = story.container.get(WorktreeQuery).worker_worktree(worker.id)
    story.expect_rows(worktree.task_id == task_id, Path(worktree.folder).is_dir())


def test_an_unmerged_branch_is_never_overwritten(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    story.expect_success(f'worker release {worker.id} "Not needed"', actor=story.agent)
    task_id = story.new_row_id('task make "A second task"', actor=story.agent)
    story.expect_refusal(f"worker send {worker.id} --task {task_id}", "unmerged work", actor=story.agent)

