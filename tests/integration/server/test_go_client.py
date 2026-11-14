import shutil

import pytest

from tests.integration.support.client_binary import ClientBinary

pytestmark = pytest.mark.skipif(shutil.which("go") is None, reason="the Go client needs go to build")

TIMING_NAMES = ["go_start", "go_sent", "server_accepted", "server_received", "body_read", "stale_checked", "command_started", "command_done", "answered"]


def test_the_first_command_starts_the_server_the_next_reuses_it_each_leaves_a_timing_line_and_server_stop_lets_its_lock_go(tasks_journal, tmp_path):
    with ClientBinary(tasks_journal.home, tmp_path) as client:
        client.expect_answer("task list", "1  First  A task to list  open  normal")
        first_server = client.server_pid()
        client.poll_finished_start()
        client.expect_answer("task show 2", "title: Second")
        client.expect_server_pid(first_server)
        client.expect_answer("server stop", "the server stopped")
        client.expect_no_server()
        client.expect_timing_names("task show", TIMING_NAMES)
