from core.testing.story import Story
from install.upgrade_journal import UpgradeJournal
from server.booting_work import BootingWork
from tests.stories.fixtures.worktree_upgrade import LEGACY_BRANCH, prepare_worktree_upgrade
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository
from tests.stories.suites.coding.modules.workers.support.worktree_samples import orphan_worktree

LEGACY_WORKER_ID = 9


def prepare_upgrade_worktree(story: Story) -> tuple[GitRepository, str]:
    repository = GitRepository.sample(story.home.folder.parent)
    repository.git("branch", LEGACY_BRANCH, ENVIRONMENT_BRANCH)
    prepare_worktree_upgrade(story.home.folder)
    tip = orphan_worktree(repository, LEGACY_WORKER_ID)
    repository.git("update-ref", f"refs/heads/{ENVIRONMENT_BRANCH}", tip)
    return repository, tip


def expect_upgrade_started(story: Story) -> None:
    outcome = UpgradeJournal(story.home).run(confirmed=True)
    assert outcome.code == 0, outcome.text
    BootingWork().run(story.container)
    story.run_listeners()


def expect_worktree_kept(repository: GitRepository, tip: str) -> None:
    folder = repository.worktree_folder(LEGACY_WORKER_ID)
    assert folder.is_dir(), folder
    assert (folder / "cart.py").read_text() == "TOTAL = 9\n"
    repository.expect_branch_tip(repository.worker_branch(LEGACY_WORKER_ID), tip)
