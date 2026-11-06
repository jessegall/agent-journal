import json
import sqlite3
from concurrent.futures import ThreadPoolExecutor
from time import perf_counter, sleep

from server.hook.queue_priority import QueuePriority

import pytest

from core.base.driver.command_category import CommandCategory
from core.modules.developer.support.hook_request_log import HookRequestLog
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingOn
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_value


@pytest.fixture
def recording_server(new_story):
    with server_story(new_story(fixture=HookRecordingOn)) as server:
        yield server


@pytest.mark.parametrize("tools,recording,visible", [("on", "true", True), ("on", "false", False), ("off", "true", False), ("off", "false", False)])
def test_hook_navigation_requires_both_developer_tools_and_recording(recording_server, tools, recording, visible):
    server = recording_server
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    for line in (["setting", "switch", "journal.core.developer.tools", tools, "--project"],
                 ["setting", "set", "journal.core.developer.tools.hooks.request-log", recording, "--project"]):
        server.viewer_line_value(cookie, {"line": line, "environment": "main", "window": "settings.settings"})
    status, body, _ = server.viewer_download("/api/windows?environment=main", cookie)
    expect_value(status, 200)
    windows = json.loads(body)["windows"]
    expect_value_15('"developer.hook-requests"', body, visible)
    expect_value_15('"developer.numbers"', body, tools == "on")
    expect_group_window_windows("developer", windows, "developer.")


@pytest.mark.parametrize("event,outcome", [("post_tool_use", HookAnswer.ALLOWED), ("stop", HookAnswer.REFUSED)])
def test_completed_hook_requests_record_the_real_duration_and_decision(recording_server, event, outcome):
    server = recording_server
    story = server.story
    if outcome is HookAnswer.REFUSED:
        story.expect_success('task make "Fix the cart" --brief "Correct the cart total" --environment main', actor=story.agent)
        story.expect_success("task start 1", actor=story.agent)
    sample = HookSamples.sample(event).with_fields(session="s-1", environment="main", firing=f"record-{event}")
    server.expect_hook_answer("/hook", dict(sample.body), 200, '"refusal":')
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    value = server.viewer_line_value(cookie, {"line": ["developer", "hook-requests"], "environment": "main", "window": "developer.hook-requests"})
    request = value["rows"][0]
    expect_request_duration_greater(request, 0)
    expect_row(request, outcome=outcome.value)
    expect_row(request, body=dict(sample.body))


def test_a_hook_request_counts_the_parts_of_its_command_chain(recording_server):
    server = recording_server
    parts = [ShellPart("git", CommandCategory.VERSION_CONTROL, ["status"]), ShellPart("ls", CommandCategory.READ, [])]
    chain = HookSamples.shell("git status && ls", *parts).with_fields(session="s-1", environment="main", firing="record-chain")
    stop = HookSamples.sample("stop").with_fields(session="s-1", environment="main", firing="record-stop")
    for sample in (chain, stop):
        server.expect_hook_answer("/hook", dict(sample.body), 200, '"refusal":')
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    value = server.viewer_line_value(cookie, {"line": ["developer", "hook-requests"], "environment": "main", "window": "developer.hook-requests"})
    expect_part_count(value, [0, 2])


def test_the_hook_requests_page_scrolls_and_shows_each_part_in_a_browser(recording_server):
    story = recording_server.story
    story.expect_success("setting set journal.core.developer.tools.hooks.request-log-size 100 --project", actor=story.user)
    log = story.container.get(HookRequestLog)
    for number in range(70):
        shell = {"parts": [{"text": "ls"}] * 3} if number == 69 else {}
        log.record("claude", {"X-Journal-Hook-Id": f"request-{number}"}, {"event": "pre_tool_use", "tool": {"name": "Bash", "shell": shell}, "text": "x" * 4000},
                   number * 20, HookAnswer.REFUSED if number == 69 else HookAnswer.ALLOWED)
    expect_browser(recording_server, "hookRequests.browser.mjs", [])


def expect_part_count(value, expected) -> None:
    actual = [row['part_count'] for row in value['rows']]
    assert actual == expected, actual


def expect_request_duration_greater(request, expected) -> None:
    actual = request['duration_ms']
    assert actual > expected, actual


def expect_group_window_windows(text, windows, text_2) -> None:
    actual = all((window['group'] == text for window in windows if window['name'].startswith(text_2)))
    assert actual, actual


def expect_value_15(text, body, expected) -> None:
    actual = text in body.decode()
    assert actual is expected, actual



def test_requests_show_the_sender_and_queue_time(recording_server):
    server = recording_server
    story = server.story
    worker = story.new_row_id("agent start s-worker claude worker --environment main")
    story.expect_success(f'agent edit {worker} --given-name "Ada"')
    for session, role in (("s-1", "main"), ("s-worker", "worker")):
        sample = HookSamples.sample("post_tool_use").with_fields(session=session, role=role, firing=f"sender-{role}")
        server.expect_hook_answer("/hook", dict(sample.body), 200, '"refusal":')
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    server.viewer_line_value(cookie, {"line": ["task", "list"], "environment": "main", "window": "tasks.tasks"})
    server.expect_cli_exit("task list", "/", 0, "")
    value = server.viewer_line_value(cookie, {"line": ["developer", "hook-requests"], "environment": "main", "window": "developer.hook-requests"})
    rows = value["rows"]
    assert [row["sender"] for row in rows[:4]] == ["Command line", "Viewer", "Worker: Ada", "Main agent"]
    assert [row["event"] for row in rows[:2]] == ["task list", "task list"]
    assert all(row["queued_ms"] >= 0 for row in rows[:4])
    assert rows[0]["queued_ms"] == 0


def test_a_hook_shows_the_time_it_waited_for_another(recording_server):
    server = recording_server
    sample = HookSamples.sample("post_tool_use").with_fields(firing="queued")
    with ThreadPoolExecutor(1) as pool:
        with server.context.hook_database.used(QueuePriority.MAIN_AGENT_HOOK, 1):
            answer = pool.submit(server.expect_hook_answer, "/hook", dict(sample.body), 200, '"refusal":')
            sleep(0.1)
        answer.result()
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    value = server.viewer_line_value(cookie, {"line": ["developer", "hook-requests"], "environment": "main", "window": "developer.hook-requests"})
    assert value["rows"][0]["queued_ms"] >= 50


def test_recording_drops_requests_instead_of_waiting_for_a_writer(recording_server):
    server = recording_server
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    writer = sqlite3.connect(server.story.home.database, timeout=0)
    writer.execute("BEGIN IMMEDIATE")
    try:
        started_at = perf_counter()
        server.viewer_line_value(cookie, {"line": ["task", "list"], "environment": "main", "window": "tasks.tasks"})
        server.expect_cli_exit("task list", "/", 0, "")
        assert perf_counter() - started_at < 1
    finally:
        writer.rollback()
        writer.close()
    value = server.viewer_line_value(cookie, {"line": ["developer", "hook-requests"], "environment": "main", "window": "developer.hook-requests"})
    assert not any(row["event"] == "task list" for row in value["rows"])
