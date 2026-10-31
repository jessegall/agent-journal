from datetime import timedelta

from core.testing.hook_samples import HookSamples
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, checked_worker, delivered_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

MAIN_SESSION = "s-1"


def test_a_checked_worktree_merges_into_the_base_branch_in_the_environments_folder(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: completed")
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", CART_CHANGE)
    repository.expect_merge_commit(ENVIRONMENT_BRANCH)
    repository.expect_head(ENVIRONMENT_BRANCH)


def test_a_worktree_with_a_proof_not_checked_is_refused_its_merge_naming_the_point(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    base_tip = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_refusal(f"worker merge {worker.id}", "point 1 is not checked", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: testing")
    repository.expect_branch_tip(ENVIRONMENT_BRANCH, base_tip)


def test_a_base_branch_that_moved_without_a_clash_is_rebased_onto_and_merged(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("tax.py", "TAX = 21\n", "The tax")
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: completed")
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", CART_CHANGE)
    repository.expect_file(ENVIRONMENT_BRANCH, "tax.py", "TAX = 21\n")


def test_a_base_branch_that_moved_with_a_clash_sends_the_task_back_to_the_worker_with_the_files_and_aborts_the_rebase(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    worker_tip = repository.tip(repository.worker_branch(worker.id))
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("cart.py", "TOTAL = 2\n", "Another total")
    base_tip = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_refusal(f"worker merge {worker.id}", "cart.py", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {worker.id}")
    story.expect_success("worktree show 1", "state: cut")
    story.expect_text(f"agent-line list --agent {worker.id}", "cart.py")
    repository.expect_no_rebase(worker.id)
    repository.expect_branch_tip(repository.worker_branch(worker.id), worker_tip)
    repository.expect_branch_tip(ENVIRONMENT_BRANCH, base_tip)


def test_a_merge_while_the_checkout_is_on_another_branch_moves_nothing_reminds_each_hour_and_goes_through_once_it_is_back(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    base_tip = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_refusal(f"worker merge {worker.id}", "the checkout of environment main is on main, not on version-5; the merge waits until it is back", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: testing")
    story.expect_success("worktree show 1", "state: delivered")
    repository.expect_branch_tip(ENVIRONMENT_BRANCH, base_tip)
    reminder = f"the merge of worker {worker.id} waits for the checkout of environment main to return to version-5"
    story.expect_hook_allowed(MAIN_SESSION, HookSamples.tick(), reminder)
    story.expect_absent_hook_line(MAIN_SESSION, HookSamples.tick(), reminder)
    story.advance(timedelta(hours=1))
    story.expect_hook_allowed(MAIN_SESSION, HookSamples.tick(), reminder)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: completed")
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", CART_CHANGE)


def test_a_merge_after_the_environments_branch_changed_is_refused(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success("environment edit 1 --branch version-6", "branch: version-6")
    story.expect_refusal(f"worker merge {worker.id}",
                         f"environment main now builds on version-6; worker worker-{worker.id} was cut from version-5: release it and dispatch the task again", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: testing")


def test_a_merge_over_uncommitted_changes_in_the_checkout_to_files_the_worker_changed_is_refused_naming_them(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.uncommitted("cart.py", "TOTAL = 5\n")
    base_tip = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_refusal(f"worker merge {worker.id}", "the checkout of environment main has uncommitted changes to cart.py", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: testing")
    repository.expect_branch_tip(ENVIRONMENT_BRANCH, base_tip)
