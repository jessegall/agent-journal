import shutil

import pytest

from tests.stories.core.support.fixtures import ThreeTasks
from tests.stories.server.support.client_binary import ClientBinary

pytestmark = pytest.mark.skipif(shutil.which("go") is None, reason="the Go client needs go to build")


def test_the_first_command_starts_the_server_and_the_next_is_answered_by_the_same_one(new_story, tmp_path):
    with ClientBinary(new_story(fixture=ThreeTasks).home, tmp_path) as client:
        client.expect_answer("task list --oldest", "1  First  open  normal")
        first_server = client.server_pid()
        client.expect_answer("task show 2", "title: Second")
        client.expect_server_pid(first_server)


def test_server_stop_stops_the_server_and_lets_its_lock_go(new_story, tmp_path):
    with ClientBinary(new_story(fixture=ThreeTasks).home, tmp_path) as client:
        client.expect_answer("task list --oldest", "1  First  open  normal")
        client.expect_answer("server stop", "the server stopped")
        client.expect_no_server()


def test_a_line_sent_by_the_client_leaves_a_timing_line_from_go_start_to_answered(new_story, tmp_path):
    with ClientBinary(new_story(fixture=ThreeTasks).home, tmp_path) as client:
        client.expect_answer("task list --oldest", "1  First  open  normal")
        client.expect_answer("server stop", "the server stopped")
        client.expect_timing_names("task list", ["go_start", "go_sent", "server_accepted", "server_received", "command_started", "command_done", "answered"])
