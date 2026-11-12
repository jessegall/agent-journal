from collections.abc import Callable
from datetime import timedelta

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from core.modules.questions.models.question import Question
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.merger_behind_decisions import MergerBeside, both_change, merger, worker_lines
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, repository_environment
from tests.stories.suites.coding.modules.workers.worktree_behind_check import checks, look, setting
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState
from suites.coding.modules.workers.models.merger_line import MergerLine

WAIT = timedelta(minutes=30)
CLASHING_FILE = "plan_checkpoints.py"


def merger_texts(story) -> list[str]:
    with story.container.get(Scopes).opened(None, 1):
        return [line.text for line in story.container.get(Queries).query(MergerLine).all_rows()]


def clashed(story, repository, worker: Actor) -> None:
    """The merger ordered an update over a file both sides changed, and the update left its markers open."""
    both_change(repository, worker, CLASHING_FILE, CLASHING_FILE)
    look(story)
    story.expect_success(f'merger update {agent_number(story, worker.id)} --why "{CLASHING_FILE} moved on both sides"', actor=merger(story))
    story.expect_text("worker update --wait", "The update clashes", actor=worker)


def waited(story) -> None:
    story.advance(WAIT)
    look(story)


def s42_markers_still_open_after_the_wait_reach_the_merger_to_advise_once(story, repository, worker: Actor) -> None:
    clashed(story, repository, worker)
    waited(story)
    story.expect_rows(sum("update left conflict markers open" in text for text in merger_texts(story)) == 1, detail=str(merger_texts(story)))
    story.expect_success(f'merger advise {agent_number(story, worker.id)} "keep both totals in {CLASHING_FILE}, then commit"', actor=merger(story))


def s43_advice_that_did_not_help_is_passed_to_the_main_agent_with_the_reason(story, repository, worker: Actor) -> None:
    clashed(story, repository, worker)
    waited(story)
    waited(story)
    story.expect_rows(any("still has conflict markers after your advice" in text for text in merger_texts(story)), detail=str(merger_texts(story)))
    story.expect_success(f'merger pass {agent_number(story, worker.id)} "markers still open in {CLASHING_FILE} after one piece of advice"', actor=merger(story))
    check = checks(story)[0]
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"the merger passed worker:{agent_number(story, worker.id)} to you: journal behind-check show {check.id}")
    story.expect_text(f"behind-check show {check.id}", f"markers still open in {CLASHING_FILE} after one piece of advice")
    story.expect_rows([check.state for check in checks(story)] == [BehindCheckState.PASSED], detail=str(checks(story)))


def s45_the_main_agent_orders_the_update_as_the_merger_would(story, repository, worker: Actor) -> None:
    both_change(repository, worker, CLASHING_FILE, CLASHING_FILE)
    story.expect_success(f"worker update {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_rows("Your base branch moved" in worker_lines(story, worker), [check.state for check in checks(story)] == [BehindCheckState.ORDERED],
                      detail=worker_lines(story, worker))


def s46_the_main_agent_leaves_a_passed_worker_alone(story, repository, worker: Actor) -> None:
    both_change(repository, worker, CLASHING_FILE, CLASHING_FILE)
    look(story)
    story.expect_success(f'merger pass {agent_number(story, worker.id)} "too large to judge"', actor=merger(story))
    story.expect_success(f'merger leave {agent_number(story, worker.id)} --why "it merges tomorrow"', actor=story.agent)
    story.expect_rows([(check.state, check.reason) for check in checks(story)] == [(BehindCheckState.LEFT, "it merges tomorrow")], detail=str(checks(story)))


def s47_releasing_the_worker_closes_its_open_check_as_gone(story, repository, worker: Actor) -> None:
    both_change(repository, worker, CLASHING_FILE, CLASHING_FILE)
    look(story)
    story.expect_success(f'worker release {agent_number(story, worker.id)} "the task goes to another worker"', actor=story.agent)
    story.expect_rows([check.state for check in checks(story)] == [BehindCheckState.GONE], detail=str(checks(story)))


def s48_no_step_of_an_update_asks_the_person_anything(story, repository, worker: Actor) -> None:
    clashed(story, repository, worker)
    waited(story)
    with story.container.get(Scopes).opened(None, 1):
        questions = tuple(story.container.get(Queries).query(Question).all_rows())
    story.expect_rows(questions == (), detail=str(questions))


def f52_an_ordered_update_not_run_is_reminded_twice_then_the_merger_hears(story, repository, worker: Actor) -> None:
    both_change(repository, worker, CLASHING_FILE, CLASHING_FILE)
    look(story)
    story.expect_success(f'merger update {agent_number(story, worker.id)} --why "{CLASHING_FILE} moved on both sides"', actor=merger(story))
    for _ in range(3):
        waited(story)
    reminders = worker_lines(story, worker).count("reminder: run journal worker update")
    story.expect_rows(reminders == 2, sum("has not run the ordered update" in text for text in merger_texts(story)) == 1, detail=f"{reminders} {merger_texts(story)}")


def g60_a_worker_naming_another_worker_is_refused(story, repository, worker: Actor) -> None:
    story.expect_refusal(f"worker update {agent_number(story, story.agent.id)}", "a worker updates only its own worktree", actor=worker)


CASES: list[Callable[..., None]] = [s42_markers_still_open_after_the_wait_reach_the_merger_to_advise_once, s43_advice_that_did_not_help_is_passed_to_the_main_agent_with_the_reason,
                                    s45_the_main_agent_orders_the_update_as_the_merger_would, s46_the_main_agent_leaves_a_passed_worker_alone,
                                    s47_releasing_the_worker_closes_its_open_check_as_gone, s48_no_step_of_an_update_asks_the_person_anything,
                                    f52_an_ordered_update_not_run_is_reminded_twice_then_the_merger_hears, g60_a_worker_naming_another_worker_is_refused]


@pytest.mark.parametrize("case", CASES, ids=lambda case: case.__name__.split("_")[0])
def test_the_main_agent_and_the_merger_follow_a_worktree_behind_its_base_to_its_end(new_story, case):
    story = new_story(fixture=MergerBeside)
    repository = repository_environment(story, real_git=True)
    setting(story, "behind-commits-to-check", 1)
    worker = Actor(story.new_row_id(DISPATCH, actor=story.agent), ActorType.AGENT)
    case(story, repository, worker)
