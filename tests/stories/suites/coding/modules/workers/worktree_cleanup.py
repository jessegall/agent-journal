from datetime import timedelta

from suites.coding.modules.workers.support.worker_settings import WORKER_IDLE_HOURS
from core.testing.hook_samples import HookSamples
from server.booting_work import BootingWork
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import delivered_worker, dispatched_worker, repository_environment, worker_session

MAIN_SESSION = "s-1"
DEFAULT_HOURS = 6


def hours(count: int) -> timedelta:
    return timedelta(hours=count)


def next_hour_start(story) -> timedelta:
    now = story.clock.timestamp().value
    return timedelta(minutes=60 - now.minute, seconds=-now.second)


def commit_in_worktree(repository, worker_id: int, name: str) -> str:
    repository.changed(worker_id, name, "TOTAL = 9\n")
    repository.git("add", "-A", folder=repository.worktree_folder(worker_id))
    repository.git("commit", "-m", "Work in progress", folder=repository.worktree_folder(worker_id))
    return repository.git("rev-parse", "HEAD", folder=repository.worktree_folder(worker_id)).stdout.strip()


def orphan_worktree(repository, worker_id: int) -> str:
    branch = repository.worker_branch(worker_id)
    repository.git("worktree", "add", "-b", branch, str(repository.worktree_folder(worker_id)), "version-5")
    return commit_in_worktree(repository, worker_id, "cart.py")


def test_a_worker_idle_for_the_hours_of_the_setting_is_retired_with_its_task_open_and_its_worktree_removed(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    story.advance(hours(DEFAULT_HOURS))
    story.tick(MAIN_SESSION)
    story.expect_success("worker-worktree show 1", "state: removed")
    story.expect_success(lines.TASK_DETAILS, "state: open")
    story.expect_rows("ended_at: None" not in story.run(f"agent show {worker.id}").output_text)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"worker:{worker.id} was idle too long: released, task:1 is open again")
    repository.expect_no_folder(worker.id)


def test_the_commits_of_a_retired_worker_stay_on_its_branch(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    tip = commit_in_worktree(repository, worker.id, "cart.py")
    story.advance(hours(DEFAULT_HOURS))
    story.tick(MAIN_SESSION)
    repository.expect_branch_tip(repository.worker_branch(worker.id), tip)
    repository.expect_no_folder(worker.id)


def test_a_worker_that_used_a_tool_within_the_hours_is_not_retired(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.advance(hours(DEFAULT_HOURS - 1))
    story.hook(worker_session(story, worker), HookSamples.prompt("Fix the cart"))
    story.advance(hours(DEFAULT_HOURS - 1))
    story.tick(MAIN_SESSION)
    story.expect_success("worker-worktree show 1", "state: cut")
    story.expect_success(lines.TASK_DETAILS, "state: started")


def test_a_worker_with_delivered_work_is_never_retired_for_being_idle(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    delivered_worker(story, repository)
    story.advance(hours(DEFAULT_HOURS * 4))
    story.tick(MAIN_SESSION)
    story.expect_success("worker-worktree show 1", "state: delivered")


def test_the_setting_sets_the_hours_a_worker_may_be_idle(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    dispatched_worker(story)
    story.expect_success(f"setting make {WORKER_IDLE_HOURS} {DEFAULT_HOURS * 2} --environment main", f"key: {WORKER_IDLE_HOURS}")
    story.advance(hours(DEFAULT_HOURS))
    story.tick(MAIN_SESSION)
    story.expect_success("worker-worktree show 1", "state: cut")
    story.advance(hours(DEFAULT_HOURS))
    story.tick(MAIN_SESSION)
    story.expect_success("worker-worktree show 1", "state: removed")


def test_the_hourly_sweep_removes_a_worktree_no_worker_holds_and_keeps_its_tip_as_a_ref(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    tip = orphan_worktree(repository, 9)
    story.advance(next_hour_start(story))
    story.tick(MAIN_SESSION)
    repository.expect_no_folder(9)
    story.expect_rows(repository.git("rev-parse", "refs/worker-tips/worker-9").stdout.strip() == tip)


def test_the_sweep_leaves_the_worktree_of_a_worker_that_holds_it(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    story.advance(next_hour_start(story))
    story.tick(MAIN_SESSION)
    story.expect_success("worker-worktree show 1", "state: cut")
    story.expect_rows(repository.worktree_folder(worker.id).exists())


def test_the_sweep_runs_only_on_the_first_minute_of_an_hour(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    orphan_worktree(repository, 9)
    story.advance(next_hour_start(story) + timedelta(minutes=5))
    story.tick(MAIN_SESSION)
    story.expect_rows(repository.worktree_folder(9).exists())


def test_the_sweep_leaves_a_worktree_outside_the_worktree_folder(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    separate_folder = story.home.folder.parent / "separate_folder"
    repository.git("worktree", "add", "-b", "scratch", str(separate_folder), "version-5")
    story.advance(next_hour_start(story))
    story.tick(MAIN_SESSION)
    story.expect_rows(separate_folder.exists())


def test_a_start_of_the_journal_sweeps_the_worktrees_no_worker_holds(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    tip = orphan_worktree(repository, 9)
    BootingWork().run(story.container)
    story.run_listeners()
    repository.expect_no_folder(9)
    story.expect_rows(repository.git("rev-parse", "refs/worker-tips/worker-9").stdout.strip() == tip)
