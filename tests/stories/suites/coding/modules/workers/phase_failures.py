import pytest

from core.modules.processes.support.output_folder import OutputFolder
from core.testing.expect_reply import expect_reply_allowed, expect_reply_refusal
from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, PHASE_DISPATCH, TEST_LINE, start_planned_worker



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
    return delivered_tests(start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH), "worker deliver --wait --differences none")


@pytest.fixture
def first_failed(delivered_worker):
    delivered_worker.end_tests(1, 0)
    return delivered_worker


@pytest.fixture
def selected_tests_delivered(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
    worker.story.run('setting set journal.suites.coding.workers.affected-tests-command "python3 pick.py" --environment main')
    worker.story.run('setting set journal.suites.coding.workers.project-test-command "python3 -m pytest -q" --environment main')
    return delivered_tests(worker, "worker deliver --wait --differences none")


def test_the_worker_gets_every_failure_in_one_line_once_all_tests_have_ended(delivered_worker):
    delivered_worker.end_test(delivered_worker.started[0], 1)
    delivered_worker.story.expect_text("proof show 3", "state: running", actor=delivered_worker.story.agent)
    delivered_worker.story.expect_rows(not any("failed" in line for line in delivered_worker.worker_lines()))
    delivered_worker.end_test(delivered_worker.started[1], 1)
    failures = [line for line in delivered_worker.worker_lines() if "failed" in line]
    delivered_worker.story.expect_rows(len(failures) == 1)
    delivered_worker.story.expect_rows(all(str(output) in failures[0] for output in delivered_worker.started), TEST_LINE not in failures[0], SECOND_TEST_LINE not in failures[0])
    delivered_worker.story.expect_text("proof show 1", TEST_LINE, actor=delivered_worker.worker)
    delivered_worker.story.expect_text("proof show 3", SECOND_TEST_LINE, actor=delivered_worker.worker)


def test_a_failure_on_an_earlier_task_puts_the_worktree_on_that_task(first_failed):
    first_failed.story.expect_rows(first_failed.worktree_task() == 1)
    expect_task_state(first_failed, 1, "started")


def test_free_runs_end_at_the_next_hand_in(first_failed):
    for _ in range(5):
        expect_reply_allowed(first_failed.run_test())
    first_failed.story.expect_success("worker deliver --wait --differences none", actor=first_failed.worker)


def test_a_failed_selected_test_counts_as_a_failure(selected_tests_delivered):
    selected_tests_delivered.end_tests(0, 0)
    picker = selected_tests_delivered.started[2]
    selected_tests_delivered.story.container.get(OutputFolder).write_output(picker, 1, "tests/other.py\n")
    selected_tests_delivered.end_test(picker)
    first_answer = selected_tests_delivered.started[3]
    selected_tests_delivered.end_test(first_answer, 1)
    selected_tests_delivered.story.expect_rows(any(str(first_answer) in line for line in selected_tests_delivered.worker_lines()))
    expect_reply_allowed(selected_tests_delivered.run_test())
