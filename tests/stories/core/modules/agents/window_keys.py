import pytest

from tests.stories.core.modules.usage.agent_rows import StatesAgents
from tests.stories.core.modules.helpers.helper_jobs import helper_agent
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


@pytest.fixture
def agents_window(new_story):
    story = new_story(fixture=StatesAgents)
    with server_story(story) as server:
        yield server, server.expect_viewer_login(server.viewer_key("Ada"))


@pytest.mark.parametrize("window", ["agents.agents", "agents.helpers"])
def test_agent_windows_read_their_visible_keys_together(agents_window, window):
    server, cookie = agents_window
    status, answer = window_data(server, cookie, window=window, query="environment=main&agents.show=idle")
    server.story.expect_rows(status == 200, set(answer["keys"]) == {"agents", "filters", "programs", "waits", "progress"})
    server.story.expect_rows(all(response["code"] == 0 for response in answer["keys"].values()))
    rows = answer["keys"]["agents"]["value"]["rows"]
    server.story.expect_rows(bool(rows), all(row["state"] == "idle" and "facts" in row for row in rows))


def test_agent_filter_state_reaches_only_the_list_key(agents_window):
    server, cookie = agents_window
    status, answer = window_data(server, cookie, keys="agents", window="agents.agents",
                                 query="environment=main&agents.show=all&agents.roles=helper,reviewer&agents.search=missing-agent")
    server.story.expect_rows(status == 200, set(answer["keys"]) == {"agents"}, answer["keys"]["agents"]["code"] == 0,
                             answer["keys"]["agents"]["value"]["rows"] == [])


def test_a_card_requests_its_tool_and_transcript_without_the_list(agents_window):
    server, cookie = agents_window
    agent_id = helper_agent(server.story).id
    status, answer = window_data(server, cookie, keys=f"tool,transcript.{agent_id}", window="agents.agents",
                                 query=f"environment=main&tool.agent={agent_id}")
    server.story.expect_rows(status == 200, set(answer["keys"]) == {"tool", f"transcript.{agent_id}"},
                             all(response["code"] == 0 for response in answer["keys"].values()))


def test_the_standalone_transcript_reads_only_its_selected_agent_key(agents_window):
    server, cookie = agents_window
    agent_id = helper_agent(server.story).id
    status, answer = window_data(server, cookie, keys=f"transcript.{agent_id}", window="agents.transcript")
    server.story.expect_rows(status == 200, set(answer["keys"]) == {f"transcript.{agent_id}"},
                             answer["keys"][f"transcript.{agent_id}"]["code"] == 0)
    status, initial = window_data(server, cookie, window="agents.transcript")
    server.story.expect_rows(status == 200, initial["keys"] == {})
