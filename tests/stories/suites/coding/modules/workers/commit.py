import pytest

from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, FIRST_PROOF, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, StoryWorker, unplanned_worker

COMMIT = "worker commit --wait --differences none"
TESTED_PROOF = 'proof make 1 --task 1 "cart.py:1, the cart total story" --test "python tests/cart.py"'
LEFT_OUT = "the rounding is left out"


@pytest.fixture
def proved(new_story, monkeypatch) -> StoryWorker:
    """A worker of a task in no plan that changed the cart and proved the one point of its task with a test;
    nothing is committed."""
    worker = unplanned_worker(new_story, monkeypatch)
    worker.prove(TEST_LINE)
    return worker


def test_24_a_commit_of_a_proved_task_says_committed_queues_its_tests_and_puts_the_task_in_testing(proved):
    outcome = proved.story.run(COMMIT, actor=proved.worker)
    proved.story.run_listeners()
    proved.story.expect_text("task show 1", "state: testing", actor=proved.story.agent)
    proved.story.expect_rows(outcome.code == 0, "committed task 1 as " in outcome.output_text, len(proved.started) == 1, detail=outcome.output_text)


def test_25_the_commit_in_git_is_named_for_its_task_and_carries_the_worker(proved):
    proved.story.expect_success(COMMIT, actor=proved.worker)
    proved.repository.expect_commit(proved.repository.worker_branch(proved.worker.id), "task 1: Fix the cart", f"Journal: worker worker-{proved.worker.id}")


def test_26_a_proof_starts_no_test_before_the_commit(proved):
    proved.story.run_listeners()
    proved.story.expect_text("proof show 1", "state: shown", actor=proved.story.agent)
    proved.story.expect_rows(proved.started == [], detail=f"started: {proved.started}")


def test_29_a_commit_asks_for_the_differences_and_what_differs_becomes_an_important_log_line(proved):
    asked = proved.story.run("worker commit --wait", actor=proved.worker)
    proved.story.expect_success(f'worker commit --wait --differences "{LEFT_OUT}"', actor=proved.worker)
    proved.story.expect_text("task-log list --task 1", LEFT_OUT, actor=proved.story.agent)
    proved.story.expect_rows(asked.code != 0, "did you do anything other than the task brief asked" in asked.output_text, detail=asked.output_text)


def test_34_a_commit_of_a_worktree_with_no_change_is_refused_and_the_hint_names_the_differences(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    base_commit = repository.tip(ENVIRONMENT_BRANCH)
    worker = dispatched_worker(story)
    story.expect_success(FIRST_PROOF, "point: 1", actor=worker)
    refused = story.run(COMMIT, actor=worker)
    repository.expect_branch_tip(repository.worker_branch(worker.id), base_commit)
    story.expect_rows(refused.code != 0, "your worktree has no change" in refused.output_text, "--differences" in refused.output_text, detail=refused.output_text)


def test_35_a_commit_with_no_proof_at_all_is_refused_as_nothing_staged(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    refused = story.run(COMMIT, actor=worker)
    story.expect_rows(refused.code != 0, "nothing is staged" in refused.output_text, "journal proof make" in refused.output_text, detail=refused.output_text)
