from tests.stories.core.support.agent_labels import agent_number
from datetime import timedelta

from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_both_agents_windows_keep_age_order_after_state_changes_and_a_new_agent(new_story):
    story = new_story(fixture=UserBuilder)
    agents = []
    for session, role in (("oldest", "helper"), ("middle", "worker"), ("newest", "reviewer")):
        agents.append(story.new_row_id(f"agent start {session} claude {role} --environment main"))
        story.advance(timedelta(seconds=1))
    story.expect_success(f"agent end {agents[1]}")
    story.expect_success(f"agent edit {agent_number(story, agents[0])} --paused-at {story.clock.timestamp().text}")
    with server_story(story) as server:
        expect_browser(server, "agentOrder.browser.mjs", [",".join(map(str, agents))])
        agents.append(story.new_row_id("agent start latest codex helper --environment main"))
        expect_browser(server, "agentOrder.browser.mjs", [",".join(map(str, agents))])
