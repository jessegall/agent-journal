from tests.stories.core.support import story_lines as lines
import shutil

import pytest

from tests.stories.core.support.fixtures import ThreeTasks
from tests.stories.server.support.client_binary import ClientBinary

pytestmark = pytest.mark.skipif(shutil.which("go") is None, reason="the Go client needs go to build")


def test_the_first_command_starts_the_server_the_next_reuses_it_each_leaves_a_timing_line_and_server_stop_lets_its_lock_go(new_story, tmp_path):
    with ClientBinary(new_story(fixture=ThreeTasks).home, tmp_path) as client:
        client.expect_answer(lines.TASK_LIST, "1  First  open  normal")
        first_server = client.server_pid()
        client.expect_answer(lines.SECOND_TASK_DETAILS, "title: Second")
        client.expect_server_pid(first_server)
        client.expect_answer("server stop", "the server stopped")
        client.expect_no_server()
        client.expect_timing_names("task list", ["go_start", "go_sent", "server_accepted", "server_received", "body_read", "stale_checked", "command_started", "command_done", "answered"])
