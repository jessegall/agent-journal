import pytest
from datetime import timedelta

from suites.coding.modules.workers.support.worker_settings import WORKER_IDLE_HOURS
from core.testing.hook_samples import HookSamples
from server.booting_work import BootingWork
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import delivered_worker, dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.worktree_samples import worktree_commit, orphan_worktree


pytestmark = pytest.mark.real_git

MAIN_SESSION = "s-1"
DEFAULT_HOURS = 6


def hours(count: int) -> timedelta:
    return timedelta(hours=count)


def next_hour_start(story) -> timedelta:
    now = story.clock.timestamp().value
    return timedelta(minutes=60 - now.minute, seconds=-now.second)


def test_a_worker_that_used_a_tool_within_the_hours_keeps_running(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.advance(hours(DEFAULT_HOURS - 1))
    story.hook(worker_session(story, worker), HookSamples.prompt("Fix the cart"))
    story.advance(hours(DEFAULT_HOURS - 1))
    story.tick(MAIN_SESSION)
    story.expect_success("worker-worktree show 1", "state: cut")
    story.expect_success(lines.TASK_DETAILS, "state: started")


def test_a_worker_with_delivered_work_is_never_stopped_for_being_idle(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    delivered_worker(story, repository)
    story.advance(hours(DEFAULT_HOURS * 4))
    story.tick(MAIN_SESSION)
    story.expect_success("worker-worktree show 1", "state: delivered")


def test_the_setting_sets_the_hours_a_worker_may_be_idle(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(f"setting make {WORKER_IDLE_HOURS} {DEFAULT_HOURS * 2} --environment main", f"key: {WORKER_IDLE_HOURS}")
    story.advance(hours(DEFAULT_HOURS))
    story.tick(MAIN_SESSION)
    story.expect_success("worker-worktree show 1", "state: cut")
    story.advance(hours(DEFAULT_HOURS))
    story.tick(MAIN_SESSION)
    story.expect_text(f"agent show {worker.id}", "ended_at: ")


def test_the_hourly_sweep_keeps_unmerged_work_and_its_tip_as_a_ref(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    tip = orphan_worktree(repository, 9)
    story.advance(next_hour_start(story))
    story.tick(MAIN_SESSION)
    story.expect_rows(repository.worktree_folder(9).is_dir())
    story.expect_rows(repository.git("rev-parse", "refs/worker-tips/worker-9").stdout.strip() == tip)


def test_a_worktree_no_worker_holds_with_changes_not_committed_stays(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    tip = orphan_worktree(repository, 9)
    folder = repository.worktree_folder(9)
    (folder / "unfinished.txt").write_text("not committed")
    BootingWork().run(story.container)
    story.run_listeners()
    story.expect_rows((folder / "unfinished.txt").exists())
    story.expect_rows(repository.git("rev-parse", "refs/worker-tips/worker-9").stdout.strip() == tip)
    removed = story.container.get(WorktreeGit).remove_orphan(str(repository.folder), str(folder), "version-5", repository.worker_branch(9))
    story.expect_rows(removed is False)


def test_a_start_of_the_journal_keeps_unmerged_work_no_worker_holds(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    tip = orphan_worktree(repository, 9)
    BootingWork().run(story.container)
    story.run_listeners()
    story.expect_rows(repository.worktree_folder(9).is_dir())
    story.expect_rows(repository.git("rev-parse", "refs/worker-tips/worker-9").stdout.strip() == tip)
