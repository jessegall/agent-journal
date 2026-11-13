import pytest

from tests.stories.suites.coding.modules.workers.support.held_tasks import BUILD_TASK_IDS, holding_worker
from tests.stories.suites.coding.modules.workers.support.phase_steps import StoryWorker
from suites.coding.modules.workers.support.worker_nudges import WORKER_TASK_COUNT
from engine.testing.expectations.said_nudge import said
from suites.coding.modules.workers.support.worker_settings import MOST_OPEN_TASKS

LIMIT_SETTING = f"{MOST_OPEN_TASKS}"
LIMIT_REFUSAL = "you hold {count} tasks, the most allowed"
LIMIT_HINT = "commit some of them, then start another"
SIX_BUILD_TASKS = 6


@pytest.fixture
def one_task(new_story, monkeypatch) -> StoryWorker:
    """A worker of phase Build that holds task 1 started; tasks 2 and 3 are its next ones."""
    return holding_worker(new_story, monkeypatch, 1)


@pytest.fixture
def three_tasks(new_story, monkeypatch) -> StoryWorker:
    """A worker of a phase Build of six tasks that holds tasks 1, 2 and 3 started."""
    return holding_worker(new_story, monkeypatch, 3, SIX_BUILD_TASKS)


@pytest.fixture
def five_tasks(new_story, monkeypatch) -> StoryWorker:
    """A worker of a phase Build of six tasks that holds tasks 1, 2, 3, 5 and 6 started; task 7 is open."""
    return holding_worker(new_story, monkeypatch, 5, SIX_BUILD_TASKS)


def started_ids(worker: StoryWorker) -> list[int]:
    listed = worker.story.run("task list --state started --json --environment main", actor=worker.story.agent).output_text
    return [task_id for task_id in BUILD_TASK_IDS if f'"id": {task_id},' in listed]


def test_12_a_worker_starts_a_second_task_and_hears_how_many_it_holds_of_the_most_it_may(one_task):
    outcome = one_task.story.run("task start 2", actor=one_task.worker)
    one_task.story.expect_rows(outcome.code == 0, started_ids(one_task) == [1, 2], said(WORKER_TASK_COUNT, count=2, limit=5).is_in_any(one_task.worker_lines()), detail=f"{outcome.output_text} | {one_task.worker_lines()}")


def test_13_a_worker_holds_five_started_tasks_and_its_status_lists_them(five_tasks):
    status = five_tasks.story.run("worker status", actor=five_tasks.worker).output_text
    five_tasks.story.expect_rows(started_ids(five_tasks) == [1, 2, 3, 5, 6], all(f"task {task_id}" in status for task_id in (1, 2, 3, 5, 6)), detail=status)


def test_14_a_sixth_task_is_refused_at_the_limit_and_nothing_changes(five_tasks):
    refused = five_tasks.story.run("task start 7", actor=five_tasks.worker)
    five_tasks.story.expect_text("task show 7", "state: open", actor=five_tasks.story.agent)
    five_tasks.story.expect_rows(refused.code != 0, LIMIT_REFUSAL.format(count=5) in refused.output_text, LIMIT_HINT in refused.output_text, started_ids(five_tasks) == [1, 2, 3, 5, 6],
                                 detail=refused.output_text)


def test_15_a_person_lowers_the_limit_the_next_start_is_refused_at_it_and_a_limit_below_one_is_refused(three_tasks):
    story = three_tasks.story
    story.expect_text("work-settings show --json --environment main", "Tasks a worker may hold started at once", "Tasks handed to a worker at once", actor=story.user)
    story.expect_text(f"setting show {LIMIT_SETTING} --environment main", "value: 5", actor=story.user)
    story.expect_success(f"setting set {LIMIT_SETTING} 3 --environment main", actor=story.user)
    refused = story.run("task start 5", actor=three_tasks.worker)
    below_one = story.run(f"setting set {LIMIT_SETTING} 0 --environment main", actor=story.user)
    story.expect_rows(refused.code != 0, LIMIT_REFUSAL.format(count=3) in refused.output_text, below_one.code != 0, started_ids(three_tasks) == [1, 2, 3], detail=f"{refused.output_text} | {below_one.output_text}")
