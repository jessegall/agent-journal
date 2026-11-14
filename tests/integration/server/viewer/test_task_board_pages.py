import pytest

from engine.testing.fakes.manual_clock import ManualClock
from tests.integration.support.integration_server import integration_server


# a user, Ada, and twelve tasks she cancelled at one and the same moment, before the server starts
@pytest.fixture
def finished_tasks_server(journal):
    user = journal.make_user()
    journal.with_clock(ManualClock())
    for number in range(1, 13):
        assert journal.run(f'task make "Closed task {number}" --brief "A finished task" --environment main', user).code == 0
        assert journal.run(f'task cancel {number} --reason "finished"', user).code == 0
    with integration_server(journal) as server:
        yield server, server.expect_viewer_login(server.viewer_key("Ada"))


def cancel_new_task(server, cookie: str, number: int) -> None:
    task = server.viewer_line_value(cookie, {"window": "tasks.tasks", "environment": "main", "line": ["task", "make", f"Closed task {number}"]})
    server.viewer_line_value(cookie, {"window": "tasks.tasks", "environment": "main", "line": ["task", "cancel", str(task["id"]), "--reason", "finished"]})


def finished_page(server, cookie: str, last: dict | None = None) -> dict:
    line = ["task", "board", "--state", "cancelled"]
    if last is not None:
        line.extend(["--before-closed-at", last["closed_at"], "--before-id", str(last["id"])])
    return server.viewer_line_value(cookie, {"window": "tasks.tasks", "environment": "main", "line": line})["groups"][0]


def test_finished_tasks_with_equal_and_mixed_close_times_all_reach_the_viewer_once(finished_tasks_server):
    server, cookie = finished_tasks_server
    group = finished_page(server, cookie)
    assert group["total"] == 12 and [row["id"] for row in group["rows"]] == list(range(12, 2, -1)), group
    assert len({row["closed_at"] for row in group["rows"]}) == 1
    next_group = finished_page(server, cookie, group["rows"][-1])
    assert next_group["total"] == 12 and [row["id"] for row in next_group["rows"]] == [2, 1], next_group
    assert finished_page(server, cookie, next_group["rows"][-1])["rows"] == []
    for number in range(13, 16):
        cancel_new_task(server, cookie, number)
    mixed = finished_page(server, cookie)
    older = finished_page(server, cookie, mixed["rows"][-1])
    ids = [row["id"] for row in [*mixed["rows"], *older["rows"]]]
    assert ids == list(range(15, 0, -1)) and len(set(ids)) == 15 and older["total"] == 15, ids
