from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_project_hooks_window_reads_its_groups_through_the_key(new_story):
    story = new_story(fixture=UserJoined)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, answer = window_data(server, cookie, window="settings.project-hooks")
        hooks = answer["keys"]["hooks"]
        story.expect_rows(status == 200, hooks["code"] == 0,
                          {"managed", "journal", "pending", "unmanaged", "fallback"} <= set(hooks["value"]))
