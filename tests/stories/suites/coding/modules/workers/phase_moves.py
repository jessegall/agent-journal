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
def planned_worker(new_story, monkeypatch):
    return start_planned_worker(new_story, monkeypatch)


@pytest.fixture
def committed_with_test(planned_worker):
    """A worker of a started plan started task 2 beside task 1 and committed task 1, proved with a test: the
    proof is committed and its test waits for the checkpoint; task 2 is its started task."""
    planned_worker.story.run("task start 2", actor=planned_worker.worker)
    planned_worker.prove_commit(TEST_LINE)
    return planned_worker




def test_on_a_blocked_plan_a_worker_runs_tests_as_today(committed_with_test):
    committed_with_test.story.expect_success(PLAN_BLOCK, actor=committed_with_test.story.agent)
    expect_reply_allowed(committed_with_test.run_test())


def test_on_a_blocked_plan_the_proofs_committed_earlier_run_at_the_next_commit(committed_with_test):
    committed_with_test.story.expect_success(PLAN_BLOCK, actor=committed_with_test.story.agent)
    committed_with_test.prove()
    committed_with_test.story.expect_success(COMMIT, actor=committed_with_test.worker)
    committed_with_test.story.run_listeners()
    committed_with_test.story.expect_text("proof show 1", "state: running", actor=committed_with_test.story.agent)
    committed_with_test.story.expect_rows(len(committed_with_test.started) == 1)


def test_a_cancelled_plan_cancels_the_workers_tasks_and_the_worker_may_stop(committed_with_test):
    committed_with_test.story.expect_success('plan cancel 1 --reason "the cart is dropped"', actor=committed_with_test.story.agent)
    committed_with_test.story.expect_text("task show 2", "state: cancelled", actor=committed_with_test.story.agent)
    committed_with_test.story.expect_hook_allowed(committed_with_test.session, HookSamples.stop())
