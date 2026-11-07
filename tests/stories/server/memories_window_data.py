from tests.stories.core.modules.memories.support.memory_owners import MainAndWorkerMemories, agent_of
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_memories_window_reads_counts_and_filtered_rows_through_keys(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    worker = agent_of(story, "s-9")
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, counts = window_data(server, cookie, window="memories.memories")
        story.expect_rows(status == 200, counts["keys"]["counts"]["value"]["main_count"] == 1,
                          counts["keys"]["counts"]["value"]["agent_count"] == 1)
        query = "environment=main&memories.main-agent=true&memories.environment=main&memories.state=active&memories.limit=20"
        status, listed = window_data(server, cookie, keys="memories", window="memories.memories", query=query)
        story.expect_rows(status == 200, listed["keys"]["memories"]["code"] == 0,
                          listed["keys"]["memories"]["value"]["total"] == 1)
        query = "environment=main&memories.other-agents=true&memories.environment=main&memories.limit=20"
        status, listed = window_data(server, cookie, keys="memories", window="memories.memories", query=query)
        story.expect_rows(status == 200, listed["keys"]["memories"]["code"] == 0,
                          listed["keys"]["memories"]["value"]["agents"][0]["agent_id"] == worker.id)
