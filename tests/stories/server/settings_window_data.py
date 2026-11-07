from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_settings_window_reads_the_active_tab_and_commands_on_request(new_story):
    story = new_story(fixture=UserJoined)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, settings = window_data(server, cookie, window="settings.settings", query="environment=main&tab=settings")
        story.expect_rows(status == 200, set(settings["keys"]) == {"settings"}, settings["keys"]["settings"]["code"] == 0)
        status, environments = window_data(server, cookie, window="settings.settings", query="environment=main&tab=environments")
        story.expect_rows(status == 200, set(environments["keys"]) == {"environments"}, environments["keys"]["environments"]["code"] == 0)
        status, commands = window_data(server, cookie, keys="commands", window="settings.settings")
        story.expect_rows(status == 200, commands["keys"]["commands"]["code"] == 0)
