import pytest

from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, TEST_LINE, unplanned_group_worker



def delivered_tests(worker, delivery_line: str):
    worker.prove_advance(TEST_LINE)
    worker.prove_advance()
    worker.prove(SECOND_TEST_LINE)
    worker.story.run(delivery_line, actor=worker.worker)
    return worker


def expect_task_state(worker, task_id: int, state: str) -> None:
    worker.story.expect_text(f"task show {task_id}", f"state: {state}", actor=worker.story.agent)


@pytest.fixture
def delivered_worker(new_story, monkeypatch):
    return delivered_tests(unplanned_group_worker(new_story, monkeypatch), "worker deliver --wait --differences none")


@pytest.fixture
def first_failed(delivered_worker):
    delivered_worker.end_tests(1, 0)
    return delivered_worker


def test_a_failure_on_an_earlier_task_puts_the_worktree_on_that_task(first_failed):
    first_failed.story.expect_rows(first_failed.worktree_task() == 1)
    expect_task_state(first_failed, 1, "started")
