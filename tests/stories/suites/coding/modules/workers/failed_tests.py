import pytest

from core.modules.processes.support.output_folder import OutputFolder
from engine.testing.expectations.expect_reply import expect_reply_allowed, expect_reply_refusal
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.held_tasks import prove_task, unplanned_holding_worker
from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, TEST_LINE, StoryWorker
from tests.stories.suites.coding.modules.workers.support.work_setting_stories import apply_work_setting
from suites.coding.modules.workers.support.worker_settings import AFFECTED_TESTS_COMMAND
from suites.coding.modules.workers.support.worker_settings import PROJECT_TEST_COMMAND
from suites.coding.modules.workers.support.worker_settings import WORKER_PHASE_TEST_RUNS

THREE_TASKS = 3
TWO_POINT_BRIEF = 'task edit 1 --brief "- the total adds the tax\n- the total rounds to cents"'
RUNS_SETTING = f"{WORKER_PHASE_TEST_RUNS}"
OUT_OF_RUNS = "No test runs left"
PICKED_TESTS = "tests/other.py\n"


def commit(worker: StoryWorker) -> StoryWorker:
    worker.story.run(COMMIT, actor=worker.worker)
    worker.story.run_listeners()
    return worker


def expect_task_states(worker: StoryWorker, state: str, *task_ids: int) -> None:
    for task_id in task_ids:
        worker.story.expect_text(f"task show {task_id}", f"state: {state}", actor=worker.story.agent)


def expect_proof_states(worker: StoryWorker, state: str, *proof_ids: int) -> None:
    for proof_id in proof_ids:
        worker.story.expect_text(f"proof show {proof_id}", f"state: {state}", actor=worker.story.agent)


@pytest.fixture
def three_started(new_story, monkeypatch) -> StoryWorker:
    """A worker that holds tasks 1, 2 and 3 started, in no plan; task 1 has two points."""
    worker = unplanned_holding_worker(new_story, monkeypatch, THREE_TASKS)
    worker.story.expect_success(TWO_POINT_BRIEF, actor=worker.story.agent)
    return worker


@pytest.fixture
def interim_tested(three_started) -> StoryWorker:
    """Tasks 1 and 2 are committed with proofs 1 and 2 (task 1) and 3 (task 2), and the three tests run;
    task 3 is started and has no proof."""
    for task_id, point in ((1, 1), (1, 2), (2, 1)):
        prove_task(three_started, task_id, point, TEST_LINE)
    return commit(three_started)


@pytest.fixture
def first_failed(interim_tested) -> StoryWorker:
    """The test of proof 1 failed and the tests of proofs 2 and 3 passed."""
    interim_tested.end_tests(1, 0, 0)
    return interim_tested


@pytest.fixture
def two_committed(new_story, monkeypatch) -> StoryWorker:
    """A worker that held tasks 1 and 2, in no plan, proved each with a test and committed both: no task is
    left started and the two tests run."""
    worker = unplanned_holding_worker(new_story, monkeypatch)
    prove_task(worker, 1, 1, TEST_LINE)
    prove_task(worker, 2, 1, SECOND_TEST_LINE)
    return commit(worker)


def test_46_a_failed_test_of_an_interim_commit_makes_its_proof_short_returns_its_task_alone_and_names_the_output(interim_tested):
    interim_tested.end_tests(1, 0, 0)
    expect_proof_states(interim_tested, "short", 1)
    expect_task_states(interim_tested, "started", 1, 3)
    expect_task_states(interim_tested, "completed", 2)
    interim_tested.story.expect_rows(any(f"Your tests failed, output {interim_tested.started[0]}" in line for line in interim_tested.worker_lines()), detail=str(interim_tested.worker_lines()))


def test_47_48_only_the_failed_proof_is_tested_at_the_commit_after_it_is_shown_a_second_time(first_failed):
    first_failed.repository.changed(first_failed.worker.id, "cart.py", "TOTAL = 3\n")
    first_failed.story.expect_success('proof make 1 --task 1 "cart.py:1, the fixed total"', actor=first_failed.worker)
    commit(first_failed)
    expect_proof_states(first_failed, "checked", 2, 3)
    first_failed.story.expect_rows(len(first_failed.started) == 4, detail=f"started: {first_failed.started}")


def test_50_a_failed_run_of_the_selected_tests_returns_the_tasks_of_the_commit_and_names_the_output(new_story, monkeypatch):
    worker = unplanned_holding_worker(new_story, monkeypatch)
    story = worker.story
    story.expect_success(f'setting set {AFFECTED_TESTS_COMMAND} "python3 pick.py" --environment main')
    story.expect_success(f'setting set {PROJECT_TEST_COMMAND} "python3 -m pytest -q" --environment main')
    prove_task(worker, 1, 1, TEST_LINE)
    prove_task(worker, 2, 1, SECOND_TEST_LINE)
    commit(worker)
    worker.end_tests(0, 0)
    story.container.get(OutputFolder).write_output(worker.started[2], 1, PICKED_TESTS)
    worker.end_test(worker.started[2])
    worker.end_test(worker.started[3], 1)
    expect_task_states(worker, "started", 1, 2)
    story.expect_rows(any(f"Your tests failed, output {worker.started[3]}" in line for line in worker.worker_lines()), detail=str(worker.worker_lines()))


def test_51_a_failed_test_of_a_final_commit_returns_the_worktree_and_the_failed_task_and_leaves_the_other_task(two_committed):
    two_committed.end_tests(1, 0)
    two_committed.story.expect_text("worker-worktree show 1", "state: cut", actor=two_committed.story.agent)
    expect_task_states(two_committed, "started", 1)
    two_committed.story.expect_text("task show 2", "state: completed", "its tests passed", actor=two_committed.story.agent)


def test_52_the_test_runs_a_worker_may_start_are_counted_anew_after_an_interim_commit(three_started):
    apply_work_setting(three_started.story, RUNS_SETTING, 1)
    expect_reply_allowed(three_started.run_test())
    expect_reply_refusal(three_started.run_test(), OUT_OF_RUNS)
    prove_task(three_started, 2, 1, SECOND_TEST_LINE)
    three_started.story.expect_success(COMMIT, actor=three_started.worker)
    expect_reply_allowed(three_started.run_test())
    expect_reply_refusal(three_started.run_test(), OUT_OF_RUNS)
