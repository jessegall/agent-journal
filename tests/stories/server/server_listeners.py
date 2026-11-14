import pytest

from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import StartedPlanTask
from tests.stories.server.support.server_client import server_story
from tests.stories.support.listener_builds import LISTENER_THREAD, ListenerBuilds

SESSION = "s-1"
WAKE_COUNT = 50


def test_a_write_through_the_server_wakes_the_listener_thread_which_starts_the_next_plan_task_building_its_listeners_once(running_listeners):
    story, builds = running_listeners
    for number in range(WAKE_COUNT):
        story.run_as(f'task log 1 "step {number}"', SESSION)
    story.run_as(lines.TASK_CLOSE, SESSION)
    story.expect_eventually(lines.SECOND_TASK_DETAILS, "state: started")
    assert builds.count(LISTENER_THREAD) == 1


@pytest.fixture
def running_listeners(new_story):
    with ListenerBuilds.counted() as builds, server_story(new_story(fixture=StartedPlanTask)) as story:
        yield story, builds
