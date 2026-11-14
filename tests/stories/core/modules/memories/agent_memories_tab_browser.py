from tests.stories.core.modules.memories.support.memory_owners import MainAndWorkerMemories, read_agent, started_agent
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_the_memories_tab_shows_in_the_inspector_of_a_worker_and_a_helper(new_story, tmp_path):
    story = new_story(fixture=MainAndWorkerMemories)
    worker = read_agent(story, "s-9")
    story.expect_success('memory make "Run the tests of the change only" --weight 9 --environment main', actor=worker)
    story.expect_success('memory make "Rebuild the dist after a Vue change" --weight 3 --environment main', actor=worker)
    removed = story.new_row_id('memory make "The old branch name" --weight 6 --environment main', actor=worker)
    story.expect_success(f'memory remove {removed} --reason "The branch was renamed"', actor=worker)
    helper = started_agent(story, "s-31", "helper")
    story.expect_success('memory make "A helper reads the diff first" --environment main', actor=helper)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    with server_story(story) as server:
        expect_browser(server, "agentMemories.browser.mjs", [str(worker.id), str(helper.id), str(tmp_path / "agent-memories")])
    print(f"Agent memories screenshots: {tmp_path}")
