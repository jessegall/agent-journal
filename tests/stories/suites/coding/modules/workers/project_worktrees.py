from tests.stories.core.support.agent_labels import agent_label
import pytest
import shutil

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.database.database import Database
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import GitRepository


pytestmark = pytest.mark.real_git

UNFINISHED_BRANCH = "left-over"


def unfinished_worktree(story, repository: GitRepository) -> str:
    folder = repository.folder.parent / "left"
    repository.git("worktree", "add", "-b", UNFINISHED_BRANCH, str(folder))
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    return str(folder.resolve())


def test_removing_a_worktree_holds_no_write_lock(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    folder = unfinished_worktree(story, repository_environment(story))
    database = story.container.get(Database)
    transaction_flags: list[bool] = []
    monkeypatch.setattr(WorktreeGit, "remove_folder", lambda self, repository, path: transaction_flags.append(database.has_transaction))
    story.expect_success(f"project-worktree remove {folder} --environment main", actor=story.user)
    story.expect_rows(transaction_flags == [False])


def test_a_worktree_a_worker_is_out_on_stays(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    unfinished_worktree(story, repository)
    worker = dispatched_worker(story)
    story.expect_refusal(f"project-worktree remove {repository.worktree_folder(worker.id).resolve()} --environment main", f"{agent_label(story, worker.id)} is out", actor=story.user)


def test_a_folder_deleted_by_hand_is_pruned(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    folder = unfinished_worktree(story, repository)
    shutil.rmtree(folder)
    story.expect_success(f"project-worktree remove {folder} --environment main", actor=story.user)
    story.expect_absent("project-worktree list --environment main", folder)
