from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_a_choice_in_a_window_menu_opens_an_inner_menu_a_line_each_and_goes_back(new_story):
    story = new_story(fixture=BuilderWithUser)
    with server_story(story) as server:
        expect_browser(server, "paneMenuInner.browser.mjs", [])
