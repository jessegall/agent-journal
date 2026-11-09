import pytest

from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, PHASE_DISPATCH, PLAN_DISPATCH, TEST_LINE, start_planned_worker

MAIN_SESSION = "s-1"
PROCESS_START = "2026-10-31T09:00:00+00:00"


def expect_open_undelegated(worker, *task_ids: int) -> None:
    for task_id in task_ids:
        worker.story.expect_text(f"task show {task_id}", "state: open", actor=worker.story.agent)
        worker.story.expect_no_text(f"task show {task_id}", f"delegated_to: {worker.worker.id}", actor=worker.story.agent)


@pytest.fixture
def advanced_worker(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
    worker.prove_advance()
    return worker


@pytest.fixture
def program_ended(advanced_worker):
    advanced_worker.story.run(f"agent edit {advanced_worker.worker.id} --pid 700 --process-started-at {PROCESS_START}")
    advanced_worker.story.use_processes()
    return advanced_worker


@pytest.fixture
def phase_delivered(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
    worker.prove_advance(TEST_LINE)
    worker.prove_advance(SECOND_TEST_LINE)
    worker.prove(TEST_LINE)
    worker.story.run("worker deliver --wait --differences none", actor=worker.worker)
    return worker


@pytest.fixture
def ended_during_tests(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    worker.prove_advance(TEST_LINE)
    worker.prove_advance()
    worker.prove_advance(SECOND_TEST_LINE)
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
    monkeypatch.setattr("suites.coding.modules.workers.support.worker_job.RESUME_LIMIT_COUNT", 0)
    program_ended.story.expect_success("setting set journal.suites.coding.workers.merger-on false --project", actor=program_ended.story.user)
    program_ended.story.tick(MAIN_SESSION)
    program_ended.story.expect_text(f"agent-line list --agent {program_ended.story.agent.id}", f"worker:{program_ended.worker.id} ended with task:1, task:2, task:3 left")


def test_worker_status_shows_the_phase_and_what_waits_for_its_end(advanced_worker):
    advanced_worker.story.expect_text(f"worker status {advanced_worker.worker.id}", "Current phase: phase 1 (Build)", "Tasks waiting for its end: 1", actor=advanced_worker.story.agent)


def test_a_release_in_the_middle_of_a_phase_leaves_its_unfinished_tasks_open_and_not_delegated(advanced_worker):
    advanced_worker.story.expect_success(f'worker release {advanced_worker.worker.id} "the plan changed"', actor=advanced_worker.story.agent)
    expect_open_undelegated(advanced_worker, 1, 2, 3)


def test_a_release_after_the_hand_in_leaves_the_tasks_with_tests_running_open_and_not_delegated(phase_delivered):
    phase_delivered.story.expect_success(f'worker release {phase_delivered.worker.id} "the tests take too long"', actor=phase_delivered.story.agent)
    expect_open_undelegated(phase_delivered, 1, 2, 3)


def test_a_release_leaves_a_task_with_all_its_proofs_checked_as_it_is(advanced_worker):
    advanced_worker.story.expect_success("proof check 1", actor=advanced_worker.story.agent)
    advanced_worker.story.expect_success(f'worker release {advanced_worker.worker.id} "the plan is done with"', actor=advanced_worker.story.agent)
    advanced_worker.story.expect_no_text("task show 1", "state: open", actor=advanced_worker.story.agent)
    expect_open_undelegated(advanced_worker, 2, 3)


def test_a_release_in_the_middle_of_a_phase_keeps_the_branch(advanced_worker):
    branch = advanced_worker.repository.worker_branch(advanced_worker.worker.id)
    tip = advanced_worker.repository.tip(branch)
    advanced_worker.story.expect_success(f'worker release {advanced_worker.worker.id} "keep it"', actor=advanced_worker.story.agent)
    advanced_worker.repository.expect_branch_tip(branch, tip)


def test_after_a_release_the_plan_can_be_handed_to_another_worker(advanced_worker):
    advanced_worker.story.expect_success(f'worker release {advanced_worker.worker.id} "another will take it"', actor=advanced_worker.story.agent)
    advanced_worker.story.expect_rows(advanced_worker.added_worker(PLAN_DISPATCH).current_task() == 1)
