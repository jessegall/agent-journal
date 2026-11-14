from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_integrations_plugins_secrets_and_checks_open_as_card_pages(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    with server_story(story) as server:
        expect_browser(server, "cards.browser.mjs", [])
