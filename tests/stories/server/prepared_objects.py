import json
from pathlib import Path

from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask
from tests.stories.server.support.server_client import expect_equal_answers, server_story

HOOK_TESTDATA = Path(__file__).resolve().parents[3] / "tools" / "journal-hook" / "testdata"
PREPARED_TESTDATA = Path(__file__).resolve().parents[3] / "tools" / "journal-hook" / "programs" / "testdata" / "prepared" / "claude"
SKIPPED_LINE = "skip"
RAW_HEADERS = {"X-Journal-Request-At": "1793395000123", "X-Journal-Actor": "agent", "X-Journal-Env": "main"}


def recording(event: str, tool: str = "") -> tuple[dict[str, object], dict[str, object]]:
    bodies = (HOOK_TESTDATA / "recorded" / "claude" / f"{event}.jsonl").read_text().splitlines()
    prepared_lines = (PREPARED_TESTDATA / f"{event}.jsonl").read_text().splitlines()
    for body_line, prepared_line in zip(bodies, prepared_lines, strict=True):
        body = json.loads(body_line)
        if prepared_line != SKIPPED_LINE and (not tool or body.get("tool_name") == tool):
            raw = {**body, "session_id": "s-1"}
            return raw, {**json.loads(prepared_line), "session": "s-1", "environment": "main", "raw": raw}
    raise LookupError(f"no recorded {event} body for {tool}")


def decisions(new_story, recorded: tuple[dict[str, object], dict[str, object]]) -> tuple[tuple[object, object], tuple[object, object]]:
    body, prepared = recorded
    with server_story(new_story(fixture=BuilderWithStartedTask)) as story:
        return story.hook_decision(body, {**RAW_HEADERS, "X-Journal-Hook-Id": "raw-1"}), story.hook_decision(prepared, {})


def test_a_recorded_shell_hook_arriving_raw_is_left_unsplit_while_its_prepared_body_meets_the_runner(new_story):
    raw, prepared = decisions(new_story, recording("PreToolUse", "Bash"))
    expect_equal_answers(raw, ("", []))
    expect_equal_answers((prepared[0], [line.split(" in ")[0] for line in prepared[1]]), ("", ["journal-run is not installed"]))


def test_a_recorded_edit_hook_is_decided_the_same_raw_and_prepared(new_story):
    expect_equal_answers(*decisions(new_story, recording("PreToolUse", "Edit")))


def test_a_recorded_write_hook_is_decided_the_same_raw_and_prepared(new_story):
    expect_equal_answers(*decisions(new_story, recording("PreToolUse", "Write")))


def test_a_recorded_prompt_is_decided_the_same_raw_and_prepared(new_story):
    expect_equal_answers(*decisions(new_story, recording("UserPromptSubmit")))


def test_a_recorded_stop_is_refused_the_same_raw_and_prepared(new_story):
    expect_equal_answers(*decisions(new_story, recording("Stop")))
