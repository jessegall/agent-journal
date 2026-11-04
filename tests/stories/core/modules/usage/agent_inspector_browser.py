from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story

HELPER_START = "agent start {session} claude worker --parent {parent} --environment main"


def test_the_agent_inspector_is_a_600_wide_panel_of_bands_with_a_foot_at_wide_and_phone_width(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    helper = story.new_row_id(HELPER_START.format(session="s-2", parent=story.agent.id))
    ended = story.new_row_id(HELPER_START.format(session="s-3", parent=story.agent.id))
    story.expect_success(f"agent end {ended}", actor=story.user)
    with server_story(story) as server:
        expect_browser(server, "agentInspector.browser.mjs", [str(story.agent.id), str(helper), str(ended), "/tmp/journal-worker-536-agent-inspector"])
