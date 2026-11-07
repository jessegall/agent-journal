from pathlib import Path

from core.base.refusal import Refusal
from suites.coding.modules.workers.support.main_task_handoff import MainTaskHandoff
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.support.story_checks import expect_value


def worker_with_main_progress(story):
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.uncommitted("notes.txt", "unrelated\n")
    (repository.folder / "cart.py").write_text("TOTAL = 5\n")
    return repository, worker


def refused(handoff, worktree, patch) -> bool:
    try:
        handoff.taken(str(worktree), patch)
    except Refusal:
        return True
    return False


def test_s53_assigned_main_task_goes_to_new_worker(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository, worker = worker_with_main_progress(story)
    handoff = story.container.get(MainTaskHandoff)
    patch = handoff.saved(str(repository.folder), 1, ("cart.py",))
    worktree = repository.worktree_folder(worker.id)
    handoff.taken(str(worktree), patch)
    handoff.removed_from_main(str(repository.folder), patch)
    expect_value(((worktree / "cart.py").read_text(), (repository.folder / "cart.py").read_text(), (repository.folder / "notes.txt").read_text()),
                 ("TOTAL = 5\n", "TOTAL = 0\n", "unrelated\n"))


def test_s53_failed_handoff_preserves_main_and_unrelated_edits(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository, worker = worker_with_main_progress(story)
    handoff = story.container.get(MainTaskHandoff)
    patch = handoff.saved(str(repository.folder), 1, ("cart.py",))
    worktree = Path(repository.worktree_folder(worker.id))
    (worktree / "cart.py").write_text("TOTAL = 9\n")
    expect_value((refused(handoff, worktree, patch), (repository.folder / "cart.py").read_text(), (repository.folder / "notes.txt").read_text()),
                 (True, "TOTAL = 5\n", "unrelated\n"))
