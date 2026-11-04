import json

from core.base.database.database import Database
from core.modules.processes.migrations.m021_stock_reader_test_counts import StockReaderTestCountsMigration
from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.core.support.coding_fixtures import BuilderStarted


def with_reader_files(folder):
    readers = folder / "readers"
    readers.mkdir()
    (readers / "cart-test.pattern").write_text("# each package's result\n^(ok|FAIL)\\s\nlabel: Cart tests\ncommands: cart test\nfinished: ^ok\nfailed: ^FAIL\n")
    (readers / "merge.sh").write_text("#!/bin/sh\n# what a merge did\n# label: Worker merge\n# commands: journal worker merge\ncat\n")


def test_version_4_reader_files_move_into_version_5_readers(new_story):
    story = upgraded_story(new_story, prepare=with_reader_files)
    rows = {row["name"]: row for row in json.loads(story.run("reader list --json").output_text)["rows"]}
    assert rows["cart-test"]["type"] == "pattern" and rows["cart-test"]["lines_pattern"] == "^(ok|FAIL)\\s" and rows["cart-test"]["title"] == "Cart tests", rows["cart-test"]
    assert rows["merge"]["type"] == "script" and rows["merge"]["script"].endswith("readers/merge.sh") and rows["merge"]["commands"] == "journal worker merge", rows["merge"]


def test_a_reader_file_named_as_a_reader_version_5_ships_keeps_version_5_s_and_is_counted(new_story):
    def with_pytest_file(folder):
        (folder / "readers").mkdir()
        (folder / "readers" / "pytest.pattern").write_text("# old pytest\n^old\n")
    story = upgraded_story(new_story, prepare=with_pytest_file)
    assert "reader files version 5 ships a reader of the same name for: 1 rows" in story.upgrade_text


def test_stock_readers_get_their_count_and_a_project_reader_is_left_as_it_was(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('reader add pytest --commands "custom-pytest*" --count "old-pytest" --count-command "old-list"')
    story.expect_success('reader add vitest --commands "custom-vitest*" --count "old-vitest" --count-command "old-list"')
    project_id = story.new_row_id('reader add project-tests --commands "pytest*" --lines "done" --count "project-count" --count-command "project-list"', actor=story.agent)
    previous = story.run(f"reader show {project_id} --json", actor=story.agent).output_text
    StockReaderTestCountsMigration().run(story.container.get(Database))
    rows = {row["name"]: row for row in json.loads(story.run("reader list --json").output_text)["rows"]}
    assert rows["pytest"]["commands"] == "custom-pytest*"
    assert rows["pytest"]["count_command"] == "{part} --collect-only -q"
    assert rows["pytest"]["count_pattern"] != "old-pytest"
    assert rows["vitest"]["commands"] == "custom-vitest*"
    assert "(?:test|spec)" in rows["vitest"]["count_pattern"]
    assert rows["vitest"]["count_command"] != "old-list"
    assert story.run(f"reader show {project_id} --json", actor=story.agent).output_text == previous
