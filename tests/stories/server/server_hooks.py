import json
import os
from pathlib import Path

from core.base.timing import TIMING_HEADER
from tests.stories.core.support.fixtures import ThreeTasks
from tests.stories.server.support.server_client import expect_timing_lines, server_story

RAW_HEADERS = {"X-Journal-Request-At": "1793395000123", "X-Journal-Hook-Id": "7731-1793395000123", "X-Journal-Actor": "agent", "X-Journal-Env": "main"}
SCHEMA_EXAMPLES = Path(__file__).resolve().parents[3] / "tools" / "journal-hook" / "event" / "testdata" / "schema"


def example(name: str) -> object:
    return json.loads((SCHEMA_EXAMPLES / f"{name}.json").read_text())


def test_a_prepared_hook_object_is_read_and_let_through_until_the_drivers_decide(new_story):
    with server_story(new_story(fixture=ThreeTasks)) as story:
        for name in ("document_example", "edit", "write", "prompt", "stop"):
            story.expect_hook_answer("/hook", example(name), 200, "")


def test_a_raw_body_with_no_version_is_read_the_old_way(new_story):
    with server_story(new_story(fixture=ThreeTasks)) as story:
        raw = {"hook_event_name": "PreToolUse", "session_id": "s-1", "tool_name": "Bash", "tool_input": {"command": "ls"}}
        story.expect_hook_answer("/hook?program=claude", raw, 200, "", RAW_HEADERS)


def test_a_hook_object_of_another_version_is_refused_naming_both_versions(new_story):
    with server_story(new_story(fixture=ThreeTasks)) as story:
        story.expect_hook_answer("/hook", {**example("stop"), "version": 2}, 400, "version 2 of the prepared object, and this server reads version 1")


def test_a_hook_body_the_server_cannot_read_is_refused_with_its_reason(new_story):
    with server_story(new_story(fixture=ThreeTasks)) as story:
        story.expect_hook_answer("/hook?program=claude", {"hook_event_name": "Whatever"}, 400, "hook_event_name", RAW_HEADERS)
        story.expect_hook_answer("/hook?program=claude", {"hook_event_name": "Stop", "session_id": "s-1"}, 400, "the headers the hook sends")


def test_a_hook_sent_with_a_timing_leaves_one_log_line_with_the_hook_route_steps_in_order(new_story):
    story = new_story(fixture=ThreeTasks)
    with server_story(story) as server:
        server.expect_hook_answer("/hook", example("write"), 200, "", {TIMING_HEADER: "go_start=1;go_sent=2"})
    expect_timing_lines(story.home, [(f"{os.getpid()}-1", ["go_start", "go_sent", "server_accepted", "server_received", "hook_read", "hook_answered", "answered"])])
