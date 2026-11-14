import json
from pathlib import Path

import pytest

from tests.integration.support.integration_server import integration_server

ROOT = Path(__file__).resolve().parents[4]
HOOK_TESTDATA = ROOT / "tools" / "journal-hook" / "testdata"
PREPARED_TESTDATA = ROOT / "tools" / "journal-hook" / "programs" / "testdata" / "prepared" / "claude"
SKIPPED_LINE = "skip"
SESSION = "s-1"
RAW_HEADERS = {"X-Journal-Request-At": "1793395000123", "X-Journal-Actor": "agent", "X-Journal-Env": "main"}


@pytest.fixture
def prepared_server(journal):
    with integration_server(journal) as server:
        server.start_agent_on_task(SESSION)
        yield server


def recording(event: str, tool: str = "") -> tuple[dict[str, object], dict[str, object]]:
    bodies = (HOOK_TESTDATA / "recorded" / "claude" / f"{event}.jsonl").read_text().splitlines()
    prepared_lines = (PREPARED_TESTDATA / f"{event}.jsonl").read_text().splitlines()
    for body_line, prepared_line in zip(bodies, prepared_lines, strict=True):
        body = json.loads(body_line)
        if prepared_line != SKIPPED_LINE and (not tool or body.get("tool_name") == tool):
            raw = {**body, "session_id": SESSION}
            return raw, {**json.loads(prepared_line), "session": SESSION, "environment": "main", "raw": raw}
    raise LookupError(f"no recorded {event} body for {tool}")


def decision(server, body: dict[str, object], headers: dict[str, str]) -> tuple[object, object]:
    reply = server.request("POST", "/hook?program=claude", body, headers).json()
    assert isinstance(reply, dict), reply
    return reply["refusal"], reply["lines"]


def refusals(server, recorded: tuple[dict[str, object], dict[str, object]]) -> tuple[object, object]:
    body, prepared = recorded
    return decision(server, body, {**RAW_HEADERS, "X-Journal-Hook-Id": "raw-1"})[0], decision(server, prepared, {})[0]


def test_a_recorded_shell_hook_arriving_raw_is_left_unsplit_while_its_prepared_body_meets_the_runner(prepared_server):
    body, prepared = recording("PreToolUse", "Bash")
    raw_refusal, prepared_answer = decision(prepared_server, body, {**RAW_HEADERS, "X-Journal-Hook-Id": "raw-1"}), decision(prepared_server, prepared, {})
    assert raw_refusal[0] == ""
    assert prepared_answer[0] == "", prepared_answer
    assert "journal-run is not installed" in [line.split(" in ")[0] for line in prepared_answer[1]], prepared_answer


@pytest.mark.parametrize(("event", "tool"), [("PreToolUse", "Edit"), ("PreToolUse", "Write"), ("UserPromptSubmit", ""), ("Stop", "")])
def test_a_recorded_hook_is_decided_the_same_raw_and_prepared(prepared_server, event, tool):
    raw, prepared = refusals(prepared_server, recording(event, tool))
    assert raw == prepared, f"the raw body was refused {raw!r} and the prepared object {prepared!r}"
