import pytest

from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.ticks.merger_retry import MergerRetry
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.merger import merger_agent
from tests.stories.suites.coding.modules.workers.stopped_with_tasks import MERGER_ON, ended, main_agent_lines, missing_program, running_worker, two_task_worker, worker_story  # noqa: F401
from tests.stories.suites.coding.modules.workers.support.merger_launcher import merger_can_start, running_launcher
from suites.coding.modules.workers.support.worker_nudges import WORKER_RESTARTED
from engine.testing.expectations.said_nudge import said

HELP_REQUEST_LINE = 'wait stuck "the build tool is missing"'


def merger_lines(story) -> tuple[MergerLine, ...]:
    return tuple(story.story_rows(MergerLine))


def stop_as_resumed(story) -> None:
    ended(story)


def stop_after_asking_for_help(story) -> None:
    story.expect_success(HELP_REQUEST_LINE, actor=story.worker)
    ended(story)


@pytest.mark.parametrize("stop", [stop_as_resumed, stop_after_asking_for_help])
def test_a_worker_that_stops_with_tasks_left_wakes_the_merger(two_task_worker, monkeypatch, stop):
    story = two_task_worker
    merger_can_start(monkeypatch)
    story.expect_success(MERGER_ON, actor=story.user)
    stop(story)
    story.run_listeners()
    lines = merger_lines(story)
    marks = story.run("chat-mark list --environment 1").output_text
    story.expect_rows(len(lines) >= 1, all(line.read_at is None for line in lines), "tasks left" in marks, detail=f"{lines} | {marks}")
    worker = f"worker:{agent_number(story, story.worker.id)}"
    story.expect_rows(not said(WORKER_RESTARTED).is_in(main_agent_lines(story)), f"{worker} ended with" not in main_agent_lines(story), detail=main_agent_lines(story))
    with running_launcher(story):
        MergerRetry()(story.container)
        story.run_listeners()
        story.expect_rows(merger_agent(story) is not None, detail="the unread line about the stopped worker starts the merger")
