from tests.stories.server.support.server_fixtures import task_server

import pytest

from engine.file.file_access import FileAccess
from engine.serving.server_files import ServerFiles
from core.modules.processes.support.request_log import RequestLog
from core.modules.processes.support.request_log_entry import RequestLogEntry

import json
import os
import sqlite3
from pathlib import Path

from engine.driver.hook_event import HOOK_EVENT_VERSION
from core.modules.drivers.bindings.agent_hook_route import AgentHookRoute
from engine.performance.timing import TIMING_HEADER
from core.modules.developer.support.hook_request_log import HookRequestLog
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.engine.driver.support.fixtures import LeadStarted
from tests.stories.engine.driver.support.samples import SAMPLES
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OpenTaskBuilder
from tests.stories.core.support.fixtures import ThreeTasks, UserJoined
from tests.stories.server.support.server_client import STORY_HOOK_LIMIT_SECONDS, STORY_STOP_LIMIT_SECONDS, expect_timing_lines, server_story
from engine.testing.expectations.expect_row import expect_row

RAW_HEADERS = {"X-Journal-Request-At": "1793395000123", "X-Journal-Hook-Id": "7731-1793395000123", "X-Journal-Actor": "agent", "X-Journal-Env": "main"}
SCHEMA_EXAMPLES = Path(__file__).resolve().parents[3] / "tools" / "journal-hook" / "event" / "testdata" / "schema"



def example(name: str) -> object:
    return json.loads((SCHEMA_EXAMPLES / f"{name}.json").read_text())


def test_a_prepared_hook_object_is_read_and_let_through_until_the_drivers_decide(task_server):
    story = task_server
    for name in ("document_example", "edit", "write", "prompt", "stop"):
        story.expect_hook_answer("/hook", example(name), 200, '"refusal": ""')


def test_a_hook_is_recorded_as_it_was_sent_while_the_developer_option_is_on(new_story):
    started = new_story(fixture=UserJoined)
    started.expect_success("setting switch journal.core.developer.tools on --project", actor=started.user)
    started.expect_success("setting set journal.core.developer.tools.hooks.request-log true --project", actor=started.user)
    with server_story(started) as story:
        story.expect_hook_answer("/hook", example("edit"), 200, '"refusal": ""')
    expect_row(started.container.get(HookRequestLog).read()[0], body=example("edit"))


def test_a_raw_body_with_no_version_is_read_the_old_way(task_server):
    story = task_server
    raw = {"hook_event_name": "PreToolUse", "session_id": "s-1", "tool_name": "Bash", "tool_input": {"command": "ls"}}
    story.expect_hook_answer("/hook?program=claude", raw, 200, '"refusal": ""', RAW_HEADERS)


def test_a_hook_object_of_another_version_is_refused_naming_both_versions(task_server):
    story = task_server
    story.expect_hook_answer("/hook", {**example("stop"), "version": 1}, 400, f"version 1 of the prepared object, and this server reads version {HOOK_EVENT_VERSION}")


def test_a_hook_body_the_server_cannot_read_is_refused_with_its_reason(task_server):
    story = task_server
    story.expect_hook_answer("/hook?program=claude", {"hook_event_name": "Whatever"}, 400, "claude sends no 'Whatever' hook", RAW_HEADERS)
    story.expect_hook_answer("/hook?program=claude", {"hook_event_name": "Stop", "session_id": "s-1"}, 400, "the headers the hook sends")


def test_a_hook_sent_with_a_timing_leaves_one_log_line_with_the_hook_route_steps_in_order(task_server):
    story = task_server.story
    server = task_server
    server.expect_hook_answer("/hook", example("write"), 200, '"refusal": ""', {TIMING_HEADER: "go_start=1;go_sent=2"})
    expect_timing_lines(story.home, [(f"{os.getpid()}-1", ["go_start", "go_sent", "server_accepted", "server_received", "body_read", "stale_checked", "hook_body", "hook_json", "hook_locked", "hook_synced", "hook_read", "route_ready", "hook_answered", "answered"])])


def lead_stop(firing: str) -> dict[str, object]:
    return dict(HookSamples.stop().with_fields(session="s-1", environment="main", firing=firing).body)


def test_a_known_agents_hook_is_answered_over_the_socket_as_the_route_answers_it_in_process(lead_server):
    story = lead_server
    story.expect_hook_answer("/hook", lead_stop("server-1"), 200, "the lead stops here")


def test_a_hook_resent_under_its_firing_gets_its_stored_answer(lead_server):
    story = lead_server
    story.expect_hook_answer("/hook", lead_stop("server-2"), 200, '"hook_call_id": 2')
    story.expect_hook_answer("/hook", lead_stop("server-2"), 200, '"hook_call_id": 2')


