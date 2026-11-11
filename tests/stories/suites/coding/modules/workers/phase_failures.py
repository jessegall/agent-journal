import pytest

from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.held_tasks import prove_task, unplanned_holding_worker
from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, TEST_LINE, StoryWorker

THREE_TASKS = 3


@pytest.fixture
def first_failed(new_story, monkeypatch) -> StoryWorker:
    """A worker committed its three started tasks together, the first and the third with a test; the test of
    the first failed and the test of the third passed."""
    worker = unplanned_holding_worker(new_story, monkeypatch, THREE_TASKS)
    prove_task(worker, 1, 1, TEST_LINE)
    prove_task(worker, 2, 1)
    prove_task(worker, 3, 1, SECOND_TEST_LINE)
    worker.story.run(COMMIT, actor=worker.worker)
    worker.story.run_listeners()
    worker.end_tests(1, 0)
    return worker


def test_a_failure_on_an_earlier_task_puts_the_worktree_on_that_task(first_failed):
    first_failed.story.expect_rows(first_failed.worktree_task() == 1)
    first_failed.story.expect_text("task show 1", "state: started", actor=first_failed.story.agent)
