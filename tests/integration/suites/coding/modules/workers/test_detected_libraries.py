import pytest

from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.support.story_checks import expect_value


pytestmark = pytest.mark.real_git


def dependency_folder(repository, name):
    folder = repository.folder / name
    folder.mkdir(parents=True)
    (folder / "library.txt").write_text("library\n")


@pytest.fixture
def detected_worktree(played):
    story = played(OpenTaskOrchestrator)
    repository = repository_environment(story)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed(".gitignore", ".journal\nnode_modules\n.venv\nvendor\nbuilt\n", "Ignore the libraries")
    (repository.folder / "src/viewer").mkdir(parents=True)
    repository.committed("src/viewer/app.js", "export {}\n", "The viewer")
    for name in ("src/viewer/node_modules", ".venv", "built"):
        dependency_folder(repository, name)
    worker = dispatched_worker(story, DISPATCH)
    return story, repository, repository.worktree_folder(worker.id)








def test_the_test_checkout_gets_the_detected_folders_too(detected_worktree):
    story, repository, folder = detected_worktree
    worktree = story.container.get(WorktreeQuery).open_worktrees()[0]
    expect_value({".venv", "src/viewer/node_modules"} <= set(story.container.get(WorktreeGit).library_names(worktree)), True)
