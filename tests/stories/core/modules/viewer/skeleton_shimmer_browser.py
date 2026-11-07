from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story

CAPTURE = "/tmp/skeleton-shimmer"


def test_a_skeleton_drawn_at_a_window_switch_joins_the_running_shimmer(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    with server_story(story) as server:
        expect_browser(server, "skeletonShimmer.browser.mjs", [CAPTURE])
