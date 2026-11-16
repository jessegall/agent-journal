import pytest

from tests.stories.suites.coding.modules.workers.checkpoint_runs import BUILD_TEST, REACHES, merge, rows
from tests.stories.suites.coding.modules.workers.free_commits import commit_tasks_singly
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, StoryWorker, dispatched_story_worker, planned_story
from tests.integration.suites.coding.modules.workers.test_work_units import plan_card, worker_unit

"""Book F of doc 1252: a plan over several workers."""

SECOND_PHASE_DISPATCH = 'worker dispatch --test-command python=pytest --model sonnet --plan 1 --phase 2 --fresh "the release"'


def two_workers(new_story) -> tuple[StoryWorker, StoryWorker]:
    """Plan 1 with no checkpoint before its last phase, with phase Build sent to a first worker and phase Ship to
    a second."""
    first = dispatched_story_worker(planned_story(new_story), PHASE_DISPATCH)
    second = first.added_worker(SECOND_PHASE_DISPATCH)
    return first, second


@pytest.fixture
def phase_workers(new_story) -> tuple[StoryWorker, StoryWorker]:
    return two_workers(new_story)


@pytest.fixture
def built_phase_worker(new_story) -> StoryWorker:
    return dispatched_story_worker(planned_story(new_story, build_test=BUILD_TEST), PHASE_DISPATCH)


def test_75_a_phase_to_a_second_worker_is_its_unit_and_the_plan_agent_stays_the_first(phase_workers):
    first, second = phase_workers
    unit = worker_unit(second)
    card = plan_card(first)
    first.story.expect_rows(unit.phase is not None and unit.phase.id == 2, card["assignee"] is None or card["assignee"]["id"] != second.worker.id, detail=f"{unit} / {card}")


def test_76_a_window_of_one_worker_is_tested_on_its_commit(built_phase_worker):
    first = built_phase_worker
    commit_tasks_singly(first, (1, 2, 3))
    sources = [row["source"] for row in rows(first, REACHES)]
    first.story.expect_rows(sources == ["agent_commit"], detail=str(sources))


def test_77_the_holder_of_an_awaited_task_is_told_once(phase_workers):
    first, second = phase_workers
    first.story.run("task depend 4 --on 1", actor=first.story.agent)
    commit_tasks_singly(first, (1,))
    lines = [line for line in first.worker_lines() if "waits on your committed task" in line]
    first.story.expect_rows(len(lines) == 1, "--up-to 1" in lines[0] if lines else False, detail=str(first.worker_lines()))


def test_78_the_phase_of_the_second_worker_opens_when_the_first_is_merged_and_recorded(built_phase_worker):
    first = built_phase_worker
    first.story.expect_refusal(SECOND_PHASE_DISPATCH, "comes after checkpoint phase 1", actor=first.story.agent)
    commit_tasks_singly(first, (1, 2, 3))
    first.end_all_tests()
    merge(first)
    first.story.expect_success(SECOND_PHASE_DISPATCH, actor=first.story.agent)
