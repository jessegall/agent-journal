from tests.stories.core.support.agent_labels import agent_number
from datetime import timedelta

import pytest

from core.modules.processes.support.queued_process_launch import QueuedProcessLaunch
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.held_tasks import holding_worker, prove_task, unplanned_holding_worker
from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, PHASE_DISPATCH, PLAN_DISPATCH, TEST_LINE, start_planned_worker
from tests.stories.suites.coding.modules.workers.support.work_setting_stories import set_resume_limit

MAIN_SESSION = "s-1"
PROCESS_START = "2026-10-31T09:00:00+00:00"
BUILD_TASKS = 3


def expect_open_undelegated(worker, *task_ids: int) -> None:
    for task_id in task_ids:
        worker.story.expect_text(f"task show {task_id}", "state: open", actor=worker.story.agent)
        worker.story.expect_no_text(f"task show {task_id}", f"delegated_to: {worker.worker.id}", actor=worker.story.agent)


@pytest.fixture
def advanced_worker(new_story, monkeypatch):
    """A worker of phase Build that started task 2 beside task 1 and committed task 1: task 2 is its started task."""
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
    worker.story.run("task start 2", actor=worker.worker)
    worker.prove_commit()
    return worker


@pytest.fixture
def program_ended(advanced_worker):
    advanced_worker.story.advance(timedelta(minutes=5))
    advanced_worker.story.run(f"agent edit {agent_number(advanced_worker.story, advanced_worker.worker.id)} --pid 700 --process-started-at {PROCESS_START}")
    advanced_worker.story.use_processes()
    return advanced_worker


@pytest.fixture
def handoff_worker(advanced_worker, monkeypatch):
    monkeypatch.setattr(QueuedProcessLaunch, "start", lambda _launch, _start, _run: None)
    advanced_worker.prove()
    advanced_worker.story.expect_text("worker commit --differences none", "command accepted", actor=advanced_worker.worker)
    advanced_worker.story.advance(timedelta(minutes=5))
    advanced_worker.story.run(f"agent edit {agent_number(advanced_worker.story, advanced_worker.worker.id)} --pid 700 --process-started-at {PROCESS_START}")
    advanced_worker.story.use_processes()
    return advanced_worker


@pytest.fixture
def phase_delivered(new_story, monkeypatch):
    """A worker of phase Build that started its three tasks, proved each with a test and committed them together."""
    worker = holding_worker(new_story, monkeypatch, BUILD_TASKS)
    for task_id, test_line in ((1, TEST_LINE), (2, SECOND_TEST_LINE), (3, TEST_LINE)):
        prove_task(worker, task_id, 1, test_line)
    worker.story.run(COMMIT, actor=worker.worker)
    return worker


@pytest.fixture
def ended_during_tests(new_story, monkeypatch):
    """A worker of three tasks in no plan committed them together, the first and the third with a test, and
    its program ended while the tests run."""
    worker = unplanned_holding_worker(new_story, monkeypatch, BUILD_TASKS)
    for task_id, test_line in ((1, TEST_LINE), (2, ""), (3, SECOND_TEST_LINE)):
        prove_task(worker, task_id, 1, test_line)
    worker.story.run(COMMIT, actor=worker.worker)
    worker.story.run(f"agent edit {agent_number(worker.story, worker.worker.id)} --pid 700 --process-started-at {PROCESS_START}")
    worker.story.use_processes()
    return worker


def test_a_worker_waiting_on_the_tests_of_its_commit_is_not_told_to_go_on(ended_during_tests):
    ended_during_tests.story.tick(MAIN_SESSION)
    ended_during_tests.story.expect_text("proof show 1", "state: running", actor=ended_during_tests.story.agent)
    ended_during_tests.story.expect_rows(not any("stopped with" in line for line in ended_during_tests.main_agent_lines()))
    ended_during_tests.story.expect_rows(not any("tasks left" in line for line in ended_during_tests.worker_lines()))


