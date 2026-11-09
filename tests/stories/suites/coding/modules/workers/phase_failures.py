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
def last_failed(delivered_worker):
    delivered_worker.end_tests(0, 1)
    return delivered_worker


@pytest.fixture
def two_failed(delivered_worker):
    delivered_worker.end_tests(1, 1)
    return delivered_worker


@pytest.fixture
def plan_failed(new_story, monkeypatch):
    worker = delivered_tests(start_planned_worker(new_story, monkeypatch), "worker next --wait --differences none")
    worker.end_tests(1, 0)
    return worker


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


def test_a_failure_on_the_last_task_only_puts_the_worktree_on_the_last_task(last_failed):
    last_failed.story.expect_rows(last_failed.worktree_task() == 3)
    expect_task_state(last_failed, 3, "started")
    last_failed.story.expect_text("proof show 1", "state: checked", actor=last_failed.story.agent)


def test_free_runs_end_at_the_next_hand_in(first_failed):
    for _ in range(5):
        expect_reply_allowed(first_failed.run_test())
    first_failed.story.expect_success("worker deliver --wait --differences none", actor=first_failed.worker)


def test_the_second_hand_in_runs_only_what_failed_and_what_passed_stays_checked(first_failed):
    first_failed.repository.changed(first_failed.worker.id, "cart.py", "TOTAL = 4\n")
    first_failed.story.expect_success("worker deliver --wait --differences none", actor=first_failed.worker)
    first_failed.story.expect_text("proof show 1", "state: running", actor=first_failed.story.agent)
    first_failed.story.expect_text("proof show 3", "state: checked", actor=first_failed.story.agent)
    first_failed.story.expect_rows(len(first_failed.started) == 3 and first_failed.started_processes()[2].line == TEST_LINE)


def test_several_failed_tasks_all_go_to_testing_at_the_next_hand_in(two_failed):
    two_failed.story.expect_success("worker deliver --wait --differences none", actor=two_failed.worker)
    expect_task_state(two_failed, 1, "testing")
    expect_task_state(two_failed, 3, "testing")


def test_worker_next_is_the_hand_in_after_a_failure_when_the_next_task_is_in_another_phase(plan_failed):
    plan_failed.story.expect_text("worker next --wait --differences none", "queued", actor=plan_failed.worker)
    plan_failed.story.expect_rows(plan_failed.started_processes()[-1].line == TEST_LINE)
    plan_failed.end_test(plan_failed.started[-1])
    plan_failed.story.expect_rows(plan_failed.current_task() == 4)


def test_a_failed_selected_test_counts_as_a_failure(selected_tests_delivered):
    selected_tests_delivered.end_tests(0, 0)
    picker = selected_tests_delivered.started[2]
    selected_tests_delivered.story.container.get(OutputFolder).write_output(picker, 1, "tests/other.py\n")
    selected_tests_delivered.end_test(picker)
    first_answer = selected_tests_delivered.started[3]
    selected_tests_delivered.end_test(first_answer, 1)
    selected_tests_delivered.story.expect_rows(any(str(first_answer) in line for line in selected_tests_delivered.worker_lines()))
    expect_reply_allowed(selected_tests_delivered.run_test())


@pytest.fixture
def plan_two_failed(new_story, monkeypatch):
    worker = delivered_tests(start_planned_worker(new_story, monkeypatch), "worker next --wait --differences none")
    worker.end_tests(1, 1)
    return worker


def test_two_failed_tasks_of_a_phase_are_handed_in_again_with_no_skip(plan_two_failed):
    plan_two_failed.story.expect_text("worker next --wait --differences none", "queued", actor=plan_two_failed.worker)
    expect_task_state(plan_two_failed, 1, "testing")
    expect_task_state(plan_two_failed, 3, "testing")
    plan_two_failed.end_test(plan_two_failed.started[-2])
    plan_two_failed.end_test(plan_two_failed.started[-1])
    plan_two_failed.story.expect_rows(plan_two_failed.current_task() == 4)
