from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_the_integrations_window_reloads_installed_servers_on_server_changes(new_story):
    story = new_story(fixture=UserJoined)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, answer = window_data(server, cookie, window="mcp.integrations")
        story.expect_rows(status == 200, answer["declared"]["installed"]["events"] == ["mcp_server.*"],
                          answer["keys"]["installed"]["code"] == 0)
