import json
from pathlib import Path

import pytest

from engine.driver.hook_event import HOOK_EVENT_VERSION, HookEvent
from engine.driver.hook_event_error import HookEventError
from engine.driver.hook_event_name import HookEventName

SCHEMA = Path(__file__).parents[4] / "tools" / "journal-hook" / "event" / "hook_event.schema.json"
STOP_BODY = {"version": HOOK_EVENT_VERSION, "program": "claude", "event": "stop", "session": "s-1", "firing": "f-1", "fired_at_ms": 1, "actor": "agent", "environment": "main",
             "helper": "", "tool": None, "prompt": None, "raw": {}, "accepts_lines": True, "launch": "", "foreign": []}
EVENT_NAMES = ["pre_tool_use", "post_tool_use", "post_tool_use_failure", "prompt", "stop", "stop_failure", "session_start", "session_end", "compact",
               "message_display", "tick"]


def schema_properties() -> dict[str, dict[str, object]]:
    return json.loads(SCHEMA.read_text())["properties"]


def test_the_hook_events_are_the_eleven_names_of_every_program():
    assert [name.value for name in HookEventName] == EVENT_NAMES


def test_a_helper_start_and_stop_are_no_event_names_of_their_own():
    assert not {"subagent_start", "subagent_stop"} & {name.value for name in HookEventName}


def test_the_schema_names_every_event_but_the_tick_the_server_sends_itself():
    assert schema_properties()["event"]["enum"] == [name for name in EVENT_NAMES if name != "tick"]


def test_the_schema_takes_any_program_name_in_plain_lowercase_words():
    assert schema_properties()["program"] == {"type": "string", "pattern": "^[a-z][a-z0-9_-]*$"}


def test_the_schema_names_whether_the_program_takes_lines_and_its_launch_name():
    assert {"accepts_lines", "launch"} <= set(schema_properties())


def test_a_parsed_hook_names_its_event_with_a_hook_event_name():
    assert HookEvent.parsed(STOP_BODY).event is HookEventName.STOP


def test_a_hook_naming_an_unknown_event_is_refused():
    with pytest.raises(HookEventError):
        HookEvent.parsed({**STOP_BODY, "event": "subagent_stop"})
