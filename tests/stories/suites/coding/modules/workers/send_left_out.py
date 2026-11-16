import pytest

from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment

pytestmark = pytest.mark.real_git

NESTED = "vendor-lib"


def nested_repository_with_new_file(repository, worker) -> None:
    """A folder that is a git repository of its own and a commit of the worktree, with a file added inside it: git
    lists the folder as changed, and a commit cannot take the change."""
    folder = repository.worktree_folder(worker.id)
    nested = folder / NESTED
    nested.mkdir()
    (nested / "lib.py").write_text("LIB = 1\n")
    repository.git("init", "--initial-branch", "main", folder=nested)
    repository.git("add", "-A", folder=nested)
    repository.git("commit", "-m", "The lib", folder=nested)
    repository.git("add", NESTED, folder=folder)
    repository.git("commit", "-m", "The lib as a folder of its own", folder=folder)
    (nested / "config.json").write_text("{}\n")


def test_a_send_goes_on_when_the_only_change_in_the_worktree_is_one_a_commit_cannot_take(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    nested_repository_with_new_file(repository, worker)
    story.expect_success(f'worker send --wait {agent_number(story, worker.id)} "Keep the total in cents"', actor=story.agent)
    story.expect_text("worker-worktree list", "cut", actor=story.agent)
