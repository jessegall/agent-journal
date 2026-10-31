import json
from pathlib import Path

from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask
from tests.stories.server.support.server_client import expect_equal_answers, server_story

RECORDED = Path(__file__).resolve().parents[3] / "tools" / "journal-hook" / "testdata" / "recorded" / "claude"
RAW_HEADERS = {"X-Journal-Request-At": "1793395000123", "X-Journal-Actor": "agent", "X-Journal-Env": "main"}


def recording(event: str, tool: str = "") -> dict[str, object]:
    for line in (RECORDED / f"{event}.jsonl").read_text().splitlines():
        body = json.loads(line)
        if not tool or body.get("tool_name") == tool:
            return {**body, "session_id": "s-1"}
    raise LookupError(f"no recorded {event} body for {tool}")


def decisions(new_story, body: dict[str, object]) -> tuple[tuple[object, object], tuple[object, object]]:
    with server_story(new_story(fixture=BuilderWithStartedTask)) as story:
        return story.raw_decision(body, {**RAW_HEADERS, "X-Journal-Hook-Id": "raw-1"}), story.program_decision(body)


def test_a_recorded_shell_hook_is_decided_the_same_raw_and_prepared(new_story):
    expect_equal_answers(*decisions(new_story, recording("PreToolUse", "Bash")))


def test_a_recorded_edit_hook_is_decided_the_same_raw_and_prepared(new_story):
    expect_equal_answers(*decisions(new_story, recording("PreToolUse", "Edit")))


def test_a_recorded_write_hook_is_decided_the_same_raw_and_prepared(new_story):
    expect_equal_answers(*decisions(new_story, recording("PreToolUse", "Write")))


def test_a_recorded_prompt_is_decided_the_same_raw_and_prepared(new_story):
    expect_equal_answers(*decisions(new_story, recording("UserPromptSubmit")))


def test_a_recorded_stop_is_refused_the_same_raw_and_prepared(new_story):
    expect_equal_answers(*decisions(new_story, recording("Stop")))
