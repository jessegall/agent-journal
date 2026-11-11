import pytest

from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.held_tasks import prove_task, unplanned_holding_worker
from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, TEST_LINE, StoryWorker

THREE_TASKS = 3
TWO_POINT_BRIEF = 'task edit 1 --brief "- the total adds the tax\n- the total rounds to cents"'
SHORTFALL = "the rounding has no test"
CLOSING_LINE = "task close"


def commit(worker: StoryWorker) -> StoryWorker:
    worker.story.run(COMMIT, actor=worker.worker)
    worker.story.run_listeners()
    return worker


def expect_task_states(worker: StoryWorker, state: str, *task_ids: int) -> None:
    for task_id in task_ids:
        worker.story.expect_text(f"task show {task_id}", f"state: {state}", actor=worker.story.agent)


@pytest.fixture
def two_started(new_story, monkeypatch) -> StoryWorker:
    """A worker that holds tasks 1 and 2 started, in no plan."""
    return unplanned_holding_worker(new_story, monkeypatch)


@pytest.fixture
def two_untested_committed(two_started) -> StoryWorker:
    """Both tasks are committed, each with one proof that has no test: proofs 1 and 2 wait for a check."""
    prove_task(two_started, 1, 1)
    prove_task(two_started, 2, 1)
    return commit(two_started)


@pytest.fixture
def two_tested_committed(two_started) -> StoryWorker:
    """Both tasks are committed, each with one proof that has a test, and the two tests run."""
    prove_task(two_started, 1, 1, TEST_LINE)
    prove_task(two_started, 2, 1, SECOND_TEST_LINE)
    return commit(two_started)


@pytest.fixture
def three_started(new_story, monkeypatch) -> StoryWorker:
    """A worker that holds tasks 1, 2 and 3 started, in no plan."""
    return unplanned_holding_worker(new_story, monkeypatch, THREE_TASKS)


def test_53_a_task_of_a_commit_is_completed_once_each_of_its_proofs_is_checked_and_not_before(three_started):
    three_started.story.expect_success(TWO_POINT_BRIEF, actor=three_started.story.agent)
    prove_task(three_started, 1, 1, TEST_LINE)
    prove_task(three_started, 1, 2)
    prove_task(three_started, 2, 1, SECOND_TEST_LINE)
    commit(three_started)
    three_started.end_all_tests()
    expect_task_states(three_started, "completed", 2)
    expect_task_states(three_started, "testing", 1)
    three_started.story.expect_success("proof check 2", actor=three_started.story.agent)
    expect_task_states(three_started, "completed", 1)
    expect_task_states(three_started, "started", 3)


def test_55_a_proof_sent_back_short_starts_its_own_task_again_tells_the_worker_and_leaves_the_other_task(two_untested_committed):
    story = two_untested_committed.story
    story.expect_success(f'proof short 1 "{SHORTFALL}"', "state: short", actor=story.agent)
    expect_task_states(two_untested_committed, "started", 1)
    expect_task_states(two_untested_committed, "testing", 2)
    story.expect_rows(any("proof:1 of task:1 is short" in line for line in two_untested_committed.worker_lines()), detail=str(two_untested_committed.worker_lines()))


def test_56_no_line_of_the_status_of_a_worker_closes_a_task_and_its_tasks_are_completed_by_their_checked_proofs(two_started):
    statuses = [two_started.status()]
    prove_task(two_started, 1, 1, TEST_LINE)
    prove_task(two_started, 2, 1, SECOND_TEST_LINE)
    statuses.append(two_started.status())
    commit(two_started)
    statuses.append(two_started.status())
    two_started.end_all_tests()
    expect_task_states(two_started, "completed", 1, 2)
    two_started.story.expect_rows(not any(CLOSING_LINE in status for status in statuses), detail=str(statuses))


def test_54_59_the_main_agent_gets_one_line_for_the_proofs_that_wait_and_its_check_completes_a_task_with_no_test(three_started):
    prove_task(three_started, 1, 1, TEST_LINE)
    prove_task(three_started, 2, 1)
    prove_task(three_started, 3, 1)
    commit(three_started)
    waiting_lines = [line for line in three_started.main_agent_lines() if "waits on your check" in line]
    three_started.end_all_tests()
    for proof_id in (2, 3):
        three_started.story.expect_success(f"proof check {proof_id}", "state: checked", actor=three_started.story.agent)
    expect_task_states(three_started, "completed", 1, 2, 3)
    three_started.story.expect_rows(len(waiting_lines) == 1, "proofs 2 3" in waiting_lines[0], detail=str(three_started.main_agent_lines()))
