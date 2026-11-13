import pytest

from suites.coding.modules.workers.models.enums.proof_state import ProofState
from tests.stories.suites.coding.modules.workers.support.held_tasks import worker_with_tasks, proofs, prove_task
from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, TEST_LINE, StoryWorker

FOUR_POINT_BRIEF = 'task edit 1 --brief "- the total adds the tax\n- the total rounds to cents\n- the total is shown\n- the total is stored"'
BLOCK_REASON = "the tax table is not there"


@pytest.fixture
def task_worker(new_story, monkeypatch) -> StoryWorker:
    """A worker of phase Build that holds task 1 started; tasks 2 and 3 are its next ones."""
    return worker_with_tasks(new_story, monkeypatch, 1)


@pytest.fixture
def two_tasks(new_story, monkeypatch) -> StoryWorker:
    """A worker of phase Build that holds tasks 1 and 2 started, task 1 the one it works on."""
    return worker_with_tasks(new_story, monkeypatch, 2)


@pytest.fixture
def four_points(task_worker) -> StoryWorker:
    """The brief of task 1 has four points."""
    task_worker.story.expect_success(FOUR_POINT_BRIEF, actor=task_worker.story.agent)
    return task_worker


def test_1_a_proof_of_a_started_task_the_worker_is_not_working_on_is_registered_and_starts_no_test(two_tasks):
    outcome = prove_task(two_tasks, 2, 1, TEST_LINE)
    two_tasks.story.run_listeners()
    two_tasks.story.expect_text("task show 2", "state: started", actor=two_tasks.story.agent)
    two_tasks.story.expect_rows(outcome.code == 0, "current task" not in outcome.output_text, [(proof.task_id, proof.state) for proof in proofs(two_tasks)] == [(2, ProofState.SHOWN)],
                                two_tasks.started == [], detail=outcome.output_text)


def test_2_a_proof_of_a_task_the_worker_has_not_started_is_refused_with_the_line_that_starts_it(task_worker):
    refused = prove_task(task_worker, 2, 1)
    task_worker.story.expect_text("task show 2", "state: open", actor=task_worker.story.agent)
    task_worker.story.expect_rows(refused.code != 0, "task 2 is not started" in refused.output_text, "journal task start 2" in refused.output_text, proofs(task_worker) == (), detail=refused.output_text)


def test_3_a_proof_of_a_task_that_was_not_given_to_the_worker_is_refused(task_worker):
    receipts = task_worker.story.new_row_id('task make "Receipts" --environment main', actor=task_worker.story.agent)
    refused = prove_task(task_worker, receipts, 1)
    task_worker.story.expect_rows(refused.code != 0, f"task {receipts} is not yours" in refused.output_text, proofs(task_worker) == (), detail=refused.output_text)


def test_4_a_proof_of_a_blocked_task_is_refused_with_what_the_task_waits_for(two_tasks):
    two_tasks.story.expect_success(f'task block 2 --reason "{BLOCK_REASON}"', actor=two_tasks.story.agent)
    refused = prove_task(two_tasks, 2, 1)
    two_tasks.story.expect_rows(refused.code != 0, "task 2 is blocked" in refused.output_text, BLOCK_REASON in refused.output_text, proofs(two_tasks) == (), detail=refused.output_text)


def test_5_a_proof_of_a_point_past_the_points_of_the_brief_is_refused(four_points):
    refused = prove_task(four_points, 1, 5)
    last_point = prove_task(four_points, 1, 4)
    four_points.story.expect_text("proof show 1", "point: 4", actor=four_points.story.agent)
    four_points.story.expect_rows(refused.code != 0, "task 1's brief has 4 points, not 5" in refused.output_text, last_point.code == 0, len(proofs(four_points)) == 1, detail=refused.output_text)


def test_6_7_the_proofs_of_one_task_are_registered_in_any_order_with_or_without_a_test_and_none_is_judged(four_points):
    outcomes = [prove_task(four_points, 1, point, test_line) for point, test_line in ((3, TEST_LINE), (1, ""), (2, SECOND_TEST_LINE))]
    four_points.story.run_listeners()
    listed = four_points.story.run("proof list", actor=four_points.story.agent).output_text
    four_points.story.expect_rows(all(outcome.code == 0 for outcome in outcomes), [(proof.point, bool(proof.test_command)) for proof in proofs(four_points)] == [(3, True), (1, False), (2, True)],
                                  listed.count("shown") == 3, four_points.started == [], detail=listed)


def test_8_a_shown_proof_is_corrected_by_a_second_proof_of_its_point_and_by_an_edit(task_worker):
    prove_task(task_worker, 1, 1, TEST_LINE)
    repeated = prove_task(task_worker, 1, 1, SECOND_TEST_LINE)
    after_second = proofs(task_worker)[0]
    edited = task_worker.story.run('proof edit 1 "cart.py:2, the rounded total" --task 1', actor=task_worker.worker)
    after_edit = proofs(task_worker)[0]
    task_worker.story.expect_rows(repeated.code == 0, edited.code == 0, "totals.py" in after_second.test_command, after_edit.text == "cart.py:2, the rounded total",
                               after_edit.state is ProofState.SHOWN, len(proofs(task_worker)) == 1, detail=f"{repeated.output_text} | {edited.output_text}")


def test_9_a_proof_of_a_point_that_is_checked_is_refused(four_points):
    prove_task(four_points, 1, 2)
    four_points.story.expect_success("proof check 1", actor=four_points.story.agent)
    refused = prove_task(four_points, 1, 2)
    four_points.story.expect_rows(refused.code != 0, "point 2 is checked already" in refused.output_text, "prove the points that are not" in refused.output_text, detail=refused.output_text)


def test_11_five_proofs_of_three_tasks_each_answer_at_once_with_the_count_of_shown_proofs_and_their_tasks(new_story, monkeypatch):
    worker = worker_with_tasks(new_story, monkeypatch, 3)
    worker.story.expect_success(FOUR_POINT_BRIEF, actor=worker.story.agent)
    outcomes = [prove_task(worker, task_id, point, TEST_LINE) for task_id, point in ((1, 1), (1, 2), (2, 1), (3, 1), (1, 3))]
    worker.story.expect_rows(all(outcome.code == 0 and "registered" in outcome.output_text for outcome in outcomes), "5 proofs are staged for tasks 1, 2, 3" in outcomes[-1].output_text,
                             worker.started == [], detail=outcomes[-1].output_text)
