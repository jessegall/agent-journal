import pytest

from core.base.change.event_log import EventLog
from core.testing.hook_samples import HookSamples
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story
from tests.stories.server.support.viewer_events import LoggedViewer, expect_cursor, expect_event
from tests.stories.support.story_checks import expect_value


@pytest.fixture
def logged_viewer(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        yield LoggedViewer(story, cookie, story.story.container.get(EventLog).newest_id())


def test_an_event_stream_resumed_after_its_last_id_loses_nothing(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        for _ in range(3):
            story.story.run(lines.NEW_TASK)
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        first_ids = story.viewer_event_ids(cookie, 0, 3)
        story.expect_viewer_event_ids(cookie, first_ids[0], 2, first_ids[1:])


def test_a_stream_sends_no_hook_call_when_its_windows_follow_only_tasks(logged_viewer):
    with logged_viewer.stream(["task.create"]) as response:
        logged_viewer.server.story.hook("s-1", HookSamples.prompt("Read the task window"))
        unfiltered_count = logged_viewer.hook_event_count()
        logged_viewer.server.story.run('task make "Check stream filtering" --environment main')
        expect_event(response, "task.create")
        print(f"One prompt hook: {unfiltered_count} stream wakes before filtering; 0 with only task.create followed")


def test_a_stream_keeps_hook_calls_when_a_window_follows_them(logged_viewer):
    with logged_viewer.stream(["hook_call.*"]) as response:
        logged_viewer.server.story.run('task make "Check call filtering" --environment main')
        logged_viewer.server.story.hook("s-1", HookSamples.prompt("Read the call window"))
        expect_event(response, "hook_call.prompt")


def test_a_filtered_stream_resumes_without_losing_a_followed_event(logged_viewer):
    server = logged_viewer.server
    server.story.run('task make "First streamed task" --environment main')
    server.story.run('task make "Second streamed task" --environment main')
    with logged_viewer.stream(["task.create"]) as response:
        first_id = expect_event(response, "task.create")
        next_id = expect_event(response, "task.create")
    with server.viewer_stream(logged_viewer.cookie, first_id, ["task.create"]) as response:
        expect_value(expect_event(response, "task.create"), next_id)


def test_an_empty_filter_starts_a_filtered_stream_instead_of_following_every_event(logged_viewer):
    with logged_viewer.stream([]) as response:
        logged_viewer.server.story.hook("s-1", HookSamples.prompt("No window follows these events"))
        expect_cursor(response, logged_viewer.cursor_id)
