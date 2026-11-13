from tests.stories.suites.coding.modules.workers.checkpoint_runs import BUILD_TEST, REACHES, merge, rows
from tests.stories.suites.coding.modules.workers.free_commits import commit_each
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, StoryWorker, dispatched_story_worker, planned_story
from tests.stories.suites.coding.modules.workers.work_units import plan_card, unit_of

"""Book F of doc 1252: a plan over several workers."""

SECOND_PHASE_DISPATCH = 'worker dispatch --test-command python=pytest --model sonnet --plan 1 --phase 2 --fresh "the release"'


def two_workers(new_story, monkeypatch) -> tuple[StoryWorker, StoryWorker]:
    """Plan 1 with no checkpoint before its last phase, with phase Build sent to a first worker and phase Ship to
    a second."""
    first = dispatched_story_worker(planned_story(new_story), PHASE_DISPATCH, monkeypatch)
    second = first.added_worker(SECOND_PHASE_DISPATCH)
    return first, second


def test_75_a_phase_to_a_second_worker_is_its_unit_and_the_plan_agent_stays_the_first(new_story, monkeypatch):
    first, second = two_workers(new_story, monkeypatch)
    unit = unit_of(second)
    card = plan_card(first)
    first.story.expect_rows(unit.phase is not None and unit.phase.id == 2, card["assignee"] is None or card["assignee"]["id"] != second.worker.id, detail=f"{unit} / {card}")


def test_76_a_window_of_one_worker_is_tested_on_its_commit(new_story, monkeypatch):
    first = dispatched_story_worker(planned_story(new_story, build_test=BUILD_TEST), PHASE_DISPATCH, monkeypatch)
    commit_each(first, (1, 2, 3))
    sources = [row["source"] for row in rows(first, REACHES)]
    first.story.expect_rows(sources == ["agent_commit"], detail=str(sources))


def test_77_the_holder_of_an_awaited_task_is_told_once(new_story, monkeypatch):
    first, second = two_workers(new_story, monkeypatch)
    first.story.run("task depend 4 --on 1", actor=first.story.agent)
    commit_each(first, (1,))
    lines = [line for line in first.worker_lines() if "waits on your committed task" in line]
    first.story.expect_rows(len(lines) == 1, "--up-to 1" in lines[0] if lines else False, detail=str(first.worker_lines()))


def test_78_the_phase_of_the_second_worker_opens_when_the_first_is_merged_and_recorded(new_story, monkeypatch):
    first = dispatched_story_worker(planned_story(new_story, build_test=BUILD_TEST), PHASE_DISPATCH, monkeypatch)
    first.story.expect_refusal(SECOND_PHASE_DISPATCH, "comes after checkpoint phase 1", actor=first.story.agent)
    commit_each(first, (1, 2, 3))
    first.end_all_tests()
    merge(first)
    first.story.expect_success(SECOND_PHASE_DISPATCH, actor=first.story.agent)
