import json
from pathlib import Path

import pytest

from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_event_error import HookEventError
from core.base.driver.hook_event_version_error import HookEventVersionError

HOOK_FOLDER = Path(__file__).resolve().parents[5] / "tools" / "journal-hook"
SCHEMA_EXAMPLES = sorted((HOOK_FOLDER / "event" / "testdata" / "schema").glob("*.json"))
PREPARED_OBJECTS = sorted((HOOK_FOLDER / "programs" / "testdata" / "prepared").glob("*/*.jsonl"))


@pytest.mark.parametrize("example", SCHEMA_EXAMPLES, ids=lambda path: path.stem)
def test_each_example_of_the_schema_is_read(example):
    data = json.loads(example.read_text())
    event = HookEvent.parsed(data)
    assert (event.program, event.event, event.session) == (data["program"], data["event"], data["session"])
    if data["tool"] is not None:
        assert event.tool is not None and event.tool.category == data["tool"]["kind"]


def test_every_object_the_go_program_prepared_from_the_recorded_bodies_is_read():
    lines = [line for path in PREPARED_OBJECTS for line in path.read_text().splitlines() if line.strip()]
    events = [HookEvent.parsed({**json.loads(line), "raw": {}}) for line in lines]
    assert len(events) == len(lines) > 1000


def test_a_shell_line_is_read_with_its_parts_and_their_paths():
    example = json.loads((HOOK_FOLDER / "event" / "testdata" / "schema" / "document_example.json").read_text())
    event = HookEvent.parsed(example)
    assert event.tool is not None and event.tool.shell is not None
    assert [part.program for part in event.tool.shell.parts] == [part["program"] for part in example["tool"]["shell"]["parts"]]


def test_another_version_is_refused_with_both_versions_named():
    example = json.loads((HOOK_FOLDER / "event" / "testdata" / "schema" / "stop.json").read_text())
    with pytest.raises(HookEventVersionError, match="version 2 .* reads version 1"):
        HookEvent.parsed({**example, "version": 2})


def test_a_missing_field_is_refused_by_its_name():
    example = json.loads((HOOK_FOLDER / "event" / "testdata" / "schema" / "stop.json").read_text())
    with pytest.raises(HookEventError, match="needs session"):
        HookEvent.parsed({key: value for key, value in example.items() if key != "session"})
