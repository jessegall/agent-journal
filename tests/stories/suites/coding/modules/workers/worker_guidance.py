from tests.stories.core.support.agent_labels import agent_number
import pytest

from engine.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine

from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.held_tasks import holding_worker, prove_task, unplanned_holding_worker
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, PLAN_DISPATCH, SECOND_TEST_LINE, TEST_LINE, start_planned_worker, unplanned_worker
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator

TEST_ROWS_REASON = "the test reads every row it checks"

RUNS_SETTING = "setting set journal.suites.coding.workers.worker-phase-test-runs 5 --environment main"
BUILD_TASKS = 3


def now_of(line: str) -> str:
    return line.split("Now:", 1)[1].split("Then:", 1)[0].strip()


def expect_voice(worker, line: str) -> None:
    status_line = worker.status_line()
    worker.story.expect_rows("Now:" in line, "Then:" in line, now_of(line) == now_of(status_line), detail=f"{line}\n{status_line}")


def expect_step(worker, step: str, *status_parts: str) -> str:
    status = worker.status()
    worker.story.expect_rows(f"Point: {step}" in status, *(word in status.splitlines()[0] for word in status_parts), detail=status)
    return status.splitlines()[0]


@pytest.fixture
def phase_worker(new_story, monkeypatch):
    return start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)


@pytest.fixture
def plan_worker(new_story, monkeypatch):
    return start_planned_worker(new_story, monkeypatch, PLAN_DISPATCH)


@pytest.fixture
def last_of_phase(new_story, monkeypatch):
    """A worker of phase Build that started its three tasks and proved each with a test; nothing is committed."""
    worker = holding_worker(new_story, monkeypatch, BUILD_TASKS)
    for task_id, test_line in ((1, TEST_LINE), (2, SECOND_TEST_LINE), (3, TEST_LINE)):
        prove_task(worker, task_id, 1, test_line)
    return worker


@pytest.fixture
def proven(phase_worker):
    phase_worker.prove()
    return phase_worker


@pytest.fixture
def clashed(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story, real_git=True)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("cart.py", "TOTAL = 2\n", "Another total")
    story.expect_text(f"worker merge --wait {agent_number(story, worker.id)}", "clashed on cart.py", actor=story.agent)
    return story, worker, repository


def test_a_proven_task_of_a_started_plan_is_committed_with_worker_commit_and_tested_at_the_checkpoint(plan_worker):
    plan_worker.prove(SECOND_TEST_LINE)
    expect_step(plan_worker, "commit", "journal worker commit", "checkpoint")


def test_a_proven_task_in_no_plan_is_committed_with_worker_commit_and_tested_on_the_commit(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.prove(TEST_LINE)
    expect_step(worker, "commit", "journal worker commit", "tests it on your commit")


def test_the_run_allowance_follows_its_setting(phase_worker):
    phase_worker.story.expect_success(RUNS_SETTING, actor=phase_worker.story.user)
    phase_worker.story.expect_text("worker status", "Own test runs left: 5", actor=phase_worker.worker)


def test_a_worker_of_a_task_in_no_plan_has_the_same_count_of_its_own_runs(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.story.expect_text("worker status", "Own test runs left: 3", actor=worker.worker)


def test_the_json_status_holds_the_point_and_the_counts(phase_worker):
    status = phase_worker.status_json()
    phase_worker.story.expect_rows(status["step"] == "build", status["open_task_count"] == 1, status["test_runs_available"] == 3, status["commit_window"] == "commit:1:1:0", status["guidance"] == phase_worker.status_line())


def test_the_main_agent_reads_the_same_line_as_the_worker(phase_worker):
    main_view = phase_worker.story.run(f"worker status {agent_number(phase_worker.story, phase_worker.worker.id)}", actor=phase_worker.story.agent).output_text
    phase_worker.story.expect_rows(main_view.splitlines()[0] == phase_worker.status_line())


def test_an_interim_commit_in_a_started_plan_says_what_status_says(proven):
    proven.story.run("task start 2", actor=proven.worker)
    outcome = proven.story.run(COMMIT, actor=proven.worker)
    proven.story.expect_rows("go on with task 2" in outcome.output_text, detail=outcome.output_text)
    expect_voice(proven, outcome.output_text)


def test_the_failed_tests_line_outside_a_phase_says_what_status_says(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.prove_commit(TEST_LINE)
    worker.story.run_listeners()
    worker.end_tests(1)
    expect_voice(worker, next(line for line in worker.worker_lines() if "tests failed" in line))


def test_the_passed_tests_line_of_an_interim_commit_says_what_status_says(new_story, monkeypatch):
    worker = unplanned_holding_worker(new_story, monkeypatch)
    prove_task(worker, 1, 1, TEST_LINE)
    worker.story.run(COMMIT, actor=worker.worker)
    worker.story.run_listeners()
    worker.end_tests(0)
    expect_voice(worker, next(line for line in worker.worker_lines() if "the tests of your commit passed" in line))


def test_a_clash_names_the_clashed_files_at_status_and_in_its_line(clashed):
    story, worker, repository = clashed
    status = story.run("worker status", actor=worker).output_text
    story.expect_rows("Point: conflict" in status, "cart.py" in status.splitlines()[0], "journal worker commit" in status.splitlines()[0], detail=status)
    lines = [line.text for line in story.container.get(Queries).query(AgentLine).filter(session_agent_id=worker.id).every_row(TEST_ROWS_REASON) if "clashes on" in line.text]
    story.expect_rows(bool(lines), all("Now:" in line and "Then:" in line for line in lines), detail=str(lines))


def test_an_answered_ask_returns_the_worker_to_its_point(phase_worker):
    wait = phase_worker.story.new_row_id('wait stuck "the plan is unclear"', actor=phase_worker.worker)
    phase_worker.story.expect_success(f"wait end {wait}", actor=phase_worker.worker)
    expect_step(phase_worker, "build")
