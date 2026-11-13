from collections.abc import Callable
from dataclasses import dataclass
from datetime import timedelta

import pytest

from engine.actor.actor import Actor
from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.base_branch import checkout_of, committed_on, own_commits
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import delivered_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from suites.coding.modules.workers.ticks.behind_worktrees import BehindWorktrees
from suites.coding.modules.workers.support.behind_nudges import FAST_FORWARDED
from engine.testing.expectations.expected_nudge import expected_nudge

TEST_ROWS_REASON = "the test reads every row it checks"
SETTING = "journal.suites.coding.workers"
LOGIN_BRANCH = "feature/login"


def setting(story, name: str, value: object) -> None:
    story.expect_success(f"setting set {SETTING}.{name} {value} --environment main", actor=story.user)


def base_commits(repository: GitRepository, count: int, start: int = 0) -> None:
    base = checkout_of(repository, ENVIRONMENT_BRANCH)
    for number in range(start, start + count):
        committed_on(repository, base, f"base_{number}.py", f"BASE = {number}\n", f"Base commit {number}")


def merged_workers(repository: GitRepository, count: int, commits: int = 1) -> None:
    for worker in range(count):
        branch = f"journal/main/worker-other-{worker}"
        repository.git("branch", branch, ENVIRONMENT_BRANCH)
        different = checkout_of(repository, branch)
        for number in range(commits):
            committed_on(repository, different, f"other_{worker}_{number}.py", f"N = {number}\n", f"Other worker {worker} commit {number}")
        repository.git("merge", "--no-ff", "-m", f"Merge worker {worker}", branch, folder=checkout_of(repository, ENVIRONMENT_BRANCH))


def look(story) -> None:
    BehindWorktrees()(story.container)


def checks(story) -> list[WorktreeBehindCheck]:
    with story.container.get(Scopes).opened(None, 1):
        return list(story.container.get(Queries).query(WorktreeBehindCheck).every_row(TEST_ROWS_REASON))


def behind_lines(story) -> list[str]:
    with story.container.get(Scopes).opened(None, 1):
        return [line.text for line in story.container.get(Queries).query(MergerLine).every_row(TEST_ROWS_REASON) if "commits behind" in line.text]


@dataclass(frozen=True)
class LookCase:
    """One story of the book: the settings and base before the worker is sent, then what the look finds."""

    before: Callable[..., None]
    after: Callable[..., None]


def threshold_one(story, repository) -> None:
    setting(story, "behind-commits-to-check", 1)


def defaults(story, repository) -> None:
    return None


def login_base(story, repository) -> None:
    setting(story, "behind-commits-to-check", 1)
    repository.git("branch", LOGIN_BRANCH, ENVIRONMENT_BRANCH)
    story.expect_success(f"environment edit 1 --branch {LOGIN_BRANCH}")


def s1_three_merged_workers_open_one_check_and_start_the_merger(story, repository, worker: Actor) -> None:
    own_commits(repository, worker.id, 1)
    merged_workers(repository, 3)
    look(story)
    story.expect_rows([check.behind for check in checks(story)] == [3], len(behind_lines(story)) == 1, detail=f"{checks(story)} {behind_lines(story)}")


def s2_own_commits_and_an_unmoved_base_open_none(story, repository, worker: Actor) -> None:
    own_commits(repository, worker.id, 5)
    look(story)
    story.expect_rows(checks(story) == [])


def s3_a_merged_four_commit_worker_counts_once(story, repository, worker: Actor) -> None:
    own_commits(repository, worker.id, 1)
    merged_workers(repository, 1, commits=4)
    look(story)
    story.expect_rows([check.behind for check in checks(story)] == [1], detail=str(checks(story)))


def s4_a_commit_straight_on_the_base_counts(story, repository, worker: Actor) -> None:
    own_commits(repository, worker.id, 1)
    base_commits(repository, 1)
    look(story)
    story.expect_rows([check.behind for check in checks(story)] == [1], detail=str(checks(story)))


