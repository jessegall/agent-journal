from collections.abc import Callable

import pytest

from engine.actor.actor import Actor
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.base_branch import checkout_of, committed_on
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository

UPDATE = "worker update --wait"
MARKER = "<<<<<<<"


def both_change_the_cart(repository: GitRepository, worker: Actor) -> None:
    committed_on(repository, repository.worktree_folder(worker.id), "cart.py", "def total():\n    return 1\n", "The worker changes the total")
    committed_on(repository, checkout_of(repository, ENVIRONMENT_BRANCH), "cart.py", "def total():\n    return 2\n", "The base changes the total")


def s36_a_function_changed_on_both_sides_leaves_markers(story, repository: GitRepository, worker: Actor) -> None:
    both_change_the_cart(repository, worker)
    story.expect_text(UPDATE, f"The update clashes with {ENVIRONMENT_BRANCH} in cart.py: settle the markers, then go on.", actor=worker)
    story.expect_rows(MARKER in (repository.worktree_folder(worker.id) / "cart.py").read_text())


def s38_a_failed_rebase_falls_back_to_a_merge_of_the_base(story, repository: GitRepository, worker: Actor) -> None:
    both_change_the_cart(repository, worker)
    story.expect_text(UPDATE, "The update clashes", actor=worker)
    merging = repository.git("rev-parse", "--verify", "--quiet", "MERGE_HEAD", folder=repository.worktree_folder(worker.id)).returncode == 0
    story.expect_rows(merging)


def s39_uncommitted_changes_wait_in_a_named_stash_while_markers_are_settled(story, repository: GitRepository, worker: Actor) -> None:
    both_change_the_cart(repository, worker)
    (repository.worktree_folder(worker.id) / "shop.py").write_text("SHOP = 2\n")
    story.expect_text(UPDATE, "The update clashes", "Your uncommitted changes stay in stash", "git stash apply", actor=worker)


def s40_the_next_commit_commits_the_settled_merge(story, repository: GitRepository, worker: Actor) -> None:
    both_change_the_cart(repository, worker)
    story.expect_text(UPDATE, "The update clashes", actor=worker)
    (repository.worktree_folder(worker.id) / "cart.py").write_text("def total():\n    return 3\n")
    story.expect_success('proof make 1 --task 1 "cart.py:1, the settled total"', actor=worker)
    story.run('worker commit --wait --differences "settled the update merge"', actor=worker)
    merging = repository.git("rev-parse", "--verify", "--quiet", "MERGE_HEAD", folder=repository.worktree_folder(worker.id)).returncode == 0
    story.expect_rows(not merging, MARKER not in (repository.worktree_folder(worker.id) / "cart.py").read_text())


def s41_open_markers_refuse_a_second_update(story, repository: GitRepository, worker: Actor) -> None:
    both_change_the_cart(repository, worker)
    story.expect_text(UPDATE, "The update clashes", actor=worker)
    story.expect_refusal(UPDATE, "conflict markers remain in cart.py", actor=worker)


def s49_a_stash_that_leaves_no_markers_stays_in_the_stack(story, repository: GitRepository, worker: Actor) -> None:
    (repository.worktree_folder(worker.id) / "tax.py").write_text("TAX = 9\n")
    committed_on(repository, checkout_of(repository, ENVIRONMENT_BRANCH), "tax.py", "TAX = 2\n", "The base adds tax")
    story.expect_refusal(UPDATE, "they stay in its stash", actor=worker)
    kept = repository.git("stash", "list", folder=repository.worktree_folder(worker.id)).stdout
    story.expect_rows(repository.worker_branch(worker.id) in kept, detail=kept)


def s50_a_deleted_base_branch_changes_nothing(story, repository: GitRepository, worker: Actor) -> None:
    (repository.worktree_folder(worker.id) / "cart.py").write_text("TOTAL = 4\n")
    repository.git("branch", "-D", ENVIRONMENT_BRANCH)
    story.expect_refusal(UPDATE, f"branch {ENVIRONMENT_BRANCH} does not exist", actor=worker)
    story.expect_rows((repository.worktree_folder(worker.id) / "cart.py").read_text() == "TOTAL = 4\n")


def s51_a_stop_after_the_stash_is_repaired_by_the_next_update(story, repository: GitRepository, worker: Actor) -> None:
    folder = repository.worktree_folder(worker.id)
    (folder / "cart.py").write_text("TOTAL = 6\n")
    repository.git("stash", "push", "--include-untracked", "--message", f"journal merge of {repository.worker_branch(worker.id)}", folder=folder)
    committed_on(repository, checkout_of(repository, ENVIRONMENT_BRANCH), "tax.py", "TAX = 1\n", "Tax on the base")
    story.expect_text(UPDATE, f"Your worktree is on {ENVIRONMENT_BRANCH} at ", actor=worker)
    story.expect_rows((folder / "cart.py").read_text() == "TOTAL = 6\n")


CASES: list[Callable[..., None]] = [s36_a_function_changed_on_both_sides_leaves_markers, s38_a_failed_rebase_falls_back_to_a_merge_of_the_base,
                                    s39_uncommitted_changes_wait_in_a_named_stash_while_markers_are_settled, s40_the_next_commit_commits_the_settled_merge,
                                    s41_open_markers_refuse_a_second_update, s49_a_stash_that_leaves_no_markers_stays_in_the_stack,
                                    s50_a_deleted_base_branch_changes_nothing, s51_a_stop_after_the_stash_is_repaired_by_the_next_update]


@pytest.mark.parametrize("case", CASES, ids=lambda case: case.__name__.split("_")[0])
def test_an_update_that_clashes_or_fails_leaves_the_worker_its_markers_or_its_changes(new_story, case):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story, real_git=True)
    worker = dispatched_worker(story)
    case(story, repository, worker)
