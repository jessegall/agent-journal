from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_agent_card_links_its_current_plan(new_story, tmp_path):
    story = new_story(fixture=UserJoined)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.expect_success('plan make "Release work" --environment main', actor=story.user)
    story.expect_success('phase make --plan 1 "Build" --goal "Finish"', actor=story.user)
    task = story.new_row_id('task make "Build it" --phase 1 --environment main')
    story.expect_success('task make "Check it" --phase 1 --environment main')
    story.expect_success("plan ready 1", actor=story.agent)
    story.expect_success("plan approve 1 --environment main", actor=story.user)
    story.expect_success(f"task start {task}", actor=story.agent)
    with server_story(story) as server:
        expect_browser(server, "agentPlan.browser.mjs", [str(story.agent.id), str(tmp_path / "agent-plan.png")])
