from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_the_plan_window_has_a_tab_band_with_a_sliding_line_and_flush_cards_at_wide_and_phone_width(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    with server_story(story) as server:
        expect_browser(server, "planTabs.browser.mjs", [str(server.socket_path), "/tmp/journal-worker-536-plan-tabs"])
