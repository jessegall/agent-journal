from datetime import timedelta

from tests.stories.core.support.fixtures import UserJoined
from tests.stories.core.support.plan_steps import started_plan
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def started_ids(server, cookie: str) -> list[int]:
    status, answer = window_data(server, cookie, keys="started", window="plans.plans")
    assert status == 200 and answer["keys"]["started"]["code"] == 0, answer
    value = answer["keys"]["started"]["value"]
    return [value["started_total"]] + [plan["id"] for plan in value["plans"]]


def test_a_task_change_moves_its_plan_first_in_the_started_tab(new_story):
    story = new_story(fixture=UserJoined)
    older_task = started_plan(story, 1, "Older plan")
    story.advance(timedelta(minutes=5))
    started_plan(story, 2, "Newer plan")
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        story.expect_rows(started_ids(server, cookie) == [2, 2, 1])
        story.advance(timedelta(minutes=5))
        story.expect_success(f"task start {older_task} --environment main", actor=story.agent)
        story.expect_success(f'task close {older_task} --outcome "Done" --environment main', actor=story.agent)
        story.expect_rows(started_ids(server, cookie) == [2, 1, 2])
