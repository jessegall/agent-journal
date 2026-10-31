import os

from core.base.cli.console import REFUSED_CODE
from server.endpoints.cli_endpoint import CLI_LIMIT_SECONDS
from tests.stories.core.support.fixtures import ThreeTasks
from tests.stories.server.support.server_client import expect_trail_lines, expect_trail_report_steps, server_story


def test_health_answers_with_the_servers_pid_and_code_version(new_story):
    with server_story(new_story(fixture=ThreeTasks)) as story:
        story.expect_health()


def test_a_command_line_through_the_server_prints_and_exits_as_a_direct_run(new_story):
    with server_story(new_story(fixture=ThreeTasks)) as story:
        story.expect_direct_run_answer("task list --oldest --environment main")


def test_a_refused_line_through_the_server_exits_with_its_refusal(new_story):
    with server_story(new_story(fixture=ThreeTasks)) as story:
        story.expect_cli_exit('task make "Loose"', "/elsewhere", REFUSED_CODE, "needs an environment")


def test_an_unknown_route_is_404_and_a_body_that_is_no_command_line_is_400(new_story):
    with server_story(new_story(fixture=ThreeTasks)) as story:
        story.expect_status("GET", "/nowhere", None, 404)
        story.expect_status("POST", "/cli", {"argv": "task list"}, 400)


def test_two_writes_sent_at_once_are_both_saved(new_story):
    with server_story(new_story(fixture=ThreeTasks)) as story:
        story.expect_writes_at_once(['task make "Fourth" --environment main', 'task make "Fifth" --environment main'])
        story.expect_direct_run_answer("task list --oldest --environment main")


def test_a_command_line_through_the_server_waits_for_another_writer_up_to_the_cli_limit(new_story):
    with server_story(new_story(fixture=ThreeTasks)) as story:
        story.expect_busy_timeout(CLI_LIMIT_SECONDS)


def test_a_write_whose_deadline_passed_before_the_commit_writes_nothing(new_story):
    with server_story(new_story(fixture=ThreeTasks)) as story:
        story.expect_deadline_rollback('task make "Late" --environment main', "task list --oldest", "4  Late  open  normal")


def test_an_error_outside_a_command_is_answered_500_with_one_line_and_logged_with_its_traceback(new_story):
    with server_story(new_story(fixture=ThreeTasks)) as story:
        story.expect_raw_request_error(b"POST /cli HTTP/1.1\r\nHost: journal\r\nContent-Length: many\r\nConnection: close\r\n\r\n", "ValueError")


def test_a_write_sent_with_a_trail_leaves_one_log_line_with_every_stamp_in_order(new_story):
    story = new_story(fixture=ThreeTasks)
    with server_story(story) as server:
        server.send_with_trail('task make "Fourth" --environment main', "go_start=1;go_sent=2")
    expect_trail_lines(story.home, [(f"{os.getpid()}-1", ["go_start", "go_sent", "server_accepted", "server_received", "command_started", "write_started",
                                                          "committed", "command_done", "answered"])])
    expect_trail_report_steps(story.home, "/cli task make", ["go_start -> go_sent", "go_sent -> server_accepted", "server_accepted -> server_received",
                                                             "server_received -> command_started", "command_started -> write_started",
                                                             "write_started -> committed", "committed -> command_done", "command_done -> answered",
                                                             "whole request"])


def test_a_trail_line_that_cannot_be_written_is_noted_and_the_request_still_answered(new_story):
    with server_story(new_story(fixture=ThreeTasks)) as story:
        story.expect_answer_with_unwritable_trail_log('task make "Fourth" --environment main')


def test_each_request_on_a_kept_connection_leaves_its_own_line_from_its_own_acceptance(new_story):
    story = new_story(fixture=ThreeTasks)
    with server_story(story) as server:
        server.send_health_twice_on_one_connection()
    expect_trail_lines(story.home, [("", ["server_accepted", "server_received", "answered"])] * 2)
