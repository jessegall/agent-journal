from tests.stories.core.modules.memories.support.memory_owners import MainAndWorkerMemories, agent_of, started_agent
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story

CAPTURE = "/tmp/memories-page"


def seed(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    for index in range(30):
        story.expect_success(f'memory make "Main agent memory {index}" --weight {1 + index % 9} --environment main', actor=story.user)
    for index in range(10, 14):
        agent = started_agent(story, f"s-{index}", "helper" if index % 2 else "worker")
        story.expect_success(f'memory make "Agent {index} keeps its branch clean" --environment main', actor=agent)
    ended = started_agent(story, "s-21", "reviewer")
    story.expect_success('memory make "A reviewer reads the whole diff" --environment main', actor=ended)
    story.expect_success(f"agent end {ended.id}", actor=story.user)
    story.expect_success(f"agent end {agent_of(story, 's-9').id}", actor=story.user)
    return story


def test_the_memories_page_shows_whose_memories_in_light_dark_and_phone_width(new_story):
    story = seed(new_story)
    with server_story(story) as server:
        expect_browser(server, "memoriesPage.browser.mjs", [CAPTURE])
