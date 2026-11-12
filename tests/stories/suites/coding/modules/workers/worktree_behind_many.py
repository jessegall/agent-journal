from collections.abc import Callable

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.merger_behind_decisions import MergerBeside, both_change, merger
from tests.stories.suites.coding.modules.workers.support.base_branch import checkout_of, committed_on
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository
from tests.stories.suites.coding.modules.workers.worktree_behind_check import look, setting

UPDATE = "worker update --wait"


def base_tax(repository: GitRepository) -> None:
    committed_on(repository, checkout_of(repository, ENVIRONMENT_BRANCH), "tax.py", "TAX = 1\n", "Tax on the base")


def s58_two_worktrees_updating_each_get_back_only_their_own_changes(story, repository, worker: Actor) -> None:
    setting(story, "worker-run-limit", 2)
    task_id = story.new_row_id('task make "The second part" --brief "done when it is done"', actor=story.agent)
    second = Actor(story.new_row_id(DISPATCH.replace(" 1", f" {task_id}"), actor=story.agent), ActorType.AGENT)
    (repository.worktree_folder(worker.id) / "cart.py").write_text("TOTAL = 1\n")
    (repository.worktree_folder(second.id) / "cart.py").write_text("TOTAL = 2\n")
    base_tax(repository)
    story.expect_text(UPDATE, "Your worktree is on", actor=worker)
    story.expect_text(UPDATE, "Your worktree is on", actor=second)
    first_text = (repository.worktree_folder(worker.id) / "cart.py").read_text()
    second_text = (repository.worktree_folder(second.id) / "cart.py").read_text()
    story.expect_rows((first_text, second_text) == ("TOTAL = 1\n", "TOTAL = 2\n"), detail=f"{first_text!r} {second_text!r}")


def s59_a_second_update_right_after_the_first_says_already_up_to_date(story, repository, worker: Actor) -> None:
    base_tax(repository)
    story.expect_text(UPDATE, "Your worktree is on", actor=worker)
    story.expect_text(UPDATE, f"already up to date with {ENVIRONMENT_BRANCH}", actor=worker)


def s61_the_merger_only_orders_and_changes_no_file(story, repository, worker: Actor) -> None:
    both_change(repository, worker, "plan_checkpoints.py", "plan_checkpoints.py")
    look(story)
    before = repository.git("status", "--porcelain", folder=repository.folder).stdout
    worker_head = repository.git("rev-parse", "HEAD", folder=repository.worktree_folder(worker.id)).stdout
    story.expect_success(f'merger update {agent_number(story, worker.id)} --why "plan_checkpoints.py moved on both sides"', actor=merger(story))
    after = repository.git("status", "--porcelain", folder=repository.folder).stdout
    story.expect_rows(after == before, repository.git("rev-parse", "HEAD", folder=repository.worktree_folder(worker.id)).stdout == worker_head, detail=f"{before!r} {after!r}")


def s63_an_update_changes_only_the_worker_worktree(story, repository, worker: Actor) -> None:
    base_tax(repository)
    base_tip, checkout_tip = repository.tip(ENVIRONMENT_BRANCH), repository.git("rev-parse", "HEAD", folder=repository.folder).stdout
    files = sorted(path.name for path in repository.folder.iterdir())
    story.expect_text(UPDATE, "Your worktree is on", actor=worker)
    story.expect_rows(repository.tip(ENVIRONMENT_BRANCH) == base_tip, repository.git("rev-parse", "HEAD", folder=repository.folder).stdout == checkout_tip,
                      sorted(path.name for path in repository.folder.iterdir()) == files)


CASES: list[Callable[..., None]] = [s58_two_worktrees_updating_each_get_back_only_their_own_changes, s59_a_second_update_right_after_the_first_says_already_up_to_date,
                                    s61_the_merger_only_orders_and_changes_no_file, s63_an_update_changes_only_the_worker_worktree]


@pytest.mark.parametrize("case", CASES, ids=lambda case: case.__name__.split("_")[0])
def test_updates_of_many_worktrees_stay_each_in_their_own_worktree(new_story, case):
    story = new_story(fixture=MergerBeside)
    repository = repository_environment(story, real_git=True)
    setting(story, "behind-commits-to-check", 1)
    worker = Actor(story.new_row_id(DISPATCH, actor=story.agent), ActorType.AGENT)
    case(story, repository, worker)
