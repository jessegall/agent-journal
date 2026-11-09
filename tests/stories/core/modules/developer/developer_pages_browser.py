from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_developer_pages_follow_their_settings_in_the_sidebar(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.expect_success("setting switch journal.core.developer.tools on --project", actor=story.user)
    story.expect_success("setting set journal.core.developer.tools.hooks.terminal-durations false --project", actor=story.user)
    story.expect_success("setting set journal.core.developer.tools.hooks.request-log false --project", actor=story.user)
    with server_story(story) as server:
        expect_browser(server, "developerPages.browser.mjs", [])
