import json
import os
import sqlite3
from pathlib import Path

from core.base.timing import TIMING_HEADER
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.drivers.support.fixtures import LeadStarted
from tests.stories.core.base.drivers.support.samples import SAMPLES
from tests.stories.core.support.fixtures import ThreeTasks
from tests.stories.server.support.server_client import expect_timing_lines, server_story

RAW_HEADERS = {"X-Journal-Request-At": "1793395000123", "X-Journal-Hook-Id": "7731-1793395000123", "X-Journal-Actor": "agent", "X-Journal-Env": "main"}
SCHEMA_EXAMPLES = Path(__file__).resolve().parents[3] / "tools" / "journal-hook" / "event" / "testdata" / "schema"


def example(name: str) -> object:
    return json.loads((SCHEMA_EXAMPLES / f"{name}.json").read_text())


def test_a_prepared_hook_object_is_read_and_let_through_until_the_drivers_decide(new_story):
    with server_story(new_story(fixture=ThreeTasks)) as story:
        for name in ("document_example", "edit", "write", "prompt", "stop"):
            story.expect_hook_answer("/hook", example(name), 200, '"refusal": ""')


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


def lead_stop(firing: str) -> dict[str, object]:
    return dict(HookSamples.stop().with_fields(session="s-1", environment="main", firing=firing).body)


def test_a_known_agents_hook_is_answered_over_the_socket_as_the_route_answers_it_in_process(new_story):
    with server_story(new_story(SAMPLES, fixture=LeadStarted)) as story:
        story.expect_hook_answer("/hook", lead_stop("server-1"), 200, "the lead stops here")


def test_a_hook_resent_under_its_firing_gets_its_stored_answer(new_story):
    with server_story(new_story(SAMPLES, fixture=LeadStarted)) as story:
        story.expect_hook_answer("/hook", lead_stop("server-2"), 200, '"hook_call_id": 2')
        story.expect_hook_answer("/hook", lead_stop("server-2"), 200, '"hook_call_id": 2')


def test_a_hook_that_waits_past_its_limit_on_a_busy_database_is_let_through_with_one_line(new_story):
    started = new_story(SAMPLES, fixture=LeadStarted)
    with server_story(started) as story:
        writer = sqlite3.connect(started.home.database, timeout=1)
        writer.execute("BEGIN IMMEDIATE")
        try:
            story.expect_hook_answer("/hook", lead_stop("server-3"), 200, "the journal let this through unchecked")
        finally:
            writer.rollback()
            writer.close()

