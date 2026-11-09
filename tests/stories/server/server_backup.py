from pathlib import Path

import pytest

import os
import sqlite3
from server.server_backup import ServerBackup
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_answers, expect_exists_version_four, expect_lines_2

HOUR_SECONDS = 3600


def journal(new_story):
    story = new_story(fixture=UserJoined)
    return story, ServerBackup(story.home, story.clock)


def stamp(copy: Path, epoch_seconds: float) -> None:
    os.utime(copy, (epoch_seconds, epoch_seconds))


def age(backup: ServerBackup) -> None:
    for copy in backup.copies():
        stamp(copy, backup.clock.epoch_seconds() - HOUR_SECONDS)


def test_the_first_check_writes_a_copy_that_opens_with_the_journals_rows(new_story):
    story, backup = journal(new_story)
    backup.follow()
    expect_copies_backup(backup, 1)
    connection = sqlite3.connect(backup.copies()[0])
    expect_query_count_greater(connection, "select count(*) from actors", 0)
    connection.close()


def test_a_copy_younger_than_the_setting_is_not_written_again(new_story):
    story, backup = journal(new_story)
    backup.follow()
    backup.follow()
    expect_copies_backup(backup, 1)


def test_a_copy_that_fails_midway_leaves_nothing_counted_as_a_copy(new_story, monkeypatch):
    story, backup = journal(new_story)

    def interrupted(path, target):
        raise OSError("disk full")

    monkeypatch.setattr(Path, "replace", interrupted)
    with pytest.raises(OSError):
        backup.follow()
    expect_copies_backup_2(backup, [])
    expect_iterdir_folder_backup(backup, [])


def test_only_the_newest_copies_stay(new_story):
    story, backup = journal(new_story)
    backup.folder().mkdir(parents=True)
    for number in (1, 2, 3):
        (backup.folder() / f"version-5-2026010{number}-000000.db").write_text("old")
    age(backup)
    backup.follow()
    names = [copy.name for copy in backup.copies()]
    expect_answers(names, 2)
    expect_lines_2(names, "version-5-20260103-000000.db")


def test_version_4s_copies_are_left_alone(new_story):
    story, backup = journal(new_story)
    backup.folder().mkdir(parents=True)
    kept = backup.folder() / "journal-20261101-061659.db"
    kept.write_text("old")
    backup.follow()
    expect_exists_version_four(kept)
    expect_copies_backup(backup, 1)


def expect_copies_backup(backup, expected) -> None:
    actual = len(backup.copies())
    assert actual == expected, actual


def expect_copies_backup_2(backup, expected) -> None:
    actual = backup.copies()
    assert actual == expected, actual


def expect_iterdir_folder_backup(backup, expected) -> None:
    actual = list(backup.folder().iterdir())
    assert actual == expected, actual


def expect_query_count_greater(connection, text, expected) -> None:
    actual = connection.execute(text).fetchone()[0]
    assert actual > expected, actual
