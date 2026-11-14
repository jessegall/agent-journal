from pathlib import Path

import pytest

import os
import sqlite3
from server.tick.server_backup import ServerBackup
from tests.stories.core.support.fixtures import UserJoined
from core.modules.settings.support.settings_tree import BACKUP_MINUTES_SETTING

HOUR_SECONDS = 3600


def journal(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"setting set {BACKUP_MINUTES_SETTING} 15 --project", actor=story.user)
    return story, ServerBackup(story.home, story.clock)


def stamp(copy: Path, epoch_seconds: float) -> None:
    os.utime(copy, (epoch_seconds, epoch_seconds))


def age(backup: ServerBackup) -> None:
    for copy in backup.copies():
        stamp(copy, backup.clock.epoch_seconds() - HOUR_SECONDS)


def test_with_no_copy_minutes_set_a_check_writes_nothing(new_story):
    story = new_story(fixture=UserJoined)
    backup = ServerBackup(story.home, story.clock)
    backup.follow()
    expect_copies_backup(backup, 0)


def test_a_copy_that_fails_midway_leaves_nothing_counted_as_a_copy(new_story, monkeypatch):
    story, backup = journal(new_story)

    def interrupted(path, target):
        raise OSError("disk full")

    monkeypatch.setattr(Path, "replace", interrupted)
    with pytest.raises(OSError):
        backup.follow()
    expect_copies_backup_2(backup, [])
    expect_iterdir_folder_backup(backup, [])


def test_only_the_newest_copies_stay_the_newest_holds_the_rows_and_version_4s_are_left_alone(new_story):
    story, backup = journal(new_story)
    backup.folder().mkdir(parents=True)
    kept = backup.folder() / "journal-20261101-061659.db"
    kept.write_text("old")
    for number in (1, 2, 3):
        (backup.folder() / f"version-5-2026010{number}-000000.db").write_text("old")
    age(backup)
    backup.follow()
    names = [copy.name for copy in backup.copies()]
    connection = sqlite3.connect(backup.copies()[0])
    actor_rows = connection.execute("select count(*) from actors").fetchone()[0]
    connection.close()
    story.expect_rows(len(names) == 3, names[1] == "version-5-20260103-000000.db", kept.exists(), actor_rows > 0, detail=str(names))
    backup.follow()
    story.expect_rows(len(backup.copies()) == 3, detail=str(backup.copies()))
def expect_copies_backup(backup, expected) -> None:
    actual = len(backup.copies())
    assert actual == expected, actual


def expect_copies_backup_2(backup, expected) -> None:
    actual = backup.copies()
    assert actual == expected, actual


def expect_iterdir_folder_backup(backup, expected) -> None:
    actual = list(backup.folder().iterdir())
    assert actual == expected, actual
