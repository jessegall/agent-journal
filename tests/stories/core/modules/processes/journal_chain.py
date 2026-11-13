import json
from pathlib import Path

from engine.enums.command_category import CommandCategory
from engine.driver.part import Part
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.modules.processes.support.process_nudges import MONITOR_NOTE
from engine.testing.expectations.said_nudge import said
JOURNAL_PART = ShellPart("journal", CommandCategory.JOURNAL, ["task", "show", "1"], subcommand="task")
LISTING_PART = ShellPart("ls", CommandCategory.SEARCH, ["build"])
TESTS_PART = ShellPart("pytest", CommandCategory.TEST_RUN, ["-q"])
REFUSAL = "a journal command may not follow a long command"


def test_asking_for_a_runs_status_is_answered_with_how_to_set_a_monitor(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    status = HookSamples.shell("journal output status 7", ShellPart("journal", CommandCategory.JOURNAL, ["output", "status", "7"], subcommand="output"))
    story.expect_hook_allowed("s-1", status, said(MONITOR_NOTE, output=7))




def test_a_parts_write_paths_are_read_from_the_field_the_hook_client_sends():
    schema = json.loads((Path(__file__).parents[5] / "tools/journal-hook/event/hook_event.schema.json").read_text())
    expect_dumps_with(schema, '"write_paths"')
    part = {"text": "cat > notes.txt", "program": "cat", "arguments": [], "classification": {"category": CommandCategory.EDIT.value, "effects": []}, "write_paths": ["notes.txt"]}
    expect_output_paths_parsed(part, ["notes.txt"])


def expect_output_paths_parsed(part, expected) -> None:
    actual = list(Part.parsed(part).output_paths)
    assert actual == expected, actual


def expect_dumps_with(schema, expected) -> None:
    actual = json.dumps(schema)
    assert expected in actual, actual
