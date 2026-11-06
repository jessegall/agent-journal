import pytest

from core.modules.processes.support.output_folder import OutputFolder
from core.testing.expect_reply import expect_reply_allowed, expect_reply_refusal
from tests.stories.suites.coding.modules.workers.support.phase_steps import OTHER_TEST_LINE, PHASE_DISPATCH, TEST_LINE, asking_main, worker_on_plan

FLAG = "--ask-main"


def handed_in_with_tests(worker, hand_in: str):
    worker.prove_and_move_on(TEST_LINE)
    worker.prove_and_move_on()
    worker.prove(OTHER_TEST_LINE)
    worker.story.run(hand_in, actor=worker.worker)
    return worker


def expect_task_state(worker, task_id: int, state: str) -> None:
    worker.story.expect_text(f"task show {task_id}", f"state: {state}", actor=worker.story.agent)


@pytest.fixture
def handed_in(new_story, monkeypatch):
    return handed_in_with_tests(worker_on_plan(new_story, monkeypatch, PHASE_DISPATCH), "worker deliver")


@pytest.fixture
def first_failed(handed_in):
    handed_in.end_tests(1, 0)
    return handed_in


@pytest.fixture
def last_failed(handed_in):
    handed_in.end_tests(0, 1)
    return handed_in


@pytest.fixture
def both_failed(handed_in):
    handed_in.end_tests(1, 1)
    return handed_in


@pytest.fixture
def whole_plan_failed(new_story, monkeypatch):
    worker = handed_in_with_tests(worker_on_plan(new_story, monkeypatch), "worker next")
    worker.end_tests(1, 0)
    return worker


@pytest.fixture
def selected_tests_handed_in(new_story, monkeypatch):
    worker = worker_on_plan(new_story, monkeypatch, PHASE_DISPATCH)
    worker.story.run('setting set journal.suites.coding.workers.affected-tests-command "python3 pick.py" --environment main', actor=worker.story.agent)
    worker.story.run('setting set journal.suites.coding.workers.project-test-command "python3 -m pytest -q" --environment main', actor=worker.story.agent)
    return handed_in_with_tests(worker, "worker deliver")


def test_the_worker_gets_every_failure_in_one_line_once_all_tests_have_ended(handed_in):
    handed_in.end_test(handed_in.started[0], 1)
    handed_in.story.expect_text("proof show 3", "state: running", actor=handed_in.story.agent)
    assert not any("failed" in line for line in handed_in.worker_lines()), handed_in.worker_lines()
    handed_in.end_test(handed_in.started[1], 1)
    failures = [line for line in handed_in.worker_lines() if "failed" in line]
    assert len(failures) == 1, failures
    assert all(text in failures[0] for text in (TEST_LINE, OTHER_TEST_LINE, str(handed_in.started[0]), str(handed_in.started[1]))), failures


def test_a_failure_on_an_earlier_task_puts_the_worktree_on_that_task(first_failed):
    assert first_failed.worktree_task() == 1
    expect_task_state(first_failed, 1, "started")


def test_a_failure_on_the_last_task_only_puts_the_worktree_on_the_last_task(last_failed):
    assert last_failed.worktree_task() == 3
    expect_task_state(last_failed, 3, "started")
    last_failed.story.expect_text("proof show 1", "state: checked", actor=last_failed.story.agent)


def test_after_a_failure_a_plain_test_run_passes_with_no_request(first_failed):
    expect_reply_allowed(first_failed.run_test())
    assert first_failed.run_requests() == ()


def test_the_flag_after_a_failure_is_refused_with_no_need_to_ask(both_failed):
    expect_reply_refusal(both_failed.run_test(asking_main(TEST_LINE, "the rounding")), "need not ask")


def test_after_the_next_hand_in_a_plain_test_run_is_refused_again(first_failed):
    first_failed.story.expect_success("worker deliver", actor=first_failed.worker)
    expect_reply_refusal(first_failed.run_test(), FLAG)


def test_the_second_hand_in_runs_only_what_failed_and_what_passed_stays_checked(first_failed):
    first_failed.repository.changed(first_failed.worker.id, "cart.py", "TOTAL = 4\n")
    first_failed.story.expect_success("worker deliver", actor=first_failed.worker)
    first_failed.story.expect_text("proof show 1", "state: running", actor=first_failed.story.agent)
    first_failed.story.expect_text("proof show 3", "state: checked", actor=first_failed.story.agent)
    assert len(first_failed.started) == 3 and first_failed.started_processes()[2].line == TEST_LINE, first_failed.started


def test_several_failed_tasks_all_go_to_testing_at_the_next_hand_in(both_failed):
    both_failed.story.expect_success("worker deliver", actor=both_failed.worker)
    expect_task_state(both_failed, 1, "testing")
    expect_task_state(both_failed, 3, "testing")


def test_worker_next_is_the_hand_in_after_a_failure_when_the_next_task_is_in_another_phase(whole_plan_failed):
    whole_plan_failed.story.expect_text("worker next", "queued", actor=whole_plan_failed.worker)
    assert whole_plan_failed.started_processes()[-1].line == TEST_LINE
    whole_plan_failed.end_test(whole_plan_failed.started[-1])
    assert whole_plan_failed.current_task() == 4


def test_a_failed_selected_test_counts_as_a_failure(selected_tests_handed_in):
    selected_tests_handed_in.end_tests(0, 0)
    picker = selected_tests_handed_in.started[2]
    selected_tests_handed_in.story.container.get(OutputFolder).write_output(picker, 1, "tests/other.py\n")
    selected_tests_handed_in.end_test(picker)
    selected = selected_tests_handed_in.started[3]
    selected_tests_handed_in.end_test(selected, 1)
    assert any(str(selected) in line for line in selected_tests_handed_in.worker_lines()), selected_tests_handed_in.worker_lines()
    expect_reply_allowed(selected_tests_handed_in.run_test())
