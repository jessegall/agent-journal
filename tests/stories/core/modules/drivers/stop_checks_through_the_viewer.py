import pytest

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.server_client import server_story
from core.modules.tasks.nudges.current_task_nudge import CurrentTaskNudge


@pytest.fixture
def stop_server(new_story):
    with server_story(new_story(fixture=UserBuilder)) as server:
        yield server


def stop_record(server):
    sample = HookSamples.stop().with_fields(session="s-1", environment="main")
    server.expect_hook_answer("/hook", dict(sample.body), 200, '"refusal":')
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    value = server.viewer_line_value(cookie, {"line": ["hook-call", "stops", "--session-agent-id", str(server.story.agent.id)], "environment": "main", "window": "drivers.hook-calls"})
    server.story.expect_rows(len(value["rows"]) == 1)
    return value["rows"][0]


def test_an_allowed_stop_records_every_check_and_reason_through_the_viewer_route(stop_server):
    record = stop_record(stop_server)
    checks = {check["rule"]: check for check in record["stop_checks"]}
    stop_server.story.expect_rows(record["answer"] == "allowed", all(check["reason"] for check in checks.values()),
                                checks["tasks.carry-on-at-stop"]["reason"] == "the agent has no task in hand",
                                checks["messages.unread-at-stop"]["reason"] == "the agent has no unread user message",
                                checks["memories.weigh-first-stop"]["reason"] == "no active memories.weighing layer",
                                checks["workers.delivered-work-at-stop"]["reason"] == "no committed proof needs a check at this stop")
    stop_server.story.expect_text(f"hook-call stops --session-agent-id {stop_server.story.agent.id} --json", "the agent has no task in hand")
    stop_server.story.expect_rows("stop " not in stop_server.story.system_log_text())


def test_a_refused_stop_keeps_later_checks_without_applying_their_commands(stop_server):
    story = stop_server.story
    story.expect_success('task make "Build the page" --brief "Add the page" --environment main', actor=story.agent)
    story.expect_success("task start 1", actor=story.agent)
    record = stop_record(stop_server)
    checks = {check["rule"]: check for check in record["stop_checks"]}
    story.expect_rows(record["answer"] == "refused", CurrentTaskNudge.declared().nudge(task=1).text in checks["tasks.carry-on-at-stop"]["reason"],
                      not checks["coding.main-stop"]["applied"],
                      "Tasks 1 are yours and unfinished" in checks["coding.main-stop"]["reason"])
    lines = [line for line in story.system_log_text().splitlines() if "stop " in line and "refused" in line]
    story.expect_rows(len(lines) == 1, len(lines[0]) < 300, "tasks.carry-on-at-stop" in lines[0], detail=str(lines))

