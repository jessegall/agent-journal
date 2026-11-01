import json

from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story


def with_reader_files(folder):
    readers = folder / "readers"
    readers.mkdir()
    (readers / "go-test.pattern").write_text("# each package's result\n^(ok|FAIL)\\s\nlabel: Go tests\ncommands: go test\nfinished: ^ok\nfailed: ^FAIL\n")
    (readers / "merge.sh").write_text("#!/bin/sh\n# what a merge did\n# label: Worker merge\n# commands: journal worker merge\ncat\n")


def test_version_4_reader_files_move_into_version_5_readers(new_story):
    story = upgraded_story(new_story, prepare=with_reader_files)
    rows = {row["name"]: row for row in json.loads(story.run("reader list --json").output_text)["rows"]}
    assert rows["go-test"]["type"] == "pattern" and rows["go-test"]["lines_pattern"] == "^(ok|FAIL)\\s" and rows["go-test"]["title"] == "Go tests", rows["go-test"]
    assert rows["merge"]["type"] == "script" and rows["merge"]["script"].endswith("readers/merge.sh") and rows["merge"]["commands"] == "journal worker merge", rows["merge"]


def test_a_reader_file_named_as_a_reader_version_5_ships_keeps_version_5_s_and_is_counted(new_story):
    def with_pytest_file(folder):
        (folder / "readers").mkdir()
        (folder / "readers" / "pytest.pattern").write_text("# old pytest\n^old\n")
    story = upgraded_story(new_story, prepare=with_pytest_file)
    assert "reader files version 5 ships a reader of the same name for: 1 rows" in story.upgrade_text