def s5_a_worktree_counts_against_its_own_base(story, repository, worker: Actor) -> None:
    own_commits(repository, worker.id, 1)
    base_commits(repository, 2)
    look(story)
    story.expect_rows(checks(story) == [], detail=str(checks(story)))


def s6_two_behind_with_three_to_check_opens_none(story, repository, worker: Actor) -> None:
    own_commits(repository, worker.id, 1)
    base_commits(repository, 2)
    look(story)
    story.expect_rows(checks(story) == [])


def s7_the_look_comes_once_per_ten_minutes(story, repository, worker: Actor) -> None:
    own_commits(repository, worker.id, 1)
    base_commits(repository, 2)
    look(story)
    base_commits(repository, 1, start=2)
    story.advance(timedelta(minutes=1))
    look(story)
    first = list(checks(story))
    story.advance(timedelta(minutes=10))
    look(story)
    story.expect_rows(first == [], [check.behind for check in checks(story)] == [3], detail=f"{first} {checks(story)}")


def s8_zero_to_check_looks_at_nothing(story, repository, worker: Actor) -> None:
    setting(story, "behind-commits-to-check", 0)
    own_commits(repository, worker.id, 1)
    base_commits(repository, 4)
    look(story)
    story.expect_rows(checks(story) == [], behind_lines(story) == [])


def s9_a_delivered_worktree_is_skipped(story, repository, worker: Actor) -> None:
    base_commits(repository, 4)
    look(story)
    story.expect_rows(checks(story) == [])


def s10_an_open_check_is_not_doubled(story, repository, worker: Actor) -> None:
    own_commits(repository, worker.id, 1)
    base_commits(repository, 3)
    look(story)
    base_commits(repository, 5, start=3)
    story.advance(timedelta(minutes=10))
    look(story)
    story.expect_rows(len(checks(story)) == 1, detail=str(checks(story)))


def s12_a_worktree_with_nothing_of_its_own_moves_with_no_merger(story, repository, worker: Actor) -> None:
    base_commits(repository, 3)
    look(story)
    story.expect_text(f"agent-line list --agent {worker.id}", expected_nudge(FAST_FORWARDED), actor=worker)
    story.expect_rows(behind_lines(story) == [], detail=str(behind_lines(story)))


def s13_a_partial_merge_of_its_own_unit_does_not_count(story, repository, worker: Actor) -> None:
    own_commits(repository, worker.id, 2)
    repository.git("merge", "--no-ff", "-m", "Merge part of the unit", repository.worker_branch(worker.id), folder=checkout_of(repository, ENVIRONMENT_BRANCH))
    look(story)
    story.expect_rows(checks(story) == [], detail=str(checks(story)))


CASES = [LookCase(defaults, s1_three_merged_workers_open_one_check_and_start_the_merger), LookCase(threshold_one, s2_own_commits_and_an_unmoved_base_open_none),
         LookCase(threshold_one, s3_a_merged_four_commit_worker_counts_once), LookCase(threshold_one, s4_a_commit_straight_on_the_base_counts),
         LookCase(login_base, s5_a_worktree_counts_against_its_own_base), LookCase(defaults, s6_two_behind_with_three_to_check_opens_none),
         LookCase(defaults, s7_the_look_comes_once_per_ten_minutes), LookCase(defaults, s8_zero_to_check_looks_at_nothing),
         LookCase(defaults, s9_a_delivered_worktree_is_skipped), LookCase(defaults, s10_an_open_check_is_not_doubled),
         LookCase(defaults, s12_a_worktree_with_nothing_of_its_own_moves_with_no_merger),
         LookCase(threshold_one, s13_a_partial_merge_of_its_own_unit_does_not_count)]


@pytest.mark.parametrize("case", CASES, ids=lambda case: case.after.__name__.split("_")[0])
def test_a_look_notices_a_worktree_that_fell_behind_its_base(new_story, case):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story, real_git=True)
    case.before(story, repository)
    worker = delivered_worker(story, repository) if case.after is s9_a_delivered_worktree_is_skipped else dispatched_worker(story)
    case.after(story, repository, worker)
