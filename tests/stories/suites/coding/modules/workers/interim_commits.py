import json
from pathlib import Path

import pytest

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.suites.coding.modules.workers.checkpoint_runs import merge
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.held_tasks import worker_with_tasks, prove_task, unplanned_worker_with_tasks
from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, TEST_LINE, StoryWorker

THREE_TASKS = 3
CHECKPOINT_TERMS = "tests run at the checkpoint of phase 2"
CHECKPOINT_TASKS_TERMS = f"{CHECKPOINT_TERMS}, when tasks 4 are in"
LEFT_OUT_WORDS = "task 3 is not part of this commit: it has no proof"
INTERIM_TERMS = "Interim: go on with task 3"
FINAL_TERMS = "Final: your work is handed in, stop and wait"
MERGED_REASON = "merged; its tests run at the checkpoint of phase 2"


def prove_first_two(worker: StoryWorker) -> StoryWorker:
    prove_task(worker, 1, 1, TEST_LINE)
    prove_task(worker, 2, 1, SECOND_TEST_LINE)
    return worker


def interim_commit(worker: StoryWorker) -> StoryWorker:
    worker.story.run(COMMIT, actor=worker.worker)
    worker.story.run_listeners()
    return worker


def worktree(worker: StoryWorker) -> dict[str, object]:
    rows = json.loads(worker.story.run("worker-worktree list --json", actor=worker.story.agent).output_text)["rows"]
    return next(row for row in rows if row["session_agent_id"] == worker.worker.id)


@pytest.fixture
def two_of_three_proved(new_story, monkeypatch) -> StoryWorker:
    """A worker that holds tasks 1, 2 and 3 started, in no plan, and proved tasks 1 and 2 with a test each."""
    return prove_first_two(unplanned_worker_with_tasks(new_story, monkeypatch, THREE_TASKS))


@pytest.fixture
def two_of_three_proved_in_plan(new_story, monkeypatch) -> StoryWorker:
    """A worker of phase Build of a started plan that holds tasks 1, 2 and 3 started and proved tasks 1 and 2
    with a test each."""
    return prove_first_two(worker_with_tasks(new_story, monkeypatch, THREE_TASKS))


@pytest.fixture
def interim(two_of_three_proved) -> StoryWorker:
    """Outside a plan, tasks 1 and 2 are committed and their tests run; task 3 is started and has no proof."""
    return interim_commit(two_of_three_proved)


@pytest.fixture
def interim_in_plan(two_of_three_proved_in_plan) -> StoryWorker:
    """In a started plan, tasks 1 and 2 are committed; task 3 is started and has no proof."""
    return interim_commit(two_of_three_proved_in_plan)


def test_39_44_a_commit_of_two_of_three_tasks_outside_a_plan_is_named_interim_tests_them_and_leaves_the_worktree_cut(two_of_three_proved):
    outcome = two_of_three_proved.story.run(COMMIT, actor=two_of_three_proved.worker)
    two_of_three_proved.story.run_listeners()
    two_of_three_proved.story.expect_text("task show 3", "state: started", actor=two_of_three_proved.story.agent)
    two_of_three_proved.story.expect_rows(outcome.code == 0, f"{INTERIM_TERMS}; tests run in the background" in outcome.output_text, worktree(two_of_three_proved)["state"] == "cut", len(two_of_three_proved.started) == 2,
                                          detail=outcome.output_text)


def test_39_a_commit_of_two_of_three_tasks_in_a_started_plan_names_the_checkpoint_and_starts_no_test(two_of_three_proved_in_plan):
    worker = two_of_three_proved_in_plan
    outcome = worker.story.run(COMMIT, actor=worker.worker)
    worker.story.run_listeners()
    worker.story.expect_text("proof list", "committed", actor=worker.story.agent)
    worker.story.expect_rows(outcome.code == 0, "go on with task 3" in outcome.output_text, CHECKPOINT_TERMS in outcome.output_text, LEFT_OUT_WORDS in outcome.output_text,
                             worktree(worker)["state"] == "cut", worker.started == [],
                             detail=outcome.output_text)


@pytest.mark.real_git
def test_40_a_file_changed_after_the_commit_is_not_in_the_checkout_the_tests_run_on(interim):
    interim.repository.changed(interim.worker.id, "task_3.txt", "point 1\n")
    folders = [Path(process.folder) for process in interim.started_processes()]
    interim.story.expect_rows(len(folders) == 2, all((folder / "task_1.txt").is_file() for folder in folders), not any((folder / "task_3.txt").exists() for folder in folders), detail=str(folders))


def test_41_the_tasks_of_an_interim_commit_in_a_started_plan_stay_in_testing_until_the_merge_after_the_final_commit_completes_them(interim_in_plan):
    interim_in_plan.story.expect_text("proof list", "committed", actor=interim_in_plan.story.agent)
    interim_in_plan.story.expect_text("task show 1", "state: testing", actor=interim_in_plan.story.agent)
    prove_task(interim_in_plan, 3, 1, TEST_LINE)
    interim_in_plan.story.expect_success(COMMIT, actor=interim_in_plan.worker)
    merge(interim_in_plan)
    for task_id in (1, 2, 3):
        interim_in_plan.story.expect_text(f"task show {task_id}", "state: completed", MERGED_REASON, actor=interim_in_plan.story.agent)
    interim_in_plan.story.expect_rows(interim_in_plan.started == [], detail=f"started: {interim_in_plan.started}")


def test_45_a_worker_with_a_started_task_that_has_no_proof_may_not_stop_and_one_whose_last_commit_is_tested_may(interim):
    interim.end_all_tests()
    interim.story.expect_hook_refusal(interim.session, HookSamples.stop(), "Task 3 is not finished")
    prove_task(interim, 3, 1, TEST_LINE)
    interim.story.expect_success(COMMIT, actor=interim.worker)
    interim.story.expect_hook_allowed(interim.session, HookSamples.stop())
