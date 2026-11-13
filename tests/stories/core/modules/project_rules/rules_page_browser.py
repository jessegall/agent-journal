from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_the_rules_page_shows_what_holds_and_marks_what_is_proposed(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    story.expect_success('rule make "Name things plainly"', "state: active")
    story.expect_success('rule make "Skip the tests"', "state: proposed", actor=story.agent)
    story.run_listeners()
    story.expect_success('actor make user "Ada"')
    with server_story(story) as server:
        expect_browser(server, "rulesPage.browser.mjs", [])
    story.expect_text("rule list --state active", "Skip the tests")
    story.expect_no_text("rule list --state active", "Name things plainly")
