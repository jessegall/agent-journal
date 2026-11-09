from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_the_terminal_reads_its_agents_calls_then_requests_older_calls_and_output(new_story):
    story = new_story(fixture=UserBuilder)
    story.hook("s-1", HookSamples.stop().with_fields(firing="terminal-stop"))
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        query = f"environment=main&calls.session-agent-id={story.agent.id}&calls.limit=1"
        status, answer = window_data(server, cookie, window="coding.terminal", query=query)
        newest = answer["keys"]["calls"]["value"]["rows"][0]
        story.expect_rows(status == 200, set(answer["keys"]) == {"calls"}, newest["session_agent_id"] == story.agent.id,
                          newest["hook"] == "stop", answer["declared"]["calls"]["page_size"] == 200)
        status, older = window_data(server, cookie, keys="calls", window="coding.terminal", query=f"{query}&calls.before-id={newest['id']}")
        story.expect_rows(status == 200, set(older["keys"]) == {"calls"}, older["keys"]["calls"]["value"]["rows"][0]["id"] < newest["id"])
        key = f"terminal-calls.{story.agent.id}"
        status, embedded = window_data(server, cookie, keys=key, window="agents.agents")
        story.expect_rows(status == 200, set(embedded["keys"]) == {key},
                          all(row["session_agent_id"] == story.agent.id for row in embedded["keys"][key]["value"]["rows"]))
        key = f"terminal-output.{newest['id']}"
        status, output = window_data(server, cookie, keys=key, window="coding.terminal")
        story.expect_rows(status == 200, set(output["keys"]) == {key}, output["keys"][key]["code"] == 0,
                          output["keys"][key]["value"]["lines"] == [])
