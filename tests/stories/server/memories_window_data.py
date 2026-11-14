from tests.stories.core.modules.memories.support.memory_owners import MainAndWorkerMemories, read_agent
from tests.stories.server.support.server_client import server_story


def test_memories_window_reads_filtered_rows_through_keys_and_has_no_counts_key(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    worker = read_agent(story, "s-9")
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, counts = server.window_data(cookie, window="memories.memories")
        story.expect_rows(status == 200, "counts" not in counts["keys"])
        query = "environment=main&memories.main-agent=true&memories.environment=main&memories.state=active&memories.limit=20"
        status, listed = server.window_data(cookie, keys="memories", window="memories.memories", query=query)
        story.expect_rows(status == 200, listed["keys"]["memories"]["code"] == 0,
                          listed["keys"]["memories"]["value"]["total"] == 1)
        query = "environment=main&memories.other-agents=true&memories.environment=main&memories.limit=20"
        status, listed = server.window_data(cookie, keys="memories", window="memories.memories", query=query)
        story.expect_rows(status == 200, listed["keys"]["memories"]["code"] == 0,
                          listed["keys"]["memories"]["value"]["agents"][0]["agent_id"] == worker.id)
