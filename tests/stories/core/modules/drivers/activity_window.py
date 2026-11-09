from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_activity_reads_its_selected_agent_and_pages_the_calls_key(new_story):
    story = new_story(fixture=UserBuilder)
    story.hook("s-1", HookSamples.stop().with_fields(firing="activity-stop"))
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        query = f"environment=main&calls.session-agent-id={story.agent.id}&calls.limit=1"
        status, answer = window_data(server, cookie, window="drivers.hook-calls", query=query)
        row = answer["keys"]["calls"]["value"]["rows"][0]
        story.expect_rows(status == 200, set(answer["keys"]) == {"calls"}, row["session_agent_id"] == story.agent.id,
                          row["hook"] == "stop", answer["declared"]["calls"]["page_size"] == 50)
        status, older = window_data(server, cookie, keys="calls", window="drivers.hook-calls", query=f"{query}&calls.before-id={row['id']}")
        story.expect_rows(status == 200, set(older["keys"]) == {"calls"}, older["keys"]["calls"]["value"]["rows"][0]["id"] < row["id"])
