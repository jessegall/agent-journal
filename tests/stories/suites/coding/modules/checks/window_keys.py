from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_the_checks_window_reads_its_list_and_requests_history_separately(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('check make "Cart totals" --command "true" --every 0', "check 1: Cart totals", actor=story.user)
    check = 1
    story.expect_success(f"check stop {check}", actor=story.user)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, answer = window_data(server, cookie, window="checks.checks")
        story.expect_rows(status == 200, set(answer["keys"]) == {"checks"},
                          answer["keys"]["checks"]["value"]["rows"][0]["stopped"])
        server.viewer_line_value(cookie, {"window": "checks.checks", "environment": "main", "line": ["check", "start", str(check)]})
        status, answer = window_data(server, cookie, keys="checks", window="checks.checks")
        story.expect_rows(status == 200, not answer["keys"]["checks"]["value"]["rows"][0]["stopped"])
        status, history = window_data(server, cookie, keys=f"runs.{check}", window="checks.checks")
        story.expect_rows(status == 200, set(history["keys"]) == {f"runs.{check}"},
                          history["keys"][f"runs.{check}"]["value"]["rows"] == [])
