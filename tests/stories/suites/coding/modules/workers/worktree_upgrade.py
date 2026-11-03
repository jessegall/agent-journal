from tests.stories.fixtures.worktree_upgrade import LEGACY_BRANCH
from tests.stories.suites.coding.modules.workers.support.upgraded_worktree import LEGACY_WORKER_ID, expect_upgrade_started, expect_worktree_kept, prepare_upgrade_worktree


def test_a_clean_legacy_worktree_with_unmerged_commits_keeps_its_folder_after_upgrade(new_story):
    story = new_story()
    repository, tip = prepare_upgrade_worktree(story)
    expect_upgrade_started(story)
    expect_worktree_kept(repository, tip)


def test_a_clean_legacy_worktree_already_merged_into_its_environment_is_removed(new_story):
    story = new_story()
    repository, tip = prepare_upgrade_worktree(story)
    repository.git("update-ref", f"refs/heads/{LEGACY_BRANCH}", tip)
    expect_upgrade_started(story)
    repository.expect_no_folder(LEGACY_WORKER_ID)


def test_a_legacy_worktree_with_uncommitted_changes_keeps_its_folder_after_upgrade(new_story):
    story = new_story()
    repository, tip = prepare_upgrade_worktree(story)
    folder = repository.worktree_folder(LEGACY_WORKER_ID)
    (folder / "unfinished.txt").write_text("Keep this change")
    repository.git("update-ref", f"refs/heads/{LEGACY_BRANCH}", tip)
    expect_upgrade_started(story)
    expect_worktree_kept(repository, tip)
    story.expect_rows((folder / "unfinished.txt").read_text() == "Keep this change")


def test_a_detached_legacy_worktree_keeps_its_folder_after_upgrade(new_story):
    story = new_story()
    repository, tip = prepare_upgrade_worktree(story)
    repository.git("checkout", "--detach", folder=repository.worktree_folder(LEGACY_WORKER_ID))
    expect_upgrade_started(story)
    expect_worktree_kept(repository, tip)


def test_a_legacy_worktree_keeps_its_folder_when_the_environment_branch_is_missing(new_story):
    story = new_story()
    repository, tip = prepare_upgrade_worktree(story)
    repository.git("branch", "-D", LEGACY_BRANCH)
    expect_upgrade_started(story)
    expect_worktree_kept(repository, tip)
