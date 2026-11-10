import pytest

from engine.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine

from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, PLAN_DISPATCH, SECOND_TEST_LINE, TEST_LINE, start_planned_worker, unplanned_worker
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator

BATCH_SETTING = "setting set journal.suites.coding.workers.test-batch-size 2 --environment main"
RUNS_SETTING = "setting set journal.suites.coding.workers.worker-phase-test-runs 5 --environment main"


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
def last_of_phase(phase_worker):
    phase_worker.prove_advance(TEST_LINE)
    phase_worker.prove_advance(SECOND_TEST_LINE)
    phase_worker.prove(TEST_LINE)
    return phase_worker


@pytest.fixture
def handed_in(last_of_phase):
    last_of_phase.story.run("worker deliver --wait --differences none", actor=last_of_phase.worker)
    return last_of_phase


@pytest.fixture
def failed_group(handed_in):
    handed_in.end_tests(1, 0, 0)
    return handed_in


@pytest.fixture
def proven(phase_worker):
    phase_worker.prove()
    return phase_worker


@pytest.fixture
def advanced(phase_worker):
    phase_worker.prove_advance()
    return phase_worker


@pytest.fixture
def single_test_run(phase_worker):
    phase_worker.run_test()
    return phase_worker


@pytest.fixture
def plan_last_task(plan_worker):
    plan_worker.prove_advance(TEST_LINE)
    plan_worker.prove_advance()
    return plan_worker


@pytest.fixture
def plan_handed_in(plan_last_task):
    return plan_last_task, plan_last_task.prove_advance(SECOND_TEST_LINE)


@pytest.fixture
def asking(phase_worker):
    phase_worker.story.expect_success('wait stuck "the plan is unclear"', actor=phase_worker.worker)
    return phase_worker


@pytest.fixture
def handed_in_and_asking(handed_in):
    handed_in.story.expect_success('wait stuck "the plan is unclear"', actor=handed_in.worker)
    return handed_in


@pytest.fixture
def fixed_group(failed_group):
    failed_group.prove(TEST_LINE)
    failed_group.story.run("worker deliver --wait --differences none", actor=failed_group.worker)
    return failed_group


@pytest.fixture
def batch_worker(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.story.expect_success(BATCH_SETTING, actor=worker.story.user)
    return worker


@pytest.fixture
def clashed(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story, real_git=True)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("cart.py", "TOTAL = 2\n", "Another total")
    story.expect_text(f"worker merge --wait {worker.id}", "clashed on cart.py", actor=story.agent)
    return story, worker, repository


def test_the_last_proven_task_of_a_phase_with_the_next_phase_queued_hands_in_with_next(plan_last_task):
    plan_last_task.prove(SECOND_TEST_LINE)
    expect_step(plan_last_task, "group-end", "journal worker next")


def test_a_batch_has_the_same_points_as_a_phase(batch_worker):
    expect_step(batch_worker, "build")
    batch_worker.prove()
    expect_step(batch_worker, "task-proven", "journal worker next")
    batch_worker.story.run("worker next --wait --differences none", actor=batch_worker.worker)
    batch_worker.prove()
    expect_step(batch_worker, "group-end", "journal worker deliver")


def test_a_task_outside_any_group_hands_in_with_next_while_more_are_queued(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.prove(TEST_LINE)
    expect_step(worker, "group-end", "journal worker next")


def test_the_run_allowance_follows_its_setting(phase_worker):
    phase_worker.story.expect_success(RUNS_SETTING, actor=phase_worker.story.user)
    phase_worker.story.expect_text("worker status", "Own test runs left: 5", actor=phase_worker.worker)


def test_a_worker_outside_a_group_has_no_limit_on_its_own_runs(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.story.expect_text("worker status", "Own test runs left: no limit", actor=worker.worker)


def test_the_json_status_holds_the_point_and_the_counts(phase_worker):
    status = phase_worker.status_json()
    phase_worker.story.expect_rows(status["step"] == "build", status["open_task_count"] == 3, status["test_runs_available"] == 3, status["group"] == "phase:1", status["guidance"] == phase_worker.status_line())


def test_the_main_agent_reads_the_same_line_as_the_worker(phase_worker):
    main_view = phase_worker.story.run(f"worker status {phase_worker.worker.id}", actor=phase_worker.story.agent).output_text
    phase_worker.story.expect_rows(main_view.splitlines()[0] == phase_worker.status_line())


def test_worker_next_with_the_next_task_at_once_speaks_in_the_same_voice(proven):
    outcome = proven.story.run("worker next --wait --differences none", actor=proven.worker)
    proven.story.expect_rows("your next task, task 2" in outcome.output_text, detail=outcome.output_text)
    expect_voice(proven, outcome.output_text)


def test_worker_deliver_says_what_status_says(last_of_phase):
    outcome = last_of_phase.story.run("worker deliver --wait --differences none", actor=last_of_phase.worker)
    expect_voice(last_of_phase, outcome.output_text)


def test_the_failed_tests_line_outside_a_phase_says_what_status_says(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.prove(TEST_LINE)
    worker.story.run("worker next --wait --differences none", actor=worker.worker)
    worker.end_tests(1)
    expect_voice(worker, next(line for line in worker.worker_lines() if "tests failed" in line))


def test_the_next_task_line_says_what_status_says(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.prove(TEST_LINE)
    worker.story.run("worker next --wait --differences none", actor=worker.worker)
    worker.end_tests(0)
    expect_voice(worker, next(line for line in worker.worker_lines() if "Your next task is" in line))


def test_a_clash_names_the_clashed_files_at_status_and_in_its_line(clashed):
    story, worker, repository = clashed
    status = story.run("worker status", actor=worker).output_text
    story.expect_rows("Point: conflict" in status, "cart.py" in status.splitlines()[0], "journal worker deliver" in status.splitlines()[0], detail=status)
    lines = [line.text for line in story.container.get(Queries).query(AgentLine).filter(session_agent_id=worker.id).all_rows() if "clashes on" in line.text]
    story.expect_rows(bool(lines), all("Now:" in line and "Then:" in line for line in lines), detail=str(lines))


def test_a_clash_settled_and_delivered_is_no_longer_a_clash(clashed):
    story, worker, repository = clashed
    story.expect_rows("Point: conflict" in story.run("worker status", actor=worker).output_text)
    repository.changed(worker.id, "cart.py", "TOTAL = 3\n")
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.expect_rows("Point: conflict" not in story.run("worker status", actor=worker).output_text)


def test_an_answered_ask_returns_the_worker_to_its_point(phase_worker):
    wait = phase_worker.story.new_row_id('wait stuck "the plan is unclear"', actor=phase_worker.worker)
    phase_worker.story.expect_success(f"wait end {wait}", actor=phase_worker.worker)
    expect_step(phase_worker, "build")
