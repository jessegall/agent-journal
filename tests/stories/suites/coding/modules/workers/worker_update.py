from collections.abc import Callable
from dataclasses import dataclass

import pytest

from engine.actor.actor import Actor
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.base_branch import checkout_of, committed_on, own_commits
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository

UPDATE = "worker update --wait"
ON_THE_BASE = f"Your worktree is on {ENVIRONMENT_BRANCH} at "


def base_tax(repository: GitRepository) -> None:
    committed_on(repository, checkout_of(repository, ENVIRONMENT_BRANCH), "tax.py", "TAX = 1\n", "Tax on the base")


def empty_setup(repository: GitRepository) -> None:
    return None


def base_claude_file(repository: GitRepository) -> None:
    committed_on(repository, checkout_of(repository, ENVIRONMENT_BRANCH), "CLAUDE.md", "The words of the project\n", "The project instructions")


def s25_uncommitted_changes_in_two_files_stay(story, repository: GitRepository, worker: Actor) -> None:
    folder = repository.worktree_folder(worker.id)
    (folder / "cart.py").write_text("TOTAL = 5\n")
    (folder / "shop.py").write_text("SHOP = 1\n")
    base_tax(repository)
    story.expect_text(UPDATE, ON_THE_BASE, actor=worker)
    story.expect_rows((folder / "cart.py").read_text() == "TOTAL = 5\n", (folder / "shop.py").read_text() == "SHOP = 1\n", (folder / "tax.py").is_file())


def s26_the_accepted_line_says_to_edit_nothing_until_it_ends(story, repository: GitRepository, worker: Actor) -> None:
    base_tax(repository)
    story.expect_text("worker update", "command accepted: output", "do not edit files until it ends, you hear when it ends", actor=worker)


def s27_three_own_commits_sit_on_the_new_tip(story, repository: GitRepository, worker: Actor) -> None:
    own_commits(repository, worker.id, 3)
    base_tax(repository)
    story.expect_text(UPDATE, ON_THE_BASE, actor=worker)
    folder = repository.worktree_folder(worker.id)
    counted = repository.git("rev-list", "--count", f"{ENVIRONMENT_BRANCH}..HEAD", folder=folder).stdout.strip()
    story.expect_rows(counted == "3", repository.git("merge-base", "--is-ancestor", ENVIRONMENT_BRANCH, "HEAD", folder=folder).returncode == 0, detail=counted)


def s28_an_untracked_new_file_comes_back(story, repository: GitRepository, worker: Actor) -> None:
    (repository.worktree_folder(worker.id) / "notes.txt").write_text("not added yet\n")
    base_tax(repository)
    story.expect_text(UPDATE, ON_THE_BASE, actor=worker)
    story.expect_rows((repository.worktree_folder(worker.id) / "notes.txt").read_text() == "not added yet\n")


def s30_the_new_base_is_recorded_and_the_count_starts_there(story, repository: GitRepository, worker: Actor) -> None:
    base_tax(repository)
    story.expect_text(f"worker status {agent_number(story, worker.id)}", f"1 behind {ENVIRONMENT_BRANCH}", actor=story.agent)
    story.expect_text(UPDATE, ON_THE_BASE, actor=worker)
    story.expect_text(f"worker status {agent_number(story, worker.id)}", f"0 behind {ENVIRONMENT_BRANCH}", actor=story.agent)


def s32_already_up_to_date_changes_nothing(story, repository: GitRepository, worker: Actor) -> None:
    head = repository.git("rev-parse", "HEAD", folder=repository.worktree_folder(worker.id)).stdout
    story.expect_text(UPDATE, f"already up to date with {ENVIRONMENT_BRANCH}", actor=worker)
    story.expect_rows(repository.git("rev-parse", "HEAD", folder=repository.worktree_folder(worker.id)).stdout == head)


def s35_the_instruction_files_do_not_clash(story, repository: GitRepository, worker: Actor) -> None:
    committed_on(repository, checkout_of(repository, ENVIRONMENT_BRANCH), "CLAUDE.md", "The changed words of the project\n", "The project instructions change")
    story.expect_text(UPDATE, ON_THE_BASE, actor=worker)


@dataclass(frozen=True)
class UpdateCase:
    """One story of the book: what the base holds before the worker is sent, then what happens after."""

    before_dispatch: Callable[[GitRepository], None]
    after_dispatch: Callable[..., None]


CASES = [UpdateCase(empty_setup, s25_uncommitted_changes_in_two_files_stay), UpdateCase(empty_setup, s26_the_accepted_line_says_to_edit_nothing_until_it_ends),
         UpdateCase(empty_setup, s27_three_own_commits_sit_on_the_new_tip), UpdateCase(empty_setup, s28_an_untracked_new_file_comes_back),
         UpdateCase(empty_setup, s30_the_new_base_is_recorded_and_the_count_starts_there), UpdateCase(empty_setup, s32_already_up_to_date_changes_nothing),
         UpdateCase(base_claude_file, s35_the_instruction_files_do_not_clash)]


@pytest.mark.parametrize("case", CASES, ids=lambda case: case.after_dispatch.__name__.split("_")[0])
def test_a_worker_updates_its_worktree_onto_its_base_and_keeps_working(new_story, case):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story, real_git=True)
    case.before_dispatch(repository)
    worker = dispatched_worker(story)
    case.after_dispatch(story, repository, worker)