@pytest.fixture
def ended_during_interim_tests(new_story, monkeypatch):
    """A worker of three tasks in no plan committed the first two, the first with a test, and its program
    ended while that test runs; task 3 is started and has no proof."""
    worker = unplanned_holding_worker(new_story, monkeypatch, BUILD_TASKS)
    prove_task(worker, 1, 1, TEST_LINE)
    prove_task(worker, 2, 1)
    worker.story.run(COMMIT, actor=worker.worker)
    worker.story.run(f"agent edit {agent_number(worker.story, worker.worker.id)} --pid 700 --process-started-at {PROCESS_START}")
    worker.story.use_processes()
    return worker


def test_a_worker_that_ended_while_its_tests_run_and_holds_a_started_task_is_told_to_go_on_with_it(ended_during_interim_tests):
    worker = ended_during_interim_tests
    worker.story.tick(MAIN_SESSION)
    WorkerResumeRetry()(worker.story.container)
    worker.story.expect_text(f"worker status {agent_number(worker.story, worker.worker.id)}", "Point: build", actor=worker.story.agent)
    worker.story.expect_rows(any("you ended with tasks left, task:3" in line for line in worker.worker_lines()), detail=str(worker.worker_lines()))


def test_a_worker_that_ended_while_its_commit_runs_leaves_no_stopped_line(handoff_worker):
    worker = handoff_worker
    worker.story.expect_text(f"worker status {agent_number(worker.story, worker.worker.id)}", "Point: commit", actor=worker.story.agent)
    worker.story.tick(MAIN_SESSION)
    worker.story.expect_rows(not any("stopped with" in line or "ended with" in line for line in worker.main_agent_lines()), detail=str(worker.main_agent_lines()))


def test_after_its_limit_a_worker_that_ended_names_its_tasks_left_and_the_committed_one_that_is_not_merged(program_ended):
    set_resume_limit(program_ended.story.container, 0)
    program_ended.story.expect_success("setting set journal.suites.coding.workers.merger-on false --project", actor=program_ended.story.user)
    program_ended.story.tick(MAIN_SESSION)
    number = agent_number(program_ended.story, program_ended.worker.id)
    program_ended.story.expect_text(f"agent-line list --agent {program_ended.story.agent.id}", f"worker:{number} ended with task:2, task:3 left", f"the code of task:1 of worker:{number} is committed and is not merged")


@pytest.mark.parametrize("fixture, reason", [("advanced_worker", "the plan changed"), ("phase_delivered", "the tests take too long")], ids=["in the middle of a phase", "after the hand-in"])
def test_a_release_leaves_the_unfinished_tasks_open_and_not_delegated(request, fixture, reason):
    worker = request.getfixturevalue(fixture)
    worker.story.expect_success(f'worker release {agent_number(worker.story, worker.worker.id)} "{reason}"', actor=worker.story.agent)
    expect_open_undelegated(worker, 1, 2, 3)


def test_a_release_leaves_a_task_with_all_its_proofs_checked_as_it_is(advanced_worker):
    advanced_worker.story.expect_success("proof check 1", actor=advanced_worker.story.agent)
    advanced_worker.story.expect_success(f'worker release {agent_number(advanced_worker.story, advanced_worker.worker.id)} "the plan is done with"', actor=advanced_worker.story.agent)
    advanced_worker.story.expect_no_text("task show 1", "state: open", actor=advanced_worker.story.agent)
    expect_open_undelegated(advanced_worker, 2, 3)


def test_after_a_release_the_plan_can_be_handed_to_another_worker(advanced_worker):
    advanced_worker.story.expect_success(f'worker release {agent_number(advanced_worker.story, advanced_worker.worker.id)} "another will take it"', actor=advanced_worker.story.agent)
    advanced_worker.story.expect_rows(advanced_worker.added_worker(PLAN_DISPATCH).current_task() == 1)
