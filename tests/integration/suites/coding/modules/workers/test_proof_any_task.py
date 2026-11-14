import pytest

from suites.coding.modules.workers.models.enums.proof_state import ProofState
from tests.stories.suites.coding.modules.workers.support.held_tasks import worker_with_tasks, proofs, prove_task
from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, TEST_LINE, StoryWorker

FOUR_POINT_BRIEF = 'task edit 1 --brief "- the total adds the tax\n- the total rounds to cents\n- the total is shown\n- the total is stored"'
BLOCK_REASON = "the tax table is not there"


@pytest.fixture
def task_worker(played, monkeypatch) -> StoryWorker:
    """A worker of phase Build that holds task 1 started; tasks 2 and 3 are its next ones."""
    return worker_with_tasks(played, monkeypatch, 1)


@pytest.fixture
def two_tasks(played, monkeypatch) -> StoryWorker:
    """A worker of phase Build that holds tasks 1 and 2 started, task 1 the one it works on."""
    return worker_with_tasks(played, monkeypatch, 2)


@pytest.fixture
def four_points(task_worker) -> StoryWorker:
    """The brief of task 1 has four points."""
    task_worker.story.expect_success(FOUR_POINT_BRIEF, actor=task_worker.story.agent)
    return task_worker


















def test_11_five_proofs_of_three_tasks_each_answer_at_once_with_the_count_of_shown_proofs_and_their_tasks(played, monkeypatch):
    worker = worker_with_tasks(played, monkeypatch, 3)
    worker.story.expect_success(FOUR_POINT_BRIEF, actor=worker.story.agent)
    outcomes = [prove_task(worker, task_id, point, TEST_LINE) for task_id, point in ((1, 1), (1, 2), (2, 1), (3, 1), (1, 3))]
    worker.story.expect_rows(all(outcome.code == 0 and "registered" in outcome.output_text for outcome in outcomes), "5 proofs are staged for tasks 1, 2, 3" in outcomes[-1].output_text,
                             worker.started == [], detail=outcomes[-1].output_text)
