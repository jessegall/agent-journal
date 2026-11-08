import re

import pytest

from core.base.database.database import Database
from core.base.database.repeated_calls_error import RepeatedCallsError
from core.base.database.statement import Statement
from core.base.file_access import FileAccess
from tests.stories.support.story_checks import expect_value

ORIGIN_READ = Statement("SELECT 2")
ALLOWED_READER = "core/modules/plugins/support/plugin_code_diff.py"
CALL_LINE = re.compile(r"^  \.\./tests/stories/core/base/repeated_origins\.py:\d+ (\w+)$")


def first_place_that_reads(database: Database) -> None:
    database.rows(ORIGIN_READ)


def second_place_that_reads(database: Database) -> None:
    database.rows(ORIGIN_READ)


def places_named(text: str) -> list[str]:
    return [CALL_LINE.fullmatch(line).group(1) for line in text.splitlines()]


def test_a_repeated_read_names_where_the_first_read_was_and_where_the_repeat_was(new_story):
    story = new_story()
    database = story.container.get(Database)
    with pytest.raises(RepeatedCallsError) as raised, story.repeated_work.request():
        first_place_that_reads(database)
        second_place_that_reads(database)
    first_read, repeated_read = str(raised.value).split("first read:\n")[1].split("\nrepeated read:\n")
    expect_value(places_named(first_read), ["test_a_repeated_read_names_where_the_first_read_was_and_where_the_repeat_was", "first_place_that_reads"])
    expect_value(places_named(repeated_read), ["test_a_repeated_read_names_where_the_first_read_was_and_where_the_repeat_was", "second_place_that_reads"])


def test_a_file_read_twice_is_refused_with_the_file_and_the_place_that_read_it(new_story, tmp_path):
    story = new_story()
    path = tmp_path / "notes.md"
    path.write_text("First draft")
    with pytest.raises(RepeatedCallsError) as raised, story.repeated_work.request():
        FileAccess.shared().read(path)
        FileAccess.shared().read(path)
    message, *called_from = str(raised.value).splitlines()
    expect_value(message, f"one request read file twice: {path.resolve()}")
    expect_value(places_named("\n".join(called_from)), ["test_a_file_read_twice_is_refused_with_the_file_and_the_place_that_read_it"])


def test_a_file_read_twice_by_an_allowed_reader_is_not_refused(new_story, tmp_path):
    story = new_story()
    path = tmp_path / "manifest.md"
    path.write_text("First draft")
    reader = compile("FileAccess.shared().read(path)\nFileAccess.shared().read(path)\n", f"/source/{ALLOWED_READER}", "exec")
    with story.repeated_work.request():
        exec(reader, {"FileAccess": FileAccess, "path": path})
