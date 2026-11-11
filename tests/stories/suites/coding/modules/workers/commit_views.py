import pytest

from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.held_tasks import prove_task, unplanned_holding_worker
from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, TEST_LINE, StoryWorker

THREE_TASKS = 3
THREE_POINT_BRIEF = 'task edit 3 --brief "- the totals are added\n- the totals are shown\n- the totals are stored"'


@pytest.fixture
def three_started(new_story, monkeypatch) -> StoryWorker:
    """A worker that holds tasks 1, 2 and 3 started, in no plan; task 3 has three points."""
    worker = unplanned_holding_worker(new_story, monkeypatch, THREE_TASKS)
    worker.story.expect_success(THREE_POINT_BRIEF, actor=worker.story.agent)
    return worker


def ids(listed: dict[str, object], key: str) -> list[int]:
    return [task["id"] for task in listed[key]]


def test_73_74_the_status_names_what_to_do_now_and_groups_the_tasks_of_a_worker_as_held_staged_and_waiting_for_tests(three_started):
    story = three_started.story
    prove_task(three_started, 1, 1, TEST_LINE)
    story.expect_success(COMMIT, actor=three_started.worker)
    prove_task(three_started, 2, 1, SECOND_TEST_LINE)
    prove_task(three_started, 3, 1)
    status, listed = three_started.status(), three_started.status_json()
    story.expect_rows(ids(listed, "held") == [3], ids(listed, "staged") == [2], ids(listed, "waiting") == [1], "Tasks held: 1" in status, "task 3: points 2, 3 have no proof" in status,
                      "Tasks staged: 1" in status, "Tasks waiting for tests: 1" in status, "Task 2 is proven. Now: journal worker commit, or go on with 3" in status, detail=status)


def test_75_each_task_of_a_commit_gets_a_log_line_with_the_git_commit_and_the_worker_and_a_task_left_out_gets_none(three_started):
    story = three_started.story
    prove_task(three_started, 1, 1, TEST_LINE)
    prove_task(three_started, 2, 1, SECOND_TEST_LINE)
    story.expect_success(COMMIT, actor=three_started.worker)
    logs = [story.run(f"task-log list --task {task_id}", actor=story.agent).output_text for task_id in (1, 2, 3)]
    worker_text = f"by worker {agent_number(story, three_started.worker.id)}"
    story.expect_rows(all("committed in " in log and worker_text in log for log in logs[:2]), "committed in " not in logs[2], detail=" | ".join(logs))
