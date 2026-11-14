from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingEnabled
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_numbers_sort_and_reset_through_the_window_route(new_story):
    story = new_story(fixture=HookRecordingEnabled)
    story.hook("s-1", HookSamples.stop())
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, answer = window_data(server, cookie, window="developer.numbers")
        rows = answer["keys"]["numbers"]["value"]["rows"]
        story.expect_rows(status == 200, set(answer["keys"]) == {"numbers"}, bool(rows),
                          [row["hook"] for row in rows] == sorted(row["hook"] for row in rows),
                          answer["declared"]["numbers"]["reload_seconds"] == 10)
        status, costliest = window_data(server, cookie, keys="numbers", window="developer.numbers", query="environment=main&numbers.costliest=true")
        points = [row["most_points"] for row in costliest["keys"]["numbers"]["value"]["rows"]]
        story.expect_rows(status == 200, points == sorted(points, reverse=True))
        server.viewer_line_value(cookie, {"window": "developer.numbers", "environment": "main", "line": ["developer", "reset-numbers"]})
        status, reset = window_data(server, cookie, keys="numbers", window="developer.numbers", query="environment=main&numbers.costliest=false")
        story.expect_rows(status == 200, reset["keys"]["numbers"]["code"] == 0)
