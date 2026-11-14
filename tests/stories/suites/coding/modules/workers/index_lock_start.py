import pytest

from engine.process.door.execution import Execution
from engine.process.door.process_executor import ProcessExecutor
from suites.coding.modules.workers.support.merge_builds import MergeBuilds
from suites.coding.modules.workers.support.worker_folder_runs import WorkerFolderRuns
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.support.story_checks import expect_value

pytestmark = pytest.mark.real_git

SKIP_WORKTREE = "--skip-worktree"
LOCKED_INDEX = "fatal: Unable to create '{folder}/.git/index.lock': File exists."


class HeldIndexLock(ProcessExecutor):
    """Runs every git step for real, except that the first steps marking files skip-worktree find the worktree's
    index.lock held by another git of it, as the merge of that worktree holds it."""

    def __init__(self, executor: ProcessExecutor, kept_steps: int) -> None:
        self.executor, self.held_steps, self.refused_steps = executor, kept_steps, 0

    def execute(self, request):
        if SKIP_WORKTREE in request.line and self.refused_steps < self.held_steps:
            self.refused_steps += 1
            return Execution(None, 128, "", LOCKED_INDEX.format(folder=request.line[2]))
        return self.executor.execute(request)


def test_a_worker_whose_worktree_index_is_locked_starts_once_the_lock_has_gone(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story, real_git=True)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("CLAUDE.md", "The project's own briefing.\n", "the project's Claude file")
    lock = HeldIndexLock(story.container.get(ProcessExecutor), kept_steps=2)
    story.bind(WorktreeGit, WorktreeGit(story.container.get(WorkerFolderRuns), lock, story.container.get(MergeBuilds)))
    worker = dispatched_worker(story)
    expect_value(lock.refused_steps, 2)
    story.expect_text("worker status", "Worker:", actor=worker)
    expect_value(repository.worktree_folder(worker.id).is_dir(), True)
