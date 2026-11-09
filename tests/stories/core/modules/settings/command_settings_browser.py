from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_settings_show_saved_test_and_build_commands(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.expect_success('alias add project-tests "python3 -m pytest tests" --category "test run"', actor=story.user)
    story.expect_success('alias add project-build "make build" --category build', actor=story.user)
    story.expect_success('alias add project-search "rg words" --category search', actor=story.user)
    with server_story(story) as server:
        expect_browser(server, "commandSettings.browser.mjs", [])
