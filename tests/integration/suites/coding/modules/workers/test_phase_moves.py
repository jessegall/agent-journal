import pytest

from engine.testing.expectations.expect_reply import expect_reply_allowed
from engine.testing.examples.hook_samples import HookSamples
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from core.modules.plans.support.task_plans import TaskPlans
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, start_planned_worker

PLAN_BLOCK = 'plan block 1 --reason "the supplier is late"'


@pytest.fixture
def planned_worker(played, monkeypatch):
    return start_planned_worker(played, monkeypatch)


@pytest.fixture
def committed_with_test(planned_worker):
    """A worker of a started plan started task 2 beside task 1 and committed task 1, proved with a test: the
    proof is committed and its test waits for the checkpoint; task 2 is its started task."""
    planned_worker.story.run("task start 2", actor=planned_worker.worker)
    planned_worker.prove_commit(TEST_LINE)
    return planned_worker


def test_a_worker_status_reuses_its_phase_worktree_and_waiting_test_reads(planned_worker):
    story = planned_worker.story
    worktrees = story.container.get(WorktreeQuery)
    proofs = story.container.get(ProofQuery)
    plans = story.container.get(TaskPlans)
    task_id = planned_worker.current_task()
    with story.repeated_work.request():
        worktree = worktrees.worker_worktree(planned_worker.worker.id)
        answers = [(worktrees.worker_worktree(planned_worker.worker.id), worktrees.newest_worktree(planned_worker.worker.id),
                    proofs.tests_waiting(worktree.id), plans.find_phase(task_id)) for _ in range(12)]
    story.expect_rows(all(row[0].id == worktree.id and row[1].id == worktree.id and not row[2] and row[3].id == 1 for row in answers))






