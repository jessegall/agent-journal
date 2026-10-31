from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story


def test_an_event_stream_resumed_after_its_last_id_loses_nothing(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        for _ in range(3):
            story.story.run(lines.NEW_TASK)
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        first_ids = story.viewer_event_ids(cookie, 0, 3)
        story.expect_viewer_event_ids(cookie, first_ids[0], 2, first_ids[1:])
