from collections.abc import Callable

import json

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.quiet_helpers import merger_change
from tests.stories.suites.coding.modules.workers.support.base_branch import checkout_of, committed_on
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository
from tests.stories.suites.coding.modules.workers.worktree_behind_check import checks, look, setting
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState

MERGER_SESSION = "s-merger"
HAIKU_DISPATCH = DISPATCH.replace("--model sonnet", "--model haiku")
MANY_FILES = 40


class MergerBeside(StoryFixture):
    """A merger helper beside the main agent of an open task."""

    parent = OpenTaskOrchestrator

    def steps(self, story) -> None:
        merger_change(story, story.new_row_id(f"agent start {MERGER_SESSION} claude helper --parent {story.agent.id} --environment main", actor=story.user))


def merger(story) -> Actor:
    rows = json.loads(story.run("agent list --role helper --json").output_text)["rows"]
    return Actor(next(row["id"] for row in rows if row["session"] == MERGER_SESSION), ActorType.AGENT)


def both_change(repository: GitRepository, worker: Actor, worker_file: str, base_file: str) -> None:
    committed_on(repository, repository.worktree_folder(worker.id), worker_file, "WORKER = 1\n", f"The worker changes {worker_file}")
    committed_on(repository, checkout_of(repository, ENVIRONMENT_BRANCH), base_file, "BASE = 1\n", f"The base changes {base_file}")


def worker_lines(story, worker: Actor) -> str:
    return story.run(f"agent-line list --agent {worker.id}", actor=worker).output_text


def s15_another_area_is_left_alone_and_the_worker_is_not_woken(story, repository, worker: Actor) -> None:
    both_change(repository, worker, "src/core/modules/plans/plan_rows.py", "src/viewer/board.ts")
    look(story)
    story.expect_success(f'merger leave {agent_number(story, worker.id)} --why "only the viewer moved"', actor=merger(story))
    story.expect_rows([check.state for check in checks(story)] == [BehindCheckState.LEFT], "The base branch moved" not in worker_lines(story, worker), detail=str(checks(story)))


def s16_an_overlap_is_ordered_and_the_worker_is_woken_with_the_order(story, repository, worker: Actor) -> None:
    both_change(repository, worker, "plan_checkpoints.py", "plan_checkpoints.py")
    look(story)
    story.expect_success(f'merger update {agent_number(story, worker.id)} --why "plan_checkpoints.py moved on both sides"', actor=merger(story))
    story.expect_rows("The base branch moved 1 commits and touches plan_checkpoints.py you work on" in worker_lines(story, worker), detail=worker_lines(story, worker))


def s17_a_sibling_file_is_same_folder_and_not_overlap(story, repository, worker: Actor) -> None:
    both_change(repository, worker, "shop/cart.py", "shop/tax.py")
    story.expect_text(f"merger behind {agent_number(story, worker.id)}", "Overlap: none", "Same folder, not overlap: shop/tax.py", actor=merger(story))


def s18_a_large_update_for_a_small_model_is_passed_with_its_facts(story, repository, worker: Actor) -> None:
    base = checkout_of(repository, ENVIRONMENT_BRANCH)
    for number in range(MANY_FILES):
        (repository.worktree_folder(worker.id) / f"part_{number}.py").write_text("WORKER = 1\n")
        (base / f"part_{number}.py").write_text("BASE = 1\n")
    repository.git("add", "-A", folder=repository.worktree_folder(worker.id))
    repository.git("commit", "-m", "The worker changes many parts", folder=repository.worktree_folder(worker.id))
    repository.git("add", "-A", folder=base)
    repository.git("commit", "-m", "The base changes many parts", folder=base)
    look(story)
    story.expect_success(f'merger pass {agent_number(story, worker.id)} "it is too large for a small model"', actor=merger(story))
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"{MANY_FILES} files overlap, model haiku: the merger thinks it is too large for a small model")
    state = story.run(f"worker-worktree list --json").output_text
    story.expect_rows([check.state for check in checks(story)] == [BehindCheckState.PASSED], WorktreeState.CUT.value in state, detail=state)


def s20_worker_status_shows_the_decision(story, repository, worker: Actor) -> None:
    both_change(repository, worker, "src/core/modules/plans/plan_rows.py", "src/viewer/board.ts")
    look(story)
    story.expect_success(f'merger leave {agent_number(story, worker.id)} --why "different area"', actor=merger(story))
    story.expect_text(f"worker status {agent_number(story, worker.id)}", f"1 behind {ENVIRONMENT_BRANCH}; left alone by the merger: different area", actor=story.agent)


def s21_an_agent_with_no_worktree_is_refused(story, repository, worker: Actor) -> None:
    deciding = merger(story)
    number = agent_number(story, deciding.id)
    story.expect_refusal(f'merger update {number} --why "anything"', f"no worker {number} with a worktree in this environment", actor=deciding)


def s22_a_closed_check_cannot_be_left_again(story, repository, worker: Actor) -> None:
    both_change(repository, worker, "src/core/modules/plans/plan_rows.py", "src/viewer/board.ts")
    look(story)
    deciding = merger(story)
    story.expect_success(f'merger leave {agent_number(story, worker.id)} --why "different area"', actor=deciding)
    story.expect_refusal(f'merger leave {agent_number(story, worker.id)} --why "again"', "no open check for this worker", actor=deciding)


def s23_with_the_merger_off_the_main_agent_gets_the_check_and_its_choices(story, repository, worker: Actor) -> None:
    setting(story, "merger-on", "off")
    both_change(repository, worker, "plan_checkpoints.py", "plan_checkpoints.py")
    look(story)
    number = agent_number(story, worker.id)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"journal worker update {number}", f"journal merger leave {number} --why", f"journal merger pass {number}")


CASES: list[tuple[str, Callable[..., None]]] = [(DISPATCH, s15_another_area_is_left_alone_and_the_worker_is_not_woken), (DISPATCH, s16_an_overlap_is_ordered_and_the_worker_is_woken_with_the_order),
                                                (DISPATCH, s17_a_sibling_file_is_same_folder_and_not_overlap), (HAIKU_DISPATCH, s18_a_large_update_for_a_small_model_is_passed_with_its_facts),
                                                (DISPATCH, s20_worker_status_shows_the_decision), (DISPATCH, s21_an_agent_with_no_worktree_is_refused),
                                                (DISPATCH, s22_a_closed_check_cannot_be_left_again), (DISPATCH, s23_with_the_merger_off_the_main_agent_gets_the_check_and_its_choices)]


@pytest.mark.parametrize("dispatch, case", CASES, ids=lambda value: value.__name__.split("_")[0] if callable(value) else "")
def test_the_merger_judges_a_worktree_behind_its_base(new_story, dispatch, case):
    story = new_story(fixture=MergerBeside)
    repository = repository_environment(story, real_git=True)
    setting(story, "behind-commits-to-check", 1)
    worker = Actor(story.new_row_id(dispatch, actor=story.agent), ActorType.AGENT)
    case(story, repository, worker)
