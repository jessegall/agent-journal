from tests.stories.core.support.fixtures import PhaseWithThreeTasks
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_the_tasks_window_reads_its_visible_tab_and_requests_plan_places_on_demand(new_story):
    story = new_story(fixture=PhaseWithThreeTasks)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, listed = window_data(server, cookie, window="tasks.tasks", query="environment=main&tab=list&board.limit=1")
        story.expect_rows(status == 200, set(listed["keys"]) == {"board"}, listed["keys"]["board"]["code"] == 0)
        status, graph = window_data(server, cookie, window="tasks.tasks", query="environment=main&tab=graph")
        story.expect_rows(status == 200, set(graph["keys"]) == {"graph"}, graph["keys"]["graph"]["code"] == 0)
        status, places = window_data(server, cookie, keys="places", window="tasks.tasks")
        rows = places["keys"]["places"]["value"]["rows"]
        story.expect_rows(status == 200, set(places["keys"]) == {"places"}, len(rows) == 3,
                          rows[0]["label"] == "Plan 1: Version 5 core › Values", rows[0]["task_ids"] == [1, 2, 3])
