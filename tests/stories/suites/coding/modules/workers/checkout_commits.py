from pathlib import Path

import pytest

from suites.coding.modules.workers.ticks.stalled_worker_test_runs import StalledWorkerTestRuns
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.held_tasks import prove_task, unplanned_worker_with_tasks
from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, TEST_LINE, StoryWorker

pytestmark = pytest.mark.real_git

LATER_FILE = "later_file.txt"


def committed(worker: StoryWorker) -> None:
    worker.story.run(COMMIT, actor=worker.worker)
    worker.story.run_listeners()


def checkout_of_tests(worker: StoryWorker) -> Path:
    """The checkout the worker's tests run in, beside its worktree."""
    folder = worker.repository.worktree_folder(worker.worker.id)
    return folder.parent.with_name(f"{folder.parent.name}-tests") / folder.name


def test_a_test_queued_by_a_later_commit_waits_for_the_running_one_and_then_runs_on_the_later_commits_files(new_story, monkeypatch):
    worker = unplanned_worker_with_tasks(new_story, monkeypatch)
    prove_task(worker, 1, 1, TEST_LINE)
    committed(worker)
    worker.repository.changed(worker.worker.id, LATER_FILE, "made after the first commit\n")
    prove_task(worker, 2, 1, SECOND_TEST_LINE)
    committed(worker)
    worker.story.expect_rows(len(worker.started) == 1, detail=f"started: {worker.started}")
    worker.story.expect_text("proof show 2", "state: queued", actor=worker.story.agent)
    worker.end_tests(0)
    StalledWorkerTestRuns()(worker.story.container)
    worker.story.run_listeners()
    worker.story.expect_rows(len(worker.started) == 2, (checkout_of_tests(worker) / LATER_FILE).is_file(), detail=f"started: {worker.started}")
