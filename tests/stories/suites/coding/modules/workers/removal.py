from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, delivered_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

RELEASE_REASON = "the cart waits for the new prices"


def test_a_merged_worktree_is_removed_with_its_branch(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    story.expect_success("worktree show 1", "state: removed")
    repository.expect_nothing_cut()


def test_a_release_removes_the_folder_and_keeps_and_names_a_branch_that_holds_commits(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    worker_tip = repository.tip(repository.worker_branch(worker.id))
    story.expect_text(f'worker release {worker.id} "{RELEASE_REASON}"', repository.worker_branch(worker.id), actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: open")
    story.expect_success("worktree show 1", "state: removed")
    repository.expect_no_folder(worker.id)
    repository.expect_branch_at(repository.worker_branch(worker.id), worker_tip)


def test_a_release_of_a_worktree_with_no_commits_removes_its_branch_too(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(f'worker release {worker.id} "{RELEASE_REASON}"', actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: open")
    repository.expect_nothing_cut()


def test_a_worktree_folder_deleted_by_hand_is_pruned_from_git_at_its_removal(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    repository.folder_deleted(worker.id)
    story.expect_success(f'worker release {worker.id} "{RELEASE_REASON}"', actor=story.agent)
    story.expect_success("worktree show 1", "state: removed")
    repository.expect_nothing_cut()
