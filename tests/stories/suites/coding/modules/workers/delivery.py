from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DELIVERY, FIRST_PROOF, delivered_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

TWO_POINT_BRIEF = 'task edit 1 --brief "- the total adds the tax\n- the total rounds to cents"'


def test_a_delivery_with_every_point_proved_commits_the_worktree_and_moves_the_task_to_testing(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    base_commit = repository.tip(ENVIRONMENT_BRANCH)
    worker = delivered_worker(story, repository)
    story.expect_success(lines.TASK_DETAILS, "state: testing", f"holder_id: {worker.id}")
    story.expect_success("worktree show 1", "state: delivered", f"base_commit: {base_commit}")
    repository.expect_commit(repository.worker_branch(worker.id), "task 1: Fix the cart", f"Journal: worker worker-{worker.id}")
    repository.expect_clean(worker.id)


def test_a_delivery_with_a_point_of_the_brief_unproved_is_refused_naming_the_point(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    story.expect_success(TWO_POINT_BRIEF, "version: 2")
    base_commit = repository.tip(ENVIRONMENT_BRANCH)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, "point: 1", actor=worker)
    story.expect_refusal(DELIVERY, "point 2 has no proof", actor=worker)
    story.expect_success(lines.TASK_DETAILS, "state: started")
    story.expect_success("worktree show 1", "state: cut")
    repository.expect_branch_tip(repository.worker_branch(worker.id), base_commit)


def test_a_delivery_of_an_unchanged_worktree_is_refused(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(FIRST_PROOF, "point: 1", actor=worker)
    story.expect_refusal(DELIVERY, "your worktree has no change: make the change, or say in a proof why none is needed and ask for release", actor=worker)
    story.expect_success(lines.TASK_DETAILS, "state: started")
    story.expect_success("worktree show 1", "state: cut")
