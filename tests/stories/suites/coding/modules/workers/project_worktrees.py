import shutil

from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import GitRepository

LEFT_BRANCH = "left-over"


def left_worktree(story, repository: GitRepository) -> str:
    folder = repository.folder.parent / "left"
    repository.git("worktree", "add", "-b", LEFT_BRANCH, str(folder))
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    return str(folder.resolve())


def test_the_list_names_the_main_checkout_and_a_worktree_with_no_environment(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    folder = left_worktree(story, repository)
    story.expect_text("project-worktree list --environment main", str(repository.folder.resolve()), f"{folder} on {LEFT_BRANCH}")


def test_a_person_removes_a_worktree_nobody_holds_and_its_branch_stays(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    folder = left_worktree(story, repository)
    tip = repository.tip(LEFT_BRANCH)
    story.expect_text(f"project-worktree remove {folder} --environment main", "its branch stays", actor=story.user)
    story.expect_absent("project-worktree list --environment main", folder)
    repository.expect_branch_tip(LEFT_BRANCH, tip)


def test_an_agent_cannot_remove_a_worktree(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    folder = left_worktree(story, repository_environment(story))
    story.expect_refusal(f"project-worktree remove {folder} --environment main", "only a person removes a worktree", actor=story.agent)


def test_the_main_checkout_stays(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    left_worktree(story, repository)
    story.expect_refusal(f"project-worktree remove {repository.folder.resolve()} --environment main", "main checkout", actor=story.user)


def test_a_worktree_a_worker_is_out_on_stays(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    left_worktree(story, repository)
    worker = dispatched_worker(story)
    story.expect_refusal(f"project-worktree remove {repository.worktree_folder(worker.id).resolve()} --environment main", f"worker {worker.id} is out", actor=story.user)


def test_git_refuses_a_worktree_with_changes_and_says_why(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    folder = left_worktree(story, repository)
    (repository.folder.parent / "left" / "note.txt").write_text("not committed")
    story.expect_refusal(f"project-worktree remove {folder} --environment main", "contains modified or untracked files", actor=story.user)


def test_a_folder_deleted_by_hand_is_pruned(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    folder = left_worktree(story, repository)
    shutil.rmtree(folder)
    story.expect_success(f"project-worktree remove {folder} --environment main", actor=story.user)
    story.expect_absent("project-worktree list --environment main", folder)
