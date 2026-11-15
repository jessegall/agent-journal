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
from suites.coding.modules.workers.agent_messages.worker_committed_unmerged_message import WorkerCommittedUnmergedMessage
from engine.testing.expectations.expected_message import expected_agent_message

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
def group_worker(new_story) -> StoryWorker:
    """A worker of a started plan that started the three tasks of phase Build and committed tasks 1 and 2 in an
    interim commit, the first proved with a test; it has proved the last task 3 with a test and not committed it."""
    worker = worker_with_tasks(new_story, BUILD_TASKS)
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






def test_164_the_merge_takes_a_worktree_of_committed_proofs_in_a_started_plan_and_refuses_one_with_an_unchecked_proof_of_no_test(committed_worker):
    story = committed_worker.story
    refused = merge(committed_worker)
    story.expect_rows(refused.code != 0, "point 1 is not committed or checked" in refused.output_text, detail=refused.output_text)
    story.run(CHECK_UNTESTED_PROOF, actor=story.agent)
    merged = merge(committed_worker)
    story.expect_rows(merged.code == 0, proof_states(committed_worker)[3] == COMMITTED, detail=merged.output_text)
    committed_worker.repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", CART_CHANGE)


def test_164_the_merge_refuses_a_worktree_of_a_started_plan_with_a_short_proof(committed_worker):
    story = committed_worker.story
    story.run('proof short 1 "the point is not shown"', actor=story.agent)
    refused = merge(committed_worker)
    story.expect_rows(refused.code != 0, proof_states(committed_worker)[1] == "short", detail=refused.output_text)


def test_165_a_merged_task_of_a_started_plan_is_completed_with_its_proofs_still_committed(merged_worker):
    story = merged_worker.story
    for task_id in (1, 2, 3):
        story.expect_text(f"task show {task_id}", "state: completed", MERGED_REASON, actor=story.agent)
    story.expect_rows(proof_states(merged_worker)[1] == COMMITTED, detail=str(proof_states(merged_worker)))


def test_165_a_task_that_waits_on_a_committed_task_can_start_once_that_task_is_merged(committed_worker):
    story = committed_worker.story
    story.run("task depend 4 --on 1", actor=story.agent)
    waiting = story.run("task start 4", actor=story.agent)
    story.run(CHECK_UNTESTED_PROOF, actor=story.agent)
    merge(committed_worker)
    started = story.run("task start 4", actor=story.agent)
    story.expect_rows(waiting.code != 0, started.code == 0, detail=f"{waiting.output_text} | {started.output_text}")






def test_239_a_worker_that_stops_with_committed_tasks_that_are_not_merged_has_them_named(group_worker):
    group_worker.story.end_session(group_worker.worker)
    lines = " | ".join(group_worker.main_agent_lines())
    group_worker.story.expect_rows(expected_agent_message(WorkerCommittedUnmergedMessage.declared(), tasks='task:1, task:2', worker=2).matches_text(lines), detail=lines)


def test_a_committed_proof_is_shown_again_when_its_worker_proves_the_same_point_again(committed_worker):
    story = committed_worker.story
    story.expect_rows(proof_states(committed_worker)[1] == COMMITTED, detail=str(proof_states(committed_worker)))
    story.expect_success('proof make 1 --task 1 "cart.py:2, the cart total after the clash"', actor=committed_worker.worker)
    story.expect_rows(proof_states(committed_worker)[1] == "shown", detail=str(proof_states(committed_worker)))
