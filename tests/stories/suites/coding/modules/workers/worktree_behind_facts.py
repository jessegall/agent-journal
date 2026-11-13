from dataclasses import dataclass
from collections.abc import Callable

import pytest

from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.base_branch import checkout_of, committed_on, worker_commits
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository

LOGIN_BRANCH = "feature/login"
DIFFERENT_WORKER_BRANCH = "journal/main/worker-other"


def unchanged_base(story, repository: GitRepository) -> None:
    return None


def login_base(story, repository: GitRepository) -> None:
    repository.git("branch", LOGIN_BRANCH, ENVIRONMENT_BRANCH)
    story.expect_success(f"environment edit 1 --branch {LOGIN_BRANCH}")


def a2_own_commits_and_an_unmoved_base(story, repository: GitRepository, worker_id: int) -> tuple[str, ...]:
    worker_commits(repository, worker_id, 5)
    return ("worker status", f"0 behind {ENVIRONMENT_BRANCH}")


def a3_one_merge_of_a_four_commit_worker(story, repository: GitRepository, worker_id: int) -> tuple[str, ...]:
    repository.git("branch", DIFFERENT_WORKER_BRANCH, ENVIRONMENT_BRANCH)
    different = checkout_of(repository, DIFFERENT_WORKER_BRANCH)
    for number in range(4):
        committed_on(repository, different, f"other_{number}.py", f"N = {number}\n", f"Other worker commit {number}")
    repository.git("merge", "--no-ff", "-m", "Merge the other worker", DIFFERENT_WORKER_BRANCH, folder=checkout_of(repository, ENVIRONMENT_BRANCH))
    return ("worker status", f"1 behind {ENVIRONMENT_BRANCH}")


def a4_a_commit_straight_on_the_base(story, repository: GitRepository, worker_id: int) -> tuple[str, ...]:
    committed_on(repository, checkout_of(repository, ENVIRONMENT_BRANCH), "tax.py", "TAX = 1\n", "Tax straight on the base")
    return ("worker status", f"1 behind {ENVIRONMENT_BRANCH}")


def a5_a_worktree_cut_from_another_branch(story, repository: GitRepository, worker_id: int) -> tuple[str, ...]:
    committed_on(repository, checkout_of(repository, ENVIRONMENT_BRANCH), "tax.py", "TAX = 1\n", "Tax on version-5")
    return ("worker status", f"0 behind {LOGIN_BRANCH}")


def a13_part_of_the_own_unit_merged_into_the_base(story, repository: GitRepository, worker_id: int) -> tuple[str, ...]:
    worker_commits(repository, worker_id, 2)
    repository.git("merge", "--no-ff", "-m", "Merge part of the unit", repository.worker_branch(worker_id), folder=checkout_of(repository, ENVIRONMENT_BRANCH))
    return ("worker status", f"0 behind {ENVIRONMENT_BRANCH}")


def b14_the_merger_reads_the_facts(story, repository: GitRepository, worker_id: int) -> tuple[str, ...]:
    committed_on(repository, repository.worktree_folder(worker_id), "cart.py", "TOTAL = 1\n", "The worker changes the cart")
    base = checkout_of(repository, ENVIRONMENT_BRANCH)
    committed_on(repository, base, "cart.py", "TOTAL = 2\n", "The base changes the cart")
    committed_on(repository, base, "tax.py", "TAX = 1\n", "The base adds tax")
    return ("merger behind", f"2 behind {ENVIRONMENT_BRANCH}", "The base changes the cart: cart.py", "The base adds tax: tax.py", "Worker files: cart.py",
            "Overlap: cart.py", "Same folder, not overlap: tax.py", "Program: claude")


@dataclass(frozen=True)
class BehindCase:
    """One case of the book: what is done to the repository before the worker is sent, and after."""

    before_dispatch: Callable[..., None]
    after_dispatch: Callable[..., tuple[str, ...]]


CASES = [BehindCase(unchanged_base, a2_own_commits_and_an_unmoved_base), BehindCase(unchanged_base, a3_one_merge_of_a_four_commit_worker),
         BehindCase(unchanged_base, a4_a_commit_straight_on_the_base), BehindCase(login_base, a5_a_worktree_cut_from_another_branch),
         BehindCase(unchanged_base, a13_part_of_the_own_unit_merged_into_the_base), BehindCase(unchanged_base, b14_the_merger_reads_the_facts)]


@pytest.mark.parametrize("case", CASES, ids=lambda case: case.after_dispatch.__name__.split("_")[0])
def test_a_worktree_counts_the_first_parent_commits_of_its_base_it_lacks_and_the_merger_reads_their_facts(new_story, case):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story, real_git=True)
    case.before_dispatch(story, repository)
    worker = dispatched_worker(story)
    command, *texts = case.after_dispatch(story, repository, worker.id)
    story.expect_text(f"{command} {agent_number(story, worker.id)}", *texts, actor=story.agent)
