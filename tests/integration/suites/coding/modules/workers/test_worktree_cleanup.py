import pytest
from datetime import timedelta

from suites.coding.modules.workers.support.worker_settings import WORKER_IDLE_HOURS
from engine.testing.examples.hook_samples import HookSamples
from server.work.booting_work import BootingWork
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import delivered_worker, dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.worktree_samples import worktree_commit, orphan_worktree


pytestmark = pytest.mark.real_git

MAIN_SESSION = "s-1"


def hours(count: int) -> timedelta:
    return timedelta(hours=count)


def next_hour_start(story) -> timedelta:
    current_time = story.clock.timestamp().value
    return timedelta(minutes=60 - current_time.minute, seconds=-current_time.second)


def idle_hours(story) -> int:
    return story.number_default(WORKER_IDLE_HOURS)










def test_a_worktree_no_worker_holds_with_changes_not_committed_stays(played):
    story = played(OpenTaskOrchestrator)
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


def test_a_start_of_the_journal_keeps_unmerged_work_no_worker_holds(played):
    story = played(OpenTaskOrchestrator)
    repository = repository_environment(story)
    tip = orphan_worktree(repository, 9)
    BootingWork().run(story.container)
    story.run_listeners()
    story.expect_rows(repository.worktree_folder(9).is_dir())
    story.expect_rows(repository.git("rev-parse", "refs/worker-tips/worker-9").stdout.strip() == tip)
