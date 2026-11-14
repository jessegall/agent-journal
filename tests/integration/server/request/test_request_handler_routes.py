import json
import os
from pathlib import Path

from engine.cli.console import REFUSED_CODE
from engine.driver.hook_event import HOOK_EVENT_VERSION
from engine.performance.timing import TIMING_HEADER
from server.work.request_limits import CLI_LIMIT_SECONDS
from tests.integration.support.server_harness import expect_timing_lines

SCHEMA_EXAMPLES = Path(__file__).resolve().parents[4] / "tools" / "journal-hook" / "event" / "testdata" / "schema"
RAW_HEADERS = {"X-Journal-Request-At": "1793395000123", "X-Journal-Hook-Id": "7731-1793395000123", "X-Journal-Actor": "agent", "X-Journal-Env": "main"}


def example(name: str) -> object:
    return json.loads((SCHEMA_EXAMPLES / f"{name}.json").read_text())


def test_health_answers_with_the_servers_pid_and_code_version(task_server):
    task_server.expect_health()


def test_a_command_line_through_the_server_prints_and_exits_as_a_direct_run(task_server):
    task_server.expect_direct_run_answer("task list --oldest --environment main")


def test_a_refused_line_through_the_server_exits_with_its_refusal(task_server):
    task_server.expect_cli_exit('task make "Loose"', "/elsewhere", REFUSED_CODE, "needs an environment")


def test_a_command_line_through_the_server_waits_for_another_writer_up_to_the_cli_limit(task_server):
    task_server.expect_busy_timeout(CLI_LIMIT_SECONDS)


def test_a_timing_line_that_cannot_be_written_is_noted_and_the_request_still_answered(task_server):
    task_server.expect_answer_with_unwritable_timing_log('task make "Fourth" --environment main')


def test_each_request_on_a_kept_connection_leaves_its_own_line_from_its_own_acceptance(task_server):
    task_server.post_repeated_health()
    expect_timing_lines(task_server.home, [("", ["server_accepted", "server_received", "answered"])] * 2)


def test_a_prepared_hook_object_is_read_and_let_through_until_the_drivers_decide(task_server):
    for name in ("document_example", "edit", "write", "prompt", "stop"):
        task_server.expect_hook_answer("/hook", example(name), 200, '"refusal": ""')


def test_a_raw_body_with_no_version_is_read_the_old_way(task_server):
    raw = {"hook_event_name": "PreToolUse", "session_id": "s-1", "tool_name": "Bash", "tool_input": {"command": "ls"}}
    task_server.expect_hook_answer("/hook?program=claude", raw, 200, '"refusal": ""', RAW_HEADERS)


def test_a_hook_object_of_another_version_is_refused_naming_both_versions(task_server):
    task_server.expect_hook_answer("/hook", {**example("stop"), "version": 1}, 400, f"version 1 of the prepared object, and this server reads version {HOOK_EVENT_VERSION}")


def test_a_hook_body_the_server_cannot_read_is_refused_with_its_reason(task_server):
    task_server.expect_hook_answer("/hook?program=claude", {"hook_event_name": "Whatever"}, 400, "claude sends no 'Whatever' hook", RAW_HEADERS)
    task_server.expect_hook_answer("/hook?program=claude", {"hook_event_name": "Stop", "session_id": "s-1"}, 400, "the headers the hook sends")


def test_a_hook_sent_with_a_timing_leaves_one_log_line_with_the_hook_route_steps_in_order(task_server):
    task_server.expect_hook_answer("/hook", example("write"), 200, '"refusal": ""', {TIMING_HEADER: "go_start=1;go_sent=2"})
    expect_timing_lines(task_server.home, [(f"{os.getpid()}-1", ["go_start", "go_sent", "server_accepted", "server_received", "body_read", "stale_checked", "hook_body", "hook_json", "hook_locked", "hook_synced", "hook_read", "route_ready", "hook_answered", "answered"])])
