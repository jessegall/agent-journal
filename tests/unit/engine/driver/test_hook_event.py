import json
from pathlib import Path

import pytest

from engine.driver.hook_event import HookEvent
from engine.driver.errors.hook_event_error import HookEventError
from engine.driver.errors.hook_event_version_error import HookEventVersionError

HOOK_FOLDER = Path(__file__).resolve().parents[4] / "tools" / "journal-hook"
SCHEMA_EXAMPLES = sorted((HOOK_FOLDER / "event" / "testdata" / "schema").glob("*.json"))
SKIPPED_LINE = "skip"
PREPARED_OBJECTS = sorted((HOOK_FOLDER / "programs" / "testdata" / "prepared").glob("*/*.jsonl"))


@pytest.mark.parametrize("example", SCHEMA_EXAMPLES, ids=lambda path: path.stem)
def test_each_example_of_the_schema_is_read(example):
    data = json.loads(example.read_text())
    event = HookEvent.parsed(data)
    assert (event.program, event.event, event.session) == (data["program"], data["event"], data["session"])
    if data["tool"] is not None:
        assert event.tool is not None and event.tool.category == data["tool"]["category"]


def test_every_object_the_go_program_prepared_from_the_recorded_bodies_is_read():
    lines = [line for path in PREPARED_OBJECTS for line in path.read_text().splitlines() if line.strip() and line != SKIPPED_LINE]
    events = [HookEvent.parsed({**json.loads(line), "raw": {}}) for line in lines]
    assert len(events) == len(lines) > 1000


def test_a_shell_line_is_read_with_its_parts_and_their_paths():
    example = json.loads((HOOK_FOLDER / "event" / "testdata" / "schema" / "document_example.json").read_text())
    event = HookEvent.parsed(example)
    assert event.tool is not None and event.tool.shell is not None
    assert [part.program for part in event.tool.shell.parts] == [part["program"] for part in example["tool"]["shell"]["parts"]]


def test_an_old_runner_with_a_project_hook_is_rejected():
    example = json.loads((HOOK_FOLDER / "event" / "testdata" / "schema" / "foreign.json").read_text())
    del example["foreign"][0]["answer"]
    with pytest.raises(HookEventVersionError, match="update the hook runner"):
        HookEvent.parsed(example)


def test_another_version_is_refused_with_both_versions_named():
    example = json.loads((HOOK_FOLDER / "event" / "testdata" / "schema" / "stop.json").read_text())
    with pytest.raises(HookEventVersionError, match="version 1 .* reads version 3"):
        HookEvent.parsed({**example, "version": 1})


def test_foreign_hook_results_are_parsed():
    example = json.loads((HOOK_FOLDER / "event" / "testdata" / "schema" / "stop.json").read_text())
    fields = {"id": "check", "exit_code": 2, "stdout": "blocked", "stderr": "details", "milliseconds": 17, "timed_out": False, "answer": {}}
    event = HookEvent.parsed({**example, "version": 3, "foreign": [fields]})
    assert len(event.foreign) == 1
    run = event.foreign[0]
    assert (run.id, run.exit_code, run.stdout, run.stderr, run.milliseconds, run.timed_out) == ("check", 2, "blocked", "details", 17, False)


def test_an_empty_foreign_list_is_parsed():
    example = json.loads((HOOK_FOLDER / "event" / "testdata" / "schema" / "stop.json").read_text())
    assert HookEvent.parsed({**example, "version": 3, "foreign": []}).foreign == ()


def test_version_two_has_no_compatibility_reader():
    example = json.loads((HOOK_FOLDER / "event" / "testdata" / "schema" / "stop.json").read_text())
    with pytest.raises(HookEventVersionError, match="version 2 .* reads version 3"):
        HookEvent.parsed({key: value for key, value in {**example, "version": 2}.items() if key != "foreign"})


def test_foreign_results_are_required():
    example = json.loads((HOOK_FOLDER / "event" / "testdata" / "schema" / "stop.json").read_text())
    with pytest.raises(HookEventError, match="needs foreign"):
        HookEvent.parsed({key: value for key, value in {**example, "version": 3}.items() if key != "foreign"})


@pytest.mark.parametrize("foreign", [None, {}, [None], [{"id": "check"}], [{"id": "check", "exit_code": 0, "stdout": "", "stderr": "", "milliseconds": 0, "timed_out": "false"}]])
def test_invalid_foreign_results_are_refused(foreign):
    example = json.loads((HOOK_FOLDER / "event" / "testdata" / "schema" / "stop.json").read_text())
    with pytest.raises(HookEventError):
        HookEvent.parsed({**example, "version": 3, "foreign": foreign})


def test_a_missing_field_is_refused_by_its_name():
    example = json.loads((HOOK_FOLDER / "event" / "testdata" / "schema" / "stop.json").read_text())
    with pytest.raises(HookEventError, match="needs session"):
        HookEvent.parsed({key: value for key, value in example.items() if key != "session"})
