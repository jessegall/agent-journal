from datetime import timedelta

import pytest

from suites.coding.modules.workers.support.worker_nudges import WORKER_ASKING_STOPPED
from suites.coding.modules.workers.support.worker_settings import MERGER_WAIT_MINUTES
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.worker_ask import asking_worker

MAIN_SESSION = "s-1"
WAIT_MINUTES = 30
PAST_THE_WAIT = timedelta(minutes=WAIT_MINUTES + 1)
INTERVAL = timedelta(seconds=WORKER_ASKING_STOPPED.interval.seconds)
RESUME_LIMIT = "suites.coding.modules.workers.support.worker_job.RESUME_LIMIT_COUNT"


def stopped_lines(story) -> list[str]:
    listed = story.run(f"agent-line list --agent {story.agent.id}").output_text
    return [line for line in listed.splitlines() if "nothing will start it" in line]


@pytest.fixture
def quiet_worker(new_story):
    worker = asking_worker(new_story(fixture=OpenTaskOrchestrator))
    worker.story.expect_success(f"setting set {MERGER_WAIT_MINUTES} {WAIT_MINUTES} --project", actor=worker.story.user)
    return worker


@pytest.fixture
def stopped_while_asking(quiet_worker):
    quiet_worker.post_question()
    quiet_worker.program_ended()
    return quiet_worker


@pytest.fixture
def ended_with_work(quiet_worker):
    quiet_worker.program_ended()
    quiet_worker.story.advance(PAST_THE_WAIT)
    return quiet_worker


def test_a_stopped_worker_is_left_to_the_merger_during_the_wait(stopped_while_asking):
    story = stopped_while_asking.story
    story.advance(timedelta(minutes=WAIT_MINUTES - 1))
    story.tick(MAIN_SESSION)
    story.expect_rows(stopped_lines(story) == [], detail=str(stopped_lines(story)))


def test_a_worker_another_agent_stopped_is_not_named(quiet_worker):
    story = quiet_worker.story
    quiet_worker.post_question()
    story.expect_success(f"agent end {quiet_worker.worker.id}", actor=story.agent)
    story.advance(PAST_THE_WAIT)
    story.tick(MAIN_SESSION)
    story.expect_rows(stopped_lines(story) == [], detail=str(stopped_lines(story)))


def test_a_worker_that_used_up_its_restarts_is_named_as_nothing_will_start_it(ended_with_work, monkeypatch):
    monkeypatch.setattr(RESUME_LIMIT, 0)
    story = ended_with_work.story
    story.tick(MAIN_SESSION)
    lines = stopped_lines(story)
    story.expect_rows(len(lines) == 1, "kept stopping" in lines[0], "task:1" in lines[0], detail=str(lines))
