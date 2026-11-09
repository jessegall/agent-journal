import json
from urllib.parse import urlencode

import pytest

from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingEnabled
from tests.stories.server.support.server_client import server_story
from tests.stories.server.viewer_request_attribution import request
from tests.stories.server.window_data_route import window_data


@pytest.fixture
def request_log_server(new_story):
    story = new_story(fixture=HookRecordingEnabled)
    with server_story(story, listener_thread_started=False) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        request(server, cookie, "/api/line", {"window": "tasks.tasks", "environment": "main", "line": ["task", "list"]})
        yield server, cookie


def test_request_filters_reach_the_key_and_the_queue_is_requested_separately(request_log_server):
    server, cookie = request_log_server
    query = urlencode({"environment": "main", "requests.kinds": json.dumps(["viewer", "hook"]), "requests.families": json.dumps(["task", "process bookkeeping"])})
    status, answer = window_data(server, cookie, window="developer.hook-requests", query=query)
    rows = answer["keys"]["requests"]["value"]["rows"]
    server.story.expect_rows(status == 200, set(answer["keys"]) == {"requests"}, bool(rows),
                             all(row["category"] == "viewer" and row["family"] == "task" for row in rows))
    status, queue = window_data(server, cookie, keys="queue", window="developer.hook-requests")
    server.story.expect_rows(status == 200, set(queue["keys"]) == {"queue"}, queue["keys"]["queue"]["code"] == 0)


@pytest.mark.parametrize("value", ["invalid JSON", '[1]', '{"kind":"viewer"}'])
def test_an_invalid_filter_list_refuses_only_its_key(request_log_server, value):
    server, cookie = request_log_server
    query = urlencode({"environment": "main", "requests.kinds": value})
    status, answer = window_data(server, cookie, keys="requests,queue", window="developer.hook-requests", query=query)
    server.story.expect_rows(status == 200, answer["keys"]["requests"]["code"] != 0, answer["keys"]["queue"]["code"] == 0)
