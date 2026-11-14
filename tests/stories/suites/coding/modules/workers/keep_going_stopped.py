from datetime import timedelta

import pytest

from suites.coding.modules.workers.support.worker_nudges import WORKER_ASKING_STOPPED
from suites.coding.modules.workers.support.worker_settings import MERGER_WAIT_MINUTES
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.worker_ask import asking_worker
from tests.stories.suites.coding.modules.workers.support.work_setting_stories import set_resume_limit
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_LIMIT

MAIN_SESSION = "s-1"
INTERVAL = timedelta(seconds=WORKER_ASKING_STOPPED.interval.seconds)


def wait_passed(story) -> timedelta:
    return timedelta(minutes=story.number_default(MERGER_WAIT_MINUTES) + 1)


def stopped_lines(story) -> list[str]:
    listed = story.run(f"agent-line list --agent {story.agent.id}").output_text
    return [line for line in listed.splitlines() if "is stopped and will not restart" in line]


@pytest.fixture
def silent_worker(new_story):
    worker = asking_worker(new_story(fixture=OpenTaskOrchestrator))
    return worker


@pytest.fixture
def stopped_while_asking(silent_worker):
    silent_worker.post_question()
    silent_worker.program_ended()
    return silent_worker


@pytest.fixture
def ended_with_work(silent_worker):
    silent_worker.program_ended()
    silent_worker.story.advance(wait_passed(silent_worker.story))
    return silent_worker


def test_a_worker_another_agent_stopped_is_not_named(silent_worker):
    story = silent_worker.story
    silent_worker.post_question()
    story.expect_success(f"agent end {silent_worker.worker.id}", actor=story.agent)
    story.advance(wait_passed(story))
    story.tick(MAIN_SESSION)
    story.expect_rows(stopped_lines(story) == [], detail=str(stopped_lines(story)))


def test_a_worker_whose_process_ended_with_work_left_is_named_and_named_as_kept_stopping_once_its_restarts_are_used_up(ended_with_work):
    story = ended_with_work.story
    story.tick(MAIN_SESSION)
    ended_lines = stopped_lines(story)
    set_resume_limit(story.container, 0)
    story.tick(MAIN_SESSION)
    lines = stopped_lines(story)
    story.expect_rows(len(ended_lines) == 1, "its process ended" in ended_lines[0], "task:1" in ended_lines[0], len(lines) == 2, "kept stopping" in lines[0], "task:1" in lines[0], detail=str(lines))


def test_a_worker_whose_process_ended_with_no_task_left_is_not_named(ended_with_work):
    story = ended_with_work.story
    story.expect_success('task cancel 1 --reason "The receipt is no longer needed"', actor=story.agent)
    story.tick(MAIN_SESSION)
    story.expect_rows(stopped_lines(story) == [], detail=str(stopped_lines(story)))


def test_a_stopped_worker_is_not_named_while_workers_are_switched_off(ended_with_work):
    story = ended_with_work.story
    story.expect_success(f"setting set {WORKER_RUN_LIMIT} 0 --environment main", actor=story.user)
    story.tick(MAIN_SESSION)
    story.expect_rows(stopped_lines(story) == [], detail=str(stopped_lines(story)))

