import shlex
from dataclasses import dataclass

import pytest

from core.base.journal_home import LAUNCHER_SOCKET
from core.testing.fake_launcher import FakeLauncher
from suites.coding.modules.workers.commands.record_worktree_removal.record_worktree_removal_handler import RecordWorktreeRemovalHandler
from engine.actor.actor import Actor
from core.testing.story import Story
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository


@dataclass(frozen=True)
class OpenMergedWorktree:
    """A worker whose merge was recorded but whose worktree row was never removed."""

    story: Story
    repository: GitRepository
    worker: Actor


@pytest.fixture
def open_merged_worktree(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = GitRepository.sample(story.home.project_folder)
    story.expect_success(f"environment edit 1 --folder {shlex.quote(str(repository.folder))} --branch {ENVIRONMENT_BRANCH}")
    worker = checked_worker(story, repository, "worker dispatch --test-command python=pytest --model sonnet 1")
    repository.checkout(ENVIRONMENT_BRANCH)
    with monkeypatch.context() as patch:
        patch.setattr(RecordWorktreeRemovalHandler, "handle", lambda *_arguments: (_ for _ in ()).throw(RuntimeError("the row was not saved")))
        story.expect_rows(story.run(f"worker merge --wait {worker.id}", actor=story.agent).code != 0)
    story.run_listeners()
    story.expect_text("worker-worktree list", "merged")
    return OpenMergedWorktree(story, repository, worker)


def test_a_task_sent_to_a_worker_whose_merged_worktree_is_still_open_gets_a_worktree_with_the_project_files(open_merged_worktree):
    story, repository, worker = open_merged_worktree.story, open_merged_worktree.repository, open_merged_worktree.worker
    task_id = story.new_row_id('task make "The next task" --brief "Keep the total in cents"', actor=story.agent)
    launcher = FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET), answer=b"started 123456789\n")
    try:
        story.expect_success(f"worker send --wait {worker.id} --task {task_id}", actor=story.agent)
        story.run_listeners()
    finally:
        launcher.server.close()
    folder = repository.worktree_folder(worker.id)
    story.expect_rows((folder / "cart.py").is_file(), (folder / ".git").exists(), detail=str(sorted(path.name for path in folder.iterdir())))


def test_releasing_a_worker_whose_worktree_is_merged_removes_the_worktree(open_merged_worktree):
    story, repository, worker = open_merged_worktree.story, open_merged_worktree.repository, open_merged_worktree.worker
    story.expect_success(f'worker release {worker.id} "the worker is not needed"', actor=story.agent)
    story.expect_absent("worker-worktree list", "merged")
    story.expect_rows(not repository.worktree_folder(worker.id).exists())