def test_a_stop_that_waits_past_its_limit_on_a_busy_database_is_held(lead_server):
    started = lead_server.story
    story = lead_server
    writer = sqlite3.connect(started.home.database, timeout=1)
    writer.execute("BEGIN IMMEDIATE")
    try:
        story.expect_hook_answer("/hook", lead_stop("server-3"), 200, "the journal could not check this stop and holds it")
    finally:
        writer.rollback()
        writer.close()


def test_a_claude_stop_posted_as_a_prepared_object_is_refused_as_the_builder_decides(builder_server):
    story = builder_server
    story.expect_hook_answer("/hook", lead_stop("server-5"), 200, "task:1 is yours now")
    story.story.expect_success(lines.SECOND_HOOK_CALL, "driver: coding.main", "answer: refused")


def test_a_stop_that_waits_past_its_own_longer_limit_for_another_hook_is_held(lead_server):
    story = lead_server
    story.expect_locked_hook_answer(lead_stop("server-4"), "the journal could not check this stop and holds it", STORY_STOP_LIMIT_SECONDS + 1)


def test_a_stop_waits_past_the_hook_limit_for_another_hook_and_is_checked(lead_server):
    story = lead_server
    story.expect_locked_hook_answer(lead_stop("server-6"), '"hook_call_id"', (STORY_HOOK_LIMIT_SECONDS + STORY_STOP_LIMIT_SECONDS) / 2)


@pytest.mark.parametrize("role", ["worker", "helper"])
def test_a_workers_or_helpers_tool_that_waits_past_its_limit_is_refused_and_told_what_to_do(lead_server, role):
    body = dict(HookSamples.edit("a.py").with_fields(session="s-1", environment="main", firing=f"held-{role}", role=role).body)
    lead_server.expect_locked_hook_answer(body, "so it is held")
    lead_server.expect_locked_hook_answer(body, "stop and write in your report")


def test_a_main_agents_tool_that_waits_past_its_limit_goes_through_with_one_line(lead_server):
    body = dict(HookSamples.edit("a.py").with_fields(session="s-1", environment="main", firing="held-main", role="main").body)
    lead_server.expect_locked_hook_answer(body, "the journal let this through unchecked")


def test_a_workers_tool_from_an_old_hook_runner_is_refused(lead_server):
    body = dict(HookSamples.edit("a.py").with_fields(session="s-1", environment="main", firing="old-runner", role="worker", foreign=[{}]).body)
    lead_server.expect_hook_answer("/hook", body, 200, "so it is held")


def test_a_workers_tool_after_the_journal_fails_on_it_is_refused(lead_server, monkeypatch):
    def broken(route, event):
        raise ValueError("broken")

    monkeypatch.setattr(AgentHookRoute, "answer", broken)
    body = dict(HookSamples.edit("a.py").with_fields(session="s-1", environment="main", firing="failed", role="helper").body)
    lead_server.expect_hook_answer("/hook", body, 200, "so it is held")


def test_a_tool_hook_that_waits_past_its_limit_for_another_hook_is_let_through_with_one_line(lead_server):
    story = lead_server
    body = dict(HookSamples.sample("post_tool_use").with_fields(session="s-1", environment="main", firing="server-6").body)
    story.expect_locked_hook_answer(body, "another hook held the journal")



def test_a_hook_from_a_program_no_module_provides_is_refused_naming_it(lead_server):
    story = lead_server
    story.expect_hook_answer("/hook", {**lead_stop("server-6"), "program": "gemini"}, 400, "no module provides the agent program 'gemini'")




@pytest.fixture
def lead_server(new_story):
    with server_story(new_story(SAMPLES, fixture=LeadStarted)) as story:
        yield story


@pytest.fixture
def builder_server(new_story):
    with server_story(new_story(fixture=OpenTaskBuilder)) as story:
        yield story


def test_a_hook_held_while_the_journal_starts_keeps_its_row_under_its_session(lead_server):
    home = lead_server.story.home
    FileAccess.shared().write(ServerFiles(home).start_mark, "starting")
    lead_server.expect_hook_answer("/hook", lead_stop("server-7"), 200, '"refusal"')
    logged = [RequestLogEntry.parsed(line) for line in FileAccess.shared().read(RequestLog(home, FileAccess.shared()).path).splitlines() if line]
    lead_server.story.expect_rows(any(entry.session == "s-1" and entry.exit_code == 2 and entry.environment_id is None for entry in logged), detail=str(logged))
