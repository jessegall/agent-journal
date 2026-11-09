import pytest

from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH


pytestmark = pytest.mark.real_git


def dependency_folder(repository, name):
    folder = repository.folder / name
    folder.mkdir(parents=True)
    (folder / "library.txt").write_text("library\n")


@pytest.fixture
def detected_worktree(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed(".gitignore", ".journal\nnode_modules\n.venv\nvendor\nbuilt\n", "Ignore the libraries")
    (repository.folder / "src/viewer").mkdir(parents=True)
    repository.committed("src/viewer/app.js", "export {}\n", "The viewer")
    for name in ("src/viewer/node_modules", ".venv", "built"):
        dependency_folder(repository, name)
    worker = dispatched_worker(story, DISPATCH)
    return story, repository, repository.worktree_folder(worker.id)


def test_a_nested_node_modules_and_a_venv_are_linked_in_a_new_worktree(detected_worktree):
    story, repository, folder = detected_worktree
    assert (folder / ".venv").is_symlink() and (folder / ".venv/library.txt").read_text() == "library\n"
    assert (folder / "src/viewer/node_modules").is_symlink()


def test_an_ignored_folder_with_another_name_is_not_linked(detected_worktree):
    story, repository, folder = detected_worktree
    assert not (folder / "built").exists()


def test_the_linked_folders_stay_out_of_git(detected_worktree):
    story, repository, folder = detected_worktree
    assert repository.git("status", "--porcelain", folder=folder).stdout == ""


def test_a_tracked_folder_with_a_dependency_name_is_not_linked(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    repository.checkout(ENVIRONMENT_BRANCH)
    (repository.folder / "vendor").mkdir()
    repository.committed("vendor/own.py", "OWN = 1\n", "Own vendored code")
    worker = dispatched_worker(story, DISPATCH)
    assert not (repository.worktree_folder(worker.id) / "vendor").is_symlink()


def test_the_test_checkout_gets_the_detected_folders_too(detected_worktree):
    story, repository, folder = detected_worktree
    worktree = story.container.get(WorktreeQuery).open_worktrees()[0]
    assert {".venv", "src/viewer/node_modules"} <= set(story.container.get(WorktreeGit).library_names(worktree))
