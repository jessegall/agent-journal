import json

import pytest

from suites.coding.modules.workers.ticks.stalled_worker_test_runs import StalledWorkerTestRuns
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.stopped_with_tasks import MERGER_ON
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, SECOND_TEST_LINE, TEST_LINE, StoryWorker, file_proof_line, start_planned_worker, unplanned_worker

COMMITTED = "committed"
CHECKPOINT_WORDS = "tests run at the checkpoint of phase 2, when tasks 4 are in"
MERGE_WAIT_WORDS = "committed: the merger merges; tests run at the checkpoint"
MERGED_REASON = "merged; its tests run at the checkpoint of phase 2"
CHECK_UNTESTED_PROOF = "proof check 2"


def proof_states(worker: StoryWorker) -> dict[int, str]:
    rows = json.loads(worker.story.run("proof list --json --oldest --limit 20", actor=worker.story.agent).output_text)["rows"]
    return {row["task_id"]: row["state"] for row in rows}


def merge(worker: StoryWorker):
    worker.repository.checkout(ENVIRONMENT_BRANCH)
    worker.story.run(f"worker logs {agent_number(worker.story, worker.worker.id)}", actor=worker.story.agent)
    return worker.story.run(f"worker merge --wait {agent_number(worker.story, worker.worker.id)}", actor=worker.story.agent)


def worktree_row(worker: StoryWorker) -> dict[str, object]:
    rows = json.loads(worker.story.run("worker-worktree list --json", actor=worker.story.agent).output_text)["rows"]
    return next(row for row in rows if row["session_agent_id"] == worker.worker.id)


@pytest.fixture
def group_worker(new_story, monkeypatch) -> StoryWorker:
    """A worker of a started plan that proved tasks 1 and 2 of phase Build, the first with a test, and has proved
    the last task 3 with a test; nothing is committed yet."""
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
    worker.prove_advance(TEST_LINE)
    worker.prove_advance()
    worker.prove(SECOND_TEST_LINE)
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


def test_158_a_commit_in_a_started_plan_says_committed_names_the_checkpoint_of_its_tests_and_starts_no_test(group_worker):
    outcome = group_worker.story.run(COMMIT, actor=group_worker.worker)
    group_worker.story.expect_rows(outcome.code == 0, COMMITTED in outcome.output_text, CHECKPOINT_WORDS in outcome.output_text, group_worker.started == [],
                                   detail=f"{outcome.output_text} started: {group_worker.started}")


def test_160_a_commit_of_a_task_in_no_plan_starts_its_test_as_before(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.prove_advance(TEST_LINE)
    worker.story.run_listeners()
    worker.story.expect_rows(len(worker.started) == 1, COMMITTED not in proof_states(worker).values(), detail=f"started: {worker.started}, proofs: {proof_states(worker)}")


def test_162_a_commit_with_a_missing_proof_is_refused_in_a_started_plan_as_outside_one(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
    outcome = worker.story.run("worker next --wait --differences none", actor=worker.worker)
    worker.story.expect_rows(outcome.code != 0, "proof" in outcome.output_text, proof_states(worker) == {}, detail=outcome.output_text)


def test_159_161_163_a_final_commit_commits_the_proofs_with_a_test_and_makes_the_worktree_ready_to_merge(committed_worker):
    row, status, states = worktree_row(committed_worker), committed_worker.status(), proof_states(committed_worker)
    committed_worker.story.expect_rows(row.get("merge_ready_at") is not None, MERGE_WAIT_WORDS in status, CHECKPOINT_WORDS in status, detail=f"{row} | {status}")
    committed_worker.story.expect_rows(states[1] == COMMITTED, states[3] == COMMITTED, states[2] != COMMITTED, detail=str(states))


def test_163_a_final_commit_in_a_started_plan_with_the_merger_on_says_the_committed_work_can_be_merged(group_worker):
    story = group_worker.story
    story.expect_success(MERGER_ON, actor=story.user)
    story.run(COMMIT, actor=group_worker.worker)
    story.run_listeners()
    lines = " | ".join(group_worker.main_agent_lines())
    story.expect_rows("the work of worker:2 is committed and can be merged" in lines, "all pass" not in lines, detail=lines)


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


def test_166_a_task_in_no_plan_is_not_merged_before_its_tests_passed(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.prove(TEST_LINE)
    refused = merge(worker)
    worker.story.expect_rows(refused.code != 0, COMMITTED not in proof_states(worker).values(), detail=refused.output_text)


def test_203_the_sweep_of_waiting_tests_commits_a_shown_proof_of_a_task_in_testing_in_a_started_plan_and_starts_no_test(group_worker):
    story = group_worker.story
    story.run('proof short 1 "the total is missing"', actor=story.agent)
    story.run(f'proof make 1 --task 1 "cart.py:1, the cart story and the total" --test "{file_proof_line(TEST_LINE)}"', actor=group_worker.worker)
    edited_state = proof_states(group_worker)[1]
    StalledWorkerTestRuns()(story.container)
    story.expect_text("task show 1", "state: testing", actor=story.agent)
    story.expect_rows(edited_state == "shown", proof_states(group_worker)[1] == COMMITTED, group_worker.started == [], detail=f"{edited_state}, {proof_states(group_worker)}")


def test_a_committed_proof_of_a_started_plan_is_left_as_it_is_by_three_sweeps_of_waiting_tests(committed_worker):
    for _ in range(3):
        StalledWorkerTestRuns()(committed_worker.story.container)
    states = proof_states(committed_worker)
    committed_worker.story.expect_rows(states[1] == COMMITTED, states[3] == COMMITTED, committed_worker.started == [], detail=f"{states}, started: {committed_worker.started}")


def test_239_a_worker_that_stops_with_committed_tasks_that_are_not_merged_has_them_named(group_worker):
    group_worker.story.run(f"agent end {group_worker.worker.id}", actor=group_worker.worker)
    lines = " | ".join(group_worker.main_agent_lines())
    group_worker.story.expect_rows("the code of task:1, task:2 of worker:2 is committed and is not merged" in lines, detail=lines)
