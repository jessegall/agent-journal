import pytest

from engine.query.queries import Queries
from suites.coding.modules.workers.models.affected_test import AffectedTest
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.held_tasks import holding_worker, prove_task
from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, TEST_LINE, StoryWorker, dispatched_story_worker, planned_story, start_planned_worker

PHASE_TEST = "pytest tests/phase.py"
BUILD_TASKS = 3


def proved_phase(worker: StoryWorker, first_test: str = "", last_test: str = "") -> StoryWorker:
    """The worker proves the three tasks of phase Build it has started, the first and the last with the given tests."""
    for task_id, test_line in ((1, first_test), (2, ""), (3, last_test)):
        prove_task(worker, task_id, 1, test_line)
    return worker


def expect_task_states(worker, state: str, *task_ids: int) -> None:
    for task_id in task_ids:
        worker.story.expect_text(f"task show {task_id}", f"state: {state}", actor=worker.story.agent)


@pytest.fixture
def declared_tests(new_story, monkeypatch) -> StoryWorker:
    return proved_phase(holding_worker(new_story, monkeypatch, BUILD_TASKS), TEST_LINE, SECOND_TEST_LINE)


@pytest.fixture
def undeclared_tests(new_story, monkeypatch) -> StoryWorker:
    return proved_phase(holding_worker(new_story, monkeypatch, BUILD_TASKS))


@pytest.fixture
def two_workers(new_story, monkeypatch):
    story = planned_story(new_story)
    first = dispatched_story_worker(story, "worker dispatch --test-command python=pytest --model sonnet 1", monkeypatch)
    return first, first.added_worker("worker dispatch --test-command python=pytest --model sonnet 2 3")


def test_a_worker_cannot_make_a_proof_at_the_point_of_a_phases_own_test(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    worker.story.expect_refusal('proof make 0 --task 1 "cart.py:1, the phase"', "start at 1", actor=worker.worker)


def test_the_phases_own_test_runs_in_the_background_on_the_commit_of_its_last_task_in_a_started_plan(new_story, monkeypatch):
    worker = proved_phase(holding_worker(new_story, monkeypatch, BUILD_TASKS, build_test=PHASE_TEST))
    worker.story.expect_text(COMMIT, "committed tasks 1, 2, 3", actor=worker.worker)
    worker.story.expect_absent("proof list --task 3", PHASE_TEST, actor=worker.story.agent)
    worker.story.expect_rows(PHASE_TEST in [process.line for process in worker.started_processes()], detail=str(worker.started))


def test_no_selected_test_is_queued_at_the_commit_of_a_phase_of_a_started_plan(declared_tests):
    story = declared_tests.story
    story.expect_success('setting set journal.suites.coding.workers.affected-tests-command "python3 pick.py" --environment main')
    story.expect_success('setting set journal.suites.coding.workers.project-test-command "python3 run_tests.py" --environment main')
    story.expect_text(COMMIT, "committed tasks 1, 2, 3", actor=declared_tests.worker)
    story.expect_rows(declared_tests.started == [], not story.container.get(Queries).query(AffectedTest).exists(), detail=f"started: {declared_tests.started}")


def test_two_workers_in_one_phase_each_commit_their_own_tasks(two_workers):
    first, second = two_workers
    first.edit_prove(TEST_LINE)
    first.story.expect_text(COMMIT, "committed", "tests run at the checkpoint of phase 2", actor=first.worker)
    second.story.expect_success("task start 3", actor=second.worker)
    second.edit_prove(SECOND_TEST_LINE)
    second.story.expect_success(COMMIT, actor=second.worker)
    first.story.expect_rows(second.current_task() == 3, first.started == [], detail=f"started: {first.started}")
    expect_task_states(first, "testing", 1, 2)
    expect_task_states(first, "started", 3)


def test_neither_of_two_workers_runs_the_phases_own_test_at_its_commit_in_a_started_plan(new_story, monkeypatch):
    story = planned_story(new_story, build_test=PHASE_TEST)
    first = dispatched_story_worker(story, "worker dispatch --test-command python=pytest --model sonnet 1", monkeypatch)
    second = first.added_worker("worker dispatch --test-command python=pytest --model sonnet 2")
    first.prove()
    first.story.expect_success(COMMIT, actor=first.worker)
    second.prove()
    second.story.expect_success(COMMIT, actor=second.worker)
    story.expect_rows(first.started == [], not any(process.line == PHASE_TEST for process in first.started_processes()), detail=f"started: {first.started}")
