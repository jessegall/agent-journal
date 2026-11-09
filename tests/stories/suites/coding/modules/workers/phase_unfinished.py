from datetime import timedelta

import pytest

from core.modules.processes.support.queued_process_launch import QueuedProcessLaunch
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
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
    advanced_worker.story.advance(timedelta(minutes=5))
    advanced_worker.story.run(f"agent edit {advanced_worker.worker.id} --pid 700 --process-started-at {PROCESS_START}")
    advanced_worker.story.use_processes()
    return advanced_worker


@pytest.fixture
def handoff_worker(advanced_worker, monkeypatch):
    monkeypatch.setattr(QueuedProcessLaunch, "start", lambda _launch, _start, _run: None)
    advanced_worker.prove()
    advanced_worker.story.expect_text("worker next --differences none", "command accepted", actor=advanced_worker.worker)
    advanced_worker.story.advance(timedelta(minutes=5))
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


def test_a_worker_whose_tests_are_running_is_not_restarted_while_it_holds_a_started_task(ended_during_tests):
    worker = ended_during_tests
    worker.story.expect_success("task start 4", actor=worker.worker)
    worker.story.expect_text(f"worker status {worker.worker.id}", "Point: wait", actor=worker.story.agent)
    worker.story.tick(MAIN_SESSION)
    WorkerResumeRetry()(worker.story.container)
    worker.story.expect_rows(not any("tasks left" in line for line in worker.worker_lines()), detail=str(worker.worker_lines()))


def test_a_worker_that_ended_while_its_hand_in_runs_leaves_no_stopped_line(handoff_worker):
    worker = handoff_worker
    worker.story.expect_text(f"worker status {worker.worker.id}", "Current phase: phase 1 (Build)", actor=worker.story.agent)
    worker.story.tick(MAIN_SESSION)
    worker.story.expect_rows(not any("stopped with" in line or "ended with" in line for line in worker.main_agent_lines()), detail=str(worker.main_agent_lines()))


def test_after_its_limit_a_worker_that_ended_names_its_tasks_those_in_testing_included(program_ended, monkeypatch):
    monkeypatch.setattr("suites.coding.modules.workers.support.worker_job.RESUME_LIMIT_COUNT", 0)
    program_ended.story.expect_success("setting set journal.suites.coding.workers.merger-on false --project", actor=program_ended.story.user)
    program_ended.story.tick(MAIN_SESSION)
    program_ended.story.expect_text(f"agent-line list --agent {program_ended.story.agent.id}", f"worker:{program_ended.worker.id} ended with task:1, task:2, task:3 left")


@pytest.mark.parametrize("fixture, reason", [("advanced_worker", "the plan changed"), ("phase_delivered", "the tests take too long")], ids=["in the middle of a phase", "after the hand-in"])
def test_a_release_leaves_the_unfinished_tasks_open_and_not_delegated(request, fixture, reason):
    worker = request.getfixturevalue(fixture)
    worker.story.expect_success(f'worker release {worker.worker.id} "{reason}"', actor=worker.story.agent)
    expect_open_undelegated(worker, 1, 2, 3)


def test_a_release_leaves_a_task_with_all_its_proofs_checked_as_it_is(advanced_worker):
    advanced_worker.story.expect_success("proof check 1", actor=advanced_worker.story.agent)
    advanced_worker.story.expect_success(f'worker release {advanced_worker.worker.id} "the plan is done with"', actor=advanced_worker.story.agent)
    advanced_worker.story.expect_no_text("task show 1", "state: open", actor=advanced_worker.story.agent)
    expect_open_undelegated(advanced_worker, 2, 3)


def test_after_a_release_the_plan_can_be_handed_to_another_worker(advanced_worker):
    advanced_worker.story.expect_success(f'worker release {advanced_worker.worker.id} "another will take it"', actor=advanced_worker.story.agent)
    advanced_worker.story.expect_rows(advanced_worker.added_worker(PLAN_DISPATCH).current_task() == 1)
