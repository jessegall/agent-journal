from datetime import timedelta

import pytest

from tests.stories.server.support.server_client import server_story
from tests.stories.server.support.task_board import TwelveFinishedTasks
from tests.stories.support.story_checks import expect_value


@pytest.fixture
def finished_tasks_server(new_story):
    with server_story(new_story(fixture=TwelveFinishedTasks)) as server:
        yield server


def test_finished_tasks_with_equal_and_mixed_close_times_all_reach_the_viewer_once(finished_tasks_server):
    server = finished_tasks_server
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    group = finished_page(server, cookie)
    expect_value(group["total"], 12)
    expect_value([row["id"] for row in group["rows"]], list(range(12, 2, -1)))
    expect_value(len({row["closed_at"] for row in group["rows"]}), 1)
    last = group["rows"][-1]
    next_group = finished_page(server, cookie, last)
    expect_value(next_group["total"], 12)
    expect_value([row["id"] for row in next_group["rows"]], [2, 1])
    expect_value(finished_page(server, cookie, next_group["rows"][-1])["rows"], [])

    for number in range(13, 16):
        server.story.advance(timedelta(seconds=1))
        cancel_new_task(server, cookie, number)
    mixed = finished_page(server, cookie)
    older = finished_page(server, cookie, mixed["rows"][-1])
    ids = [row["id"] for row in [*mixed["rows"], *older["rows"]]]
    expect_value(ids, list(range(15, 0, -1)))
    expect_value(len(set(ids)), 15)
    expect_value(older["total"], 15)


def cancel_new_task(server, cookie, number):
    task = server.viewer_line_value(cookie, {"window": "tasks.tasks", "environment": "main", "line": ["task", "make", f"Closed task {number}"]})
    server.viewer_line_value(cookie, {"window": "tasks.tasks", "environment": "main", "line": ["task", "cancel", str(task["id"]), "--reason", "finished"]})


def finished_page(server, cookie, last=None):
    line = ["task", "board", "--state", "cancelled"]
    if last is not None:
        line.extend(["--before-closed-at", last["closed_at"], "--before-id", str(last["id"])])
    value = server.viewer_line_value(cookie, {"window": "tasks.tasks", "environment": "main", "line": line})
    return value["groups"][0]
