import pytest

from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, PHASE_DISPATCH, PLAN_DISPATCH, TEST_LINE, worker_on_plan

MAIN_SESSION = "s-1"
PROCESS_START = "2026-10-31T09:00:00+00:00"


def expect_open_undelegated(worker, *task_ids: int) -> None:
    for task_id in task_ids:
        worker.story.expect_text(f"task show {task_id}", "state: open", actor=worker.story.agent)
        worker.story.expect_no_text(f"task show {task_id}", f"delegated_to: {worker.worker.id}", actor=worker.story.agent)


@pytest.fixture
def moved_on(new_story, monkeypatch):
    worker = worker_on_plan(new_story, monkeypatch, PHASE_DISPATCH)
    worker.prove_and_move_on()
    return worker


@pytest.fixture
def program_ended(moved_on):
    moved_on.story.run(f"agent edit {moved_on.worker.id} --pid 700 --process-started-at {PROCESS_START}")
    moved_on.story.use_processes()
    return moved_on


@pytest.fixture
def phase_handed_in(new_story, monkeypatch):
    worker = worker_on_plan(new_story, monkeypatch, PHASE_DISPATCH)
    worker.prove_and_move_on(TEST_LINE)
    worker.prove_and_move_on(SECOND_TEST_LINE)
    worker.prove(TEST_LINE)
    worker.story.run("worker deliver --differences none", actor=worker.worker)
    return worker


@pytest.fixture
def ended_during_tests(new_story, monkeypatch):
    worker = worker_on_plan(new_story, monkeypatch)
    worker.prove_and_move_on(TEST_LINE)
    worker.prove_and_move_on()
    worker.prove_and_move_on(SECOND_TEST_LINE)
    worker.story.run(f"agent edit {worker.worker.id} --pid 700 --process-started-at {PROCESS_START}")
    worker.story.use_processes()
    return worker


def test_a_worker_waiting_on_the_tests_of_its_hand_in_is_not_told_to_go_on(ended_during_tests):
    ended_during_tests.story.tick(MAIN_SESSION)
    ended_during_tests.story.expect_text("proof show 1", "state: running", actor=ended_during_tests.story.agent)
    ended_during_tests.story.expect_rows(not any("stopped with" in line for line in ended_during_tests.main_agent_lines()))
    ended_during_tests.story.expect_rows(not any("tasks left" in line for line in ended_during_tests.worker_lines()))


def test_a_worker_that_ended_in_a_phase_is_started_again_as_today(program_ended):
    program_ended.story.tick(MAIN_SESSION)
    program_ended.story.expect_rows(any("stopped with" in line and "started again" in line for line in program_ended.main_agent_lines()))


def test_after_its_limit_a_worker_that_ended_names_its_tasks_those_in_testing_included(program_ended, monkeypatch):
    monkeypatch.setattr("suites.coding.modules.workers.listeners.ended_worker_listener.RESUME_LIMIT_COUNT", 0)
    program_ended.story.tick(MAIN_SESSION)
    program_ended.story.expect_text(f"agent-line list --agent {program_ended.story.agent.id}", f"worker:{program_ended.worker.id} ended with task:1, task:2, task:3 left")


def test_worker_status_shows_the_phase_and_what_waits_for_its_end(moved_on):
    moved_on.story.expect_text(f"worker status {moved_on.worker.id}", "Current phase: phase 1 (Build)", "Tasks waiting for its end: 1", actor=moved_on.story.agent)


def test_a_release_in_the_middle_of_a_phase_leaves_its_unfinished_tasks_open_and_not_delegated(moved_on):
    moved_on.story.expect_success(f'worker release {moved_on.worker.id} "the plan changed"', actor=moved_on.story.agent)
    expect_open_undelegated(moved_on, 1, 2, 3)


def test_a_release_after_the_hand_in_leaves_the_tasks_with_tests_running_open_and_not_delegated(phase_handed_in):
    phase_handed_in.story.expect_success(f'worker release {phase_handed_in.worker.id} "the tests take too long"', actor=phase_handed_in.story.agent)
    expect_open_undelegated(phase_handed_in, 1, 2, 3)


def test_a_release_leaves_a_task_with_all_its_proofs_checked_as_it_is(moved_on):
    moved_on.story.expect_success("proof check 1", actor=moved_on.story.agent)
    moved_on.story.expect_success(f'worker release {moved_on.worker.id} "the plan is done with"', actor=moved_on.story.agent)
    moved_on.story.expect_no_text("task show 1", "state: open", actor=moved_on.story.agent)
    expect_open_undelegated(moved_on, 2, 3)


def test_a_release_in_the_middle_of_a_phase_keeps_the_branch(moved_on):
    branch = moved_on.repository.worker_branch(moved_on.worker.id)
    tip = moved_on.repository.tip(branch)
    moved_on.story.expect_success(f'worker release {moved_on.worker.id} "keep it"', actor=moved_on.story.agent)
    moved_on.repository.expect_branch_tip(branch, tip)


def test_after_a_release_the_plan_can_be_handed_to_another_worker(moved_on):
    moved_on.story.expect_success(f'worker release {moved_on.worker.id} "another will take it"', actor=moved_on.story.agent)
    moved_on.story.expect_rows(moved_on.added_worker(PLAN_DISPATCH).current_task() == 1)
