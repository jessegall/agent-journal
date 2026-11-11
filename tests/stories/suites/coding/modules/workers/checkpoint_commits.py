import importlib
import json

import pytest

from engine.actor.actor import Actor
from engine.command.bus import Bus
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, SECOND_TEST_LINE, TEST_LINE, StoryWorker, start_planned_worker, unplanned_worker

COMMITTED = "committed"
CHECKPOINT_WORDS = "tests run at the checkpoint of phase 2, when tasks 4 are in"
MERGE_WAIT_WORDS = "committed: the merger merges; tests run at the checkpoint"
MERGED_REASON = "merged; its tests run at the checkpoint of phase 2"
UPGRADE_COMMAND = "suites.coding.modules.workers.commands.commit_shown_proofs.commit_shown_proofs"


def proof_states(worker: StoryWorker) -> dict[int, str]:
    rows = json.loads(worker.story.run("proof list --json --oldest --limit 20", actor=worker.story.agent).output_text)["rows"]
    return {row["task_id"]: row["state"] for row in rows}


def merge(worker: StoryWorker):
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


def test_161_a_proof_with_a_test_waits_as_committed_and_one_with_no_test_waits_for_the_main_agents_check(committed_worker):
    states = proof_states(committed_worker)
    committed_worker.story.expect_rows(states[1] == COMMITTED, states[3] == COMMITTED, states[2] != COMMITTED, detail=str(states))


def test_162_a_commit_with_a_missing_proof_is_refused_in_a_started_plan_as_outside_one(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
    outcome = worker.story.run("worker next --wait --differences none", actor=worker.worker)
    worker.story.expect_rows(outcome.code != 0, "proof" in outcome.output_text, proof_states(worker) == {}, detail=outcome.output_text)


def test_159_163_a_final_commit_makes_the_worktree_ready_to_merge_and_the_status_names_the_merge_and_the_checkpoint(committed_worker):
    row, status = worktree_row(committed_worker), committed_worker.status()
    committed_worker.story.expect_rows(row.get("merge_ready_at") is not None, MERGE_WAIT_WORDS in status, CHECKPOINT_WORDS in status, detail=f"{row} | {status}")


def test_164_the_merge_takes_a_worktree_of_committed_proofs_in_a_started_plan_and_refuses_one_with_a_short_proof(committed_worker):
    story = committed_worker.story
    story.run('proof short 1 "the point is not shown"', actor=story.agent)
    refused = merge(committed_worker)
    story.expect_rows(refused.code != 0, "proof" in refused.output_text, detail=refused.output_text)
    committed_worker.edit_prove(TEST_LINE)
    story.run(COMMIT, actor=committed_worker.worker)
    merged = merge(committed_worker)
    story.expect_rows(merged.code == 0, proof_states(committed_worker)[3] == COMMITTED, detail=merged.output_text)


def test_165_a_merged_task_of_a_started_plan_is_completed_with_its_proofs_still_committed(merged_worker):
    story = merged_worker.story
    for task_id in (1, 2, 3):
        story.expect_text(f"task show {task_id}", "state: completed", MERGED_REASON, actor=story.agent)
    story.expect_rows(proof_states(merged_worker)[1] == COMMITTED, detail=str(proof_states(merged_worker)))


def test_166_a_task_in_no_plan_is_not_merged_before_its_tests_passed(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.prove(TEST_LINE)
    refused = merge(worker)
    worker.story.expect_rows(refused.code != 0, COMMITTED not in proof_states(worker).values(), detail=refused.output_text)


def test_203_the_upgrade_commits_the_shown_proofs_of_a_task_in_testing_in_a_started_plan(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
    worker.prove_advance(TEST_LINE)
    command = importlib.import_module(UPGRADE_COMMAND).CommitShownProofs()
    worker.story.container.get(Bus).run(command, Actor.core(), environment_id=1)
    worker.story.expect_text("task show 1", "state: testing", actor=worker.story.agent)
    worker.story.expect_rows(proof_states(worker)[1] == COMMITTED, worker.started == [], detail=str(proof_states(worker)))


def test_239_a_worker_that_stops_with_committed_tasks_that_are_not_merged_has_them_named(committed_worker):
    committed_worker.story.run(f"agent end {committed_worker.worker.id}", actor=committed_worker.worker)
    lines = " | ".join(committed_worker.main_agent_lines())
    committed_worker.story.expect_rows("task:1" in lines, "is not merged" in lines, detail=lines)
