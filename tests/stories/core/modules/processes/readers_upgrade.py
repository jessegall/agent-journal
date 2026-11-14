import json

from engine.database.database import Database
from core.modules.processes.migrations.m021_stock_reader_test_counts import StockReaderTestCountsMigration
from install.version_four.restore_version_four import RestoreVersionFour
from install.version_four.upgrade_journal import UpgradeJournal
from tests.stories.fixtures.version_four import version_four_fixture
from tests.stories.core.support.coding_fixtures import BuilderStarted
from engine.testing.expectations.expect_row import expect_row
from tests.stories.support.story_checks import expect_output_2


def with_reader_files(folder):
    readers = folder / "readers"
    readers.mkdir()
    (readers / "cart-test.pattern").write_text("# each package's result\n^(ok|FAIL)\\s\nlabel: Cart tests\ncommands: cart test\nfinished: ^ok\nfailed: ^FAIL\n")
    (readers / "merge.sh").write_text("#!/bin/sh\n# what a merge did\n# label: Worker merge\n# commands: journal worker merge\ncat\n")


READER_FILES_LINE = "reader files (removed from the project, kept in the backup): 3 rows"


def test_the_upgrade_removes_version_4_readers_and_keeps_only_version_5s(new_story):
    story = new_story()
    version_four_fixture(story.home.folder / "journal.db")
    with_reader_files(story.home.folder)
    (story.home.folder / "readers" / "pytest.pattern").write_text("# old pytest\n^old\n")
    dry_run = UpgradeJournal(story.home).run(dry_run=True).text
    story.upgrade_text = UpgradeJournal(story.home).run(confirmed=True).text
    names = {row["name"]: row for row in json.loads(story.run("reader list --json --limit 100").output_text)["rows"]}
    story.expect_rows(READER_FILES_LINE in dry_run, READER_FILES_LINE in story.upgrade_text, "version 4's files moved into" in story.upgrade_text,
                      "cart-test" not in names, "merge" not in names, "^old" not in names["pytest"]["lines_pattern"],
                      not (story.home.folder / "readers").exists(), (story.home.folder / "version-4" / "readers" / "merge.sh").is_file())


def test_a_restore_puts_version_4s_reader_files_back(new_story):
    story = new_story()
    version_four_fixture(story.home.folder / "journal.db")
    with_reader_files(story.home.folder)
    UpgradeJournal(story.home).run(confirmed=True)
    story.container.get(Database).close()
    outcome = RestoreVersionFour(story.home).run()
    expect_row(outcome, code=0)
    story.expect_rows((story.home.folder / "readers" / "merge.sh").is_file(), (story.home.folder / "version-4" / "readers" / "merge.sh").is_file())


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
