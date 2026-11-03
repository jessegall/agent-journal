import json

import pytest

from core.base.driver.command_category import CommandCategory
from core.modules.developer.support.hook_request_log import HookRequestLog
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingOn
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


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
    assert status == 200
    windows = json.loads(body)["windows"]
    assert ('"developer.hook-requests"' in body.decode()) is visible
    assert ('"developer.numbers"' in body.decode()) is (tools == "on")
    assert all(window["group"] == "developer" for window in windows if window["name"].startswith("developer."))


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
    assert request["duration_ms"] > 0
    assert request["outcome"] == outcome.value
    assert request["body"] == dict(sample.body)


def test_a_hook_request_counts_the_parts_of_its_command_chain(recording_server):
    server = recording_server
    parts = [ShellPart("git", CommandCategory.VERSION_CONTROL, ["status"]), ShellPart("ls", CommandCategory.READ, [])]
    chain = HookSamples.shell("git status && ls", *parts).with_fields(session="s-1", environment="main", firing="record-chain")
    stop = HookSamples.sample("stop").with_fields(session="s-1", environment="main", firing="record-stop")
    for sample in (chain, stop):
        server.expect_hook_answer("/hook", dict(sample.body), 200, '"refusal":')
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    value = server.viewer_line_value(cookie, {"line": ["developer", "hook-requests"], "environment": "main", "window": "developer.hook-requests"})
    assert [row["part_count"] for row in value["rows"]] == [0, 2]


def test_the_hook_requests_page_scrolls_and_shows_each_part_in_a_browser(recording_server):
    story = recording_server.story
    story.expect_success("setting set journal.core.developer.tools.hooks.request-log-size 100 --project", actor=story.user)
    log = story.container.get(HookRequestLog)
    for number in range(70):
        log.record("claude", {"X-Journal-Hook-Id": f"request-{number}"}, {"event": "pre_tool_use", "tool": {"name": "Bash"}, "text": "x" * 4000},
                   number * 20, HookAnswer.REFUSED if number == 69 else HookAnswer.ALLOWED)
    expect_browser(recording_server, "hookRequests.browser.mjs", [])
