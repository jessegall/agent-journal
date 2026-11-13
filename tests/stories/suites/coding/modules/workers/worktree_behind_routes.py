from collections.abc import Callable

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.base_branch import own_commits
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DISPATCH, FIRST_PROOF, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import GitRepository
from tests.stories.suites.coding.modules.workers.worktree_behind_check import base_commits, behind_lines, checks, look, setting
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState
from suites.coding.support.shipped_profiles import MERGER_PROFILE

TEST_ROWS_REASON = "the test reads every row it checks"
MANY_WORKERS = 5


def b24_far_behind_goes_to_the_main_agent_without_the_merger(story, repository: GitRepository, worker: Actor) -> None:
    setting(story, "update-to-main-commits", 20)
    own_commits(repository, worker.id, 1)
    base_commits(repository, 25)
    look(story)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "commits behind", "too far to leave to the merger")
    story.expect_rows([check.state for check in checks(story)] == [BehindCheckState.PASSED], behind_lines(story) == [], detail=f"{checks(story)} {behind_lines(story)}")


def f53_a_commit_closes_the_open_check_as_updated(story, repository: GitRepository, worker: Actor) -> None:
    own_commits(repository, worker.id, 1)
    base_commits(repository, 3)
    look(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, actor=worker)
    story.run(COMMIT, actor=worker)
    story.expect_rows([check.state for check in checks(story)] == [BehindCheckState.UPDATED], detail=str(checks(story)))


def f54_abandoning_the_worktree_closes_its_check_as_gone(story, repository: GitRepository, worker: Actor) -> None:
    own_commits(repository, worker.id, 1)
    base_commits(repository, 3)
    look(story)
    story.expect_success(f'worker release {agent_number(story, worker.id)} --abandon "the worker left"', actor=story.agent)
    story.expect_rows([check.state for check in checks(story)] == [BehindCheckState.GONE], detail=str(checks(story)))


def g57_five_worktrees_in_one_look_start_the_merger_once(story, repository: GitRepository, worker: Actor) -> None:
    setting(story, "worker-run-limit", MANY_WORKERS)
    workers = [worker]
    for number in range(2, MANY_WORKERS + 1):
        task_id = story.new_row_id(f'task make "Work {number}" --brief "done when it is done"', actor=story.agent)
        workers.append(Actor(story.new_row_id(DISPATCH.replace(" 1", f" {task_id}"), actor=story.agent), ActorType.AGENT))
    for each in workers:
        own_commits(repository, each.id, 1)
    base_commits(repository, 3)
    look(story)
    mergers = [agent for agent in story.container.get(Queries).query(Agent).every_row(TEST_ROWS_REASON) if agent.profile == f"{MERGER_PROFILE.name}"]
    story.expect_rows(len(checks(story)) == MANY_WORKERS, len(behind_lines(story)) == MANY_WORKERS, len(mergers) <= 1, detail=f"{len(checks(story))} {behind_lines(story)} {mergers}")


CASES: list[Callable[..., None]] = [b24_far_behind_goes_to_the_main_agent_without_the_merger, f53_a_commit_closes_the_open_check_as_updated,
                                    f54_abandoning_the_worktree_closes_its_check_as_gone, g57_five_worktrees_in_one_look_start_the_merger_once]


@pytest.mark.parametrize("case", CASES, ids=lambda case: case.__name__.split("_")[0])
def test_an_opened_check_takes_its_route_and_closes_with_its_worktree(new_story, case):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story, real_git=True)
    worker = dispatched_worker(story)
    case(story, repository, worker)
