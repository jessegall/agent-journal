from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_a_private_action_result_remains_visible_after_its_approval_card_closes(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project", actor=story.user)
    story.expect_refusal("phone pair --reason needed", "A user was asked in the dock", actor=story.agent)
    with server_story(story) as server:
        expect_browser(server, "approvalResult.browser.mjs", [])
