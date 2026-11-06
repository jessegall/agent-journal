import json

from core.base.database.database import Database
from core.modules.processes.migrations.m021_stock_reader_test_counts import StockReaderTestCountsMigration
from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story, expect_upgrade_text
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_output_2


def with_reader_files(folder):
    readers = folder / "readers"
    readers.mkdir()
    (readers / "cart-test.pattern").write_text("# each package's result\n^(ok|FAIL)\\s\nlabel: Cart tests\ncommands: cart test\nfinished: ^ok\nfailed: ^FAIL\n")
    (readers / "merge.sh").write_text("#!/bin/sh\n# what a merge did\n# label: Worker merge\n# commands: journal worker merge\ncat\n")


def test_version_4_reader_files_move_into_version_5_readers(new_story):
    story = upgraded_story(new_story, prepare=with_reader_files)
    rows = {row["name"]: row for row in json.loads(story.run("reader list --json").output_text)["rows"]}
    expect_row(rows["cart-test"], type="pattern")
    expect_row(rows["cart-test"], lines_pattern="^(ok|FAIL)\\s")
    expect_row(rows["cart-test"], title="Cart tests")
    expect_type_merge(rows, "script")
    expect_endswith_script_merge(rows, "readers/merge.sh")
    expect_commands_merge(rows, "journal worker merge")


def test_a_reader_file_named_as_a_reader_version_5_ships_keeps_version_5_s_and_is_counted(new_story):
    def with_pytest_file(folder):
        (folder / "readers").mkdir()
        (folder / "readers" / "pytest.pattern").write_text("# old pytest\n^old\n")
    story = upgraded_story(new_story, prepare=with_pytest_file)
    expect_upgrade_text(story, "reader files version 5 ships a reader of the same name for: 1 rows")


def test_stock_readers_get_their_count_and_a_project_reader_is_left_as_it_was(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('reader add pytest --commands "custom-pytest*" --count "old-pytest" --count-command "old-list"')
    story.expect_success('reader add vitest --commands "custom-vitest*" --count "old-vitest" --count-command "old-list"')
    project_id = story.new_row_id('reader add project-tests --commands "pytest*" --lines "done" --count "project-count" --count-command "project-list"', actor=story.agent)
    previous = story.run(f"reader show {project_id} --json", actor=story.agent).output_text
    StockReaderTestCountsMigration().run(story.container.get(Database))
    rows = {row["name"]: row for row in json.loads(story.run("reader list --json --limit 100").output_text)["rows"]}
    expect_row(rows["pytest"], commands="custom-pytest*")
    expect_row(rows["pytest"], count_command="{part} --collect-only -q")
    expect_changed_count_pattern_pytest(rows, "old-pytest")
    expect_row(rows["vitest"], commands="custom-vitest*")
    expect_count_pattern_vitest_with(rows, "([0-9]+)")
    expect_changed_count_command_vitest(rows, "old-list")
    expect_output_2(story, f"reader show {project_id} --json", previous)


def expect_changed_count_command_vitest(rows, expected) -> None:
    actual = rows['vitest']['count_command']
    assert actual != expected, actual


def expect_count_pattern_vitest_with(rows, expected) -> None:
    actual = rows['vitest']['count_pattern']
    assert expected in actual, actual


def expect_changed_count_pattern_pytest(rows, expected) -> None:
    actual = rows['pytest']['count_pattern']
    assert actual != expected, actual


def expect_type_merge(rows, expected) -> None:
    actual = rows['merge']['type']
    assert actual == expected, actual


def expect_endswith_script_merge(rows, text) -> None:
    actual = rows['merge']['script'].endswith(text)
    assert actual, actual


def expect_commands_merge(rows, expected) -> None:
    actual = rows['merge']['commands']
    assert actual == expected, actual
