import pytest

from suites.coding.modules.workers.ticks.merger_retry import MergerRetry
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.merger import merger_agent
from tests.stories.suites.coding.modules.workers.support.merger_launcher import merger_can_start, running_launcher
from tests.stories.suites.coding.modules.workers.worker_ask import asking_worker


@pytest.fixture
def waiting_worker(new_story, monkeypatch):
    worker = asking_worker(new_story(fixture=OpenTaskOrchestrator))
    merger_can_start(monkeypatch)
    return worker


@pytest.fixture
def unread_line(waiting_worker):
    waiting_worker.post_question()
    waiting_worker.story.run_listeners()
    waiting_worker.story.expect_rows(merger_agent(waiting_worker.story) is None, detail="the merger could not start while nothing launches")
    return waiting_worker


def test_an_unread_line_with_no_merger_running_starts_one(unread_line):
    story = unread_line.story
    with running_launcher(story):
        MergerRetry()(story.container)
    story.expect_rows(merger_agent(story) is not None)


def test_nothing_starts_a_merger_when_no_line_waits(waiting_worker):
    story = waiting_worker.story
    with running_launcher(story):
        MergerRetry()(story.container)
    story.expect_rows(merger_agent(story) is None)


def test_with_the_merger_off_an_unread_line_starts_nothing(unread_line):
    story = unread_line.story
    story.expect_success("setting set journal.suites.coding.workers.merger-on false --project", actor=story.user)
    with running_launcher(story):
        MergerRetry()(story.container)
    story.expect_rows(merger_agent(story) is None)
