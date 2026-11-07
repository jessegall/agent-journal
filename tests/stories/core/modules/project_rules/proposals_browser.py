from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story

LONG_RULE = f"Name things plainly {'and say what they do ' * 12}until the end of the long rule"


def test_a_proposed_rule_shows_whole_on_an_orange_card_that_approve_and_deny_take_away(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.expect_success(f'rule make "{LONG_RULE}"', "state: proposed", actor=story.agent)
    story.expect_success('rule make "Skip the tests"', "state: proposed", actor=story.agent)
    story.run_listeners()
    story.expect_success('actor make user "Ada"')
    with server_story(story) as server:
        expect_browser(server, "proposedRule.browser.mjs", [])
    story.expect_text("rule list --state active", "Name things plainly")
    story.expect_no_text("rule list --state active", "Skip the tests")
