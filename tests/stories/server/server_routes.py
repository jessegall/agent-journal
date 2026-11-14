

from engine.cli.console import REFUSED_CODE
from server.work.request_limits import CLI_LIMIT_SECONDS
from tests.stories.server.support.server_client import expect_timing_lines


def test_health_answers_with_the_servers_pid_and_code_version(task_server):
    story = task_server
    story.expect_health()


def test_a_command_line_through_the_server_prints_and_exits_as_a_direct_run(task_server):
    story = task_server
    story.expect_direct_run_answer("task list --oldest --environment main")


def test_a_refused_line_through_the_server_exits_with_its_refusal(task_server):
    story = task_server
    story.expect_cli_exit('task make "Loose"', "/elsewhere", REFUSED_CODE, "needs an environment")


def test_a_command_line_through_the_server_waits_for_another_writer_up_to_the_cli_limit(task_server):
    story = task_server
    story.expect_busy_timeout(CLI_LIMIT_SECONDS)


def test_a_timing_line_that_cannot_be_written_is_noted_and_the_request_still_answered(task_server):
    story = task_server
    story.expect_answer_with_unwritable_timing_log('task make "Fourth" --environment main')


def test_each_request_on_a_kept_connection_leaves_its_own_line_from_its_own_acceptance(task_server):
    story = task_server.story
    server = task_server
    server.post_repeated_health()
    expect_timing_lines(story.home, [("", ["server_accepted", "server_received", "answered"])] * 2)
