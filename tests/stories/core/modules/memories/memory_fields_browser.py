from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story

CAPTURE = "/tmp/memory-fields"


def test_the_memory_inspector_and_new_memory_fields_have_the_viewers_look(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.expect_success('memory make "Keep the branch clean" --weight 4 --environment main', actor=story.user)
    with server_story(story) as server:
        expect_browser(server, "memoryFields.browser.mjs", [CAPTURE])
