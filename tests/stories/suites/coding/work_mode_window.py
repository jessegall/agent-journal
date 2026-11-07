from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_work_mode_reads_only_visible_settings_and_asks_for_activity_on_a_pick(new_story):
    story = new_story(fixture=BuilderWithUser)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        query = "environment=main"
        status, answer = window_data(server, cookie, window="coding.work-mode", query=query)
        story.expect_rows(status == 200, set(answer["keys"]) == {"work", "auto"},
                          all(key_answer["code"] == 0 for key_answer in answer["keys"].values()))
        status, settings = window_data(server, cookie, keys="dispatches,merger", window="coding.work-mode", query=f"{query}&tab=settings")
        story.expect_rows(status == 200, set(settings["keys"]) == {"dispatches", "merger"},
                          all(key_answer["code"] == 0 for key_answer in settings["keys"].values()))
        server.viewer_line_value(cookie, {"window": "coding.work-mode", "environment": "main",
                                          "line": ["setting", "set", "journal.suites.coding.auto-mode", "false"]})
        status, auto = window_data(server, cookie, keys="auto", window="coding.work-mode")
        story.expect_rows(status == 200, auto["keys"]["auto"]["value"]["value"] is False)
        status, bars = window_data(server, cookie, keys="bars", window="coding.work-mode")
        story.expect_rows(status == 200, set(bars["keys"]) == {"bars"}, bars["keys"]["bars"]["code"] == 0)
