from core.base.cli.console import REFUSED_CODE
from server.endpoints.cli_endpoint import CLI_LIMIT_SECONDS
from tests.stories.core.support.fixtures import ThreeTasks
from tests.stories.server.support.server_client import server_story


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
