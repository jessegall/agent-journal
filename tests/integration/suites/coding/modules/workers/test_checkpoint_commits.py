from tests.stories.suites.coding.modules.workers.test_queue import recording_launch
from tests.stories.suites.coding.modules.workers.support.commit_command import request_merge
import json

import pytest

from suites.coding.modules.workers.ticks.worker_tests.stalled_worker_test_runs import StalledWorkerTestRuns
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.held_tasks import worker_with_tasks, prove_task
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, SECOND_TEST_LINE, TEST_LINE, StoryWorker, start_planned_worker, unplanned_worker
from suites.coding.modules.workers.support.worker_nudges import WORKER_COMMITTED_UNMERGED
from engine.testing.expectations.expected_nudge import expected_nudge

COMMITTED = "committed"
BUILD_TASKS = 3
CHECKPOINT_TERMS = "tests run at the checkpoint of phase 2, when tasks 4 are in"
MERGE_WAIT_TERMS = "committed: the merger merges; tests run at the checkpoint"
MERGED_REASON = "merged; its tests run at the checkpoint of phase 2"
CHECK_UNTESTED_PROOF = "proof check 2"


def proof_states(worker: StoryWorker) -> dict[int, str]:
    rows = json.loads(worker.story.run("proof list --json --oldest --limit 20", actor=worker.story.agent).output_text)["rows"]
    return {row["task_id"]: row["state"] for row in rows}


def merge(worker: StoryWorker):
    worker.repository.checkout(ENVIRONMENT_BRANCH)
    request_merge(worker.story, worker.worker)
    worker.story.run(f"worker logs {agent_number(worker.story, worker.worker.id)}", actor=worker.story.agent)
    return worker.story.run(f"worker merge --wait {agent_number(worker.story, worker.worker.id)}", actor=worker.story.agent)


def worktree_row(worker: StoryWorker) -> dict[str, object]:
    rows = json.loads(worker.story.run("worker-worktree list --json", actor=worker.story.agent).output_text)["rows"]
    return next(row for row in rows if row["session_agent_id"] == worker.worker.id)


@pytest.fixture
def group_worker(played) -> StoryWorker:
    """A worker of a started plan that started the three tasks of phase Build and committed tasks 1 and 2 in an
    interim commit, the first proved with a test; it has proved the last task 3 with a test and not committed it."""
    worker = worker_with_tasks(played, BUILD_TASKS)
    worker.repository.changed(worker.worker.id, "cart.py", CART_CHANGE)
    prove_task(worker, 1, 1, TEST_LINE)
    prove_task(worker, 2, 1)
    worker.story.run(COMMIT, actor=worker.worker)
    prove_task(worker, 3, 1, SECOND_TEST_LINE)
    return worker


@pytest.fixture
def committed_worker(group_worker) -> StoryWorker:
    group_worker.story.run(COMMIT, actor=group_worker.worker)
    group_worker.story.run_listeners()
    return group_worker


@pytest.fixture
def merged_worker(committed_worker) -> StoryWorker:
    committed_worker.story.run(CHECK_UNTESTED_PROOF, actor=committed_worker.story.agent)
    merge(committed_worker)
    committed_worker.story.run_listeners()
    return committed_worker


# the commit's test launch is built where a bound stand-in does not reach, so this test patches the class itself
def test_160_a_commit_of_a_task_in_no_plan_starts_its_test_as_before(played, monkeypatch):
    worker = unplanned_worker(played)
    started = recording_launch(monkeypatch)
    worker.prove_commit(TEST_LINE)
    worker.story.run_listeners()
    worker.story.expect_rows(len(started) == 1, COMMITTED not in proof_states(worker).values(), detail=f"started: {started}, proofs: {proof_states(worker)}")


def test_162_a_commit_with_a_missing_proof_is_refused_in_a_started_plan_as_outside_one(played):
    worker = start_planned_worker(played, PHASE_DISPATCH)
    outcome = worker.story.run(COMMIT, actor=worker.worker)
    worker.story.expect_rows(outcome.code != 0, "proof" in outcome.output_text, proof_states(worker) == {}, detail=outcome.output_text)










def test_166_a_task_in_no_plan_is_not_merged_before_its_tests_passed(played):
    worker = unplanned_worker(played)
    worker.prove(TEST_LINE)
    refused = merge(worker)
    worker.story.expect_rows(refused.code != 0, COMMITTED not in proof_states(worker).values(), detail=refused.output_text)


def test_a_committed_proof_of_a_started_plan_is_left_as_it_is_by_three_sweeps_of_waiting_tests(committed_worker):
    for _ in range(3):
        StalledWorkerTestRuns()(committed_worker.story.container)
    states = proof_states(committed_worker)
    committed_worker.story.expect_rows(states[1] == COMMITTED, states[3] == COMMITTED, committed_worker.started == [], detail=f"{states}, started: {committed_worker.started}")




