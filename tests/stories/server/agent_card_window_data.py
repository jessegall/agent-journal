from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_an_open_agent_key_keeps_the_agent_after_it_leaves_the_working_list(new_story):
    story = new_story(fixture=BuilderWithUser)
    agent_id = story.new_row_id("agent start inspect-helper claude helper --environment main")
    story.expect_success(f"agent end {agent_id}")
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, answer = window_data(server, cookie, keys=f"agents,card.{agent_id}", window="agents.agents", query="environment=main&agents.show=running")
        listed = answer["keys"]["agents"]["value"]["rows"]
        opened = answer["keys"][f"card.{agent_id}"]["value"]["rows"]
        story.expect_rows(status == 200, all(row["id"] != agent_id for row in listed),
                          len(opened) == 1, opened[0]["id"] == agent_id, bool(opened[0]["ended_at"]))
