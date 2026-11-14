from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_a_document_opens_in_its_reader_with_its_revisions_and_its_menu_has_no_delete(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    story.expect_success('doc make "Cart rules" --abstract "How the cart counts money" --body "In cents"', actor=story.user)
    with server_story(story) as server:
        expect_browser(server, "documents.browser.mjs", [])
