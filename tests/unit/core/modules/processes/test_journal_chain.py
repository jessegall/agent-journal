from pathlib import Path
import json

from engine.driver.part import Part
from engine.enums.command_category import CommandCategory
from engine.testing.examples.shell_part import ShellPart

JOURNAL_PART = ShellPart("journal", CommandCategory.JOURNAL, ["task", "show", "1"], subcommand="task")
LISTING_PART = ShellPart("ls", CommandCategory.SEARCH, ["build"])
TESTS_PART = ShellPart("pytest", CommandCategory.TEST_RUN, ["-q"])
REFUSAL = "a journal command may not follow a long command"


def expect_output_paths_parsed(part, expected) -> None:
    actual = list(Part.parsed(part).output_paths)
    assert actual == expected, actual


def expect_dumps_with(schema, expected) -> None:
    actual = json.dumps(schema)
    assert expected in actual, actual


def test_a_parts_write_paths_are_read_from_the_field_the_hook_client_sends():
    schema = json.loads((Path(__file__).parents[5] / "tools/journal-hook/event/hook_event.schema.json").read_text())
    expect_dumps_with(schema, '"write_paths"')
    part = {"text": "cat > notes.txt", "program": "cat", "arguments": [], "classification": {"category": CommandCategory.EDIT.value, "effects": []}, "write_paths": ["notes.txt"]}
    expect_output_paths_parsed(part, ["notes.txt"])
