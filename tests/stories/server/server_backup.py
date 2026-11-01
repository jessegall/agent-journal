import os
import sqlite3
import time

from server.server_backup import ServerBackup
from tests.stories.core.support.fixtures import UserJoined

HOUR_SECONDS = 3600


def journal(new_story):
    story = new_story(fixture=UserJoined)
    return story, ServerBackup(story.home)


def age(backup: ServerBackup) -> None:
    for copy in backup.copies():
        old = time.time() - HOUR_SECONDS
        os.utime(copy, (old, old))


def test_the_first_check_writes_a_copy_that_opens_with_the_journals_rows(new_story):
    story, backup = journal(new_story)
    backup.follow()
    assert len(backup.copies()) == 1
    connection = sqlite3.connect(backup.copies()[0])
    assert connection.execute("select count(*) from actors").fetchone()[0] > 0
    connection.close()


def test_a_copy_younger_than_the_setting_is_not_written_again(new_story):
    story, backup = journal(new_story)
    backup.follow()
    backup.follow()
    assert len(backup.copies()) == 1


def test_only_the_newest_copies_stay(new_story):
    story, backup = journal(new_story)
    backup.folder().mkdir(parents=True)
    for number in (1, 2, 3):
        (backup.folder() / f"version-5-2026010{number}-000000.db").write_text("old")
    age(backup)
    backup.follow()
    names = [copy.name for copy in backup.copies()]
    assert len(names) == 2 and names[1] == "version-5-20260103-000000.db"


def test_zero_minutes_writes_no_copy(new_story):
    story, backup = journal(new_story)
    story.expect_success("setting set journal.core.settings.backup-minutes 0 --project", actor=story.user)
    backup.follow()
    assert backup.copies() == []


def test_version_4s_copies_are_left_alone(new_story):
    story, backup = journal(new_story)
    backup.folder().mkdir(parents=True)
    kept = backup.folder() / "journal-20261101-061659.db"
    kept.write_text("old")
    backup.follow()
    assert kept.exists() and len(backup.copies()) == 1
