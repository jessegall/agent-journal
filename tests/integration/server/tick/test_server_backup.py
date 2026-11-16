import os
import sqlite3
from pathlib import Path

import pytest

from core.modules.settings.support.settings_tree import BACKUP_MINUTES_SETTING
from engine.testing.fakes.manual_clock import ManualClock
from server.tick.server_backup import ServerBackup

HOUR_SECONDS = 3600


@pytest.fixture
def backup(journal) -> ServerBackup:
    assert journal.run(f"setting set {BACKUP_MINUTES_SETTING} 15 --project").code == 0
    return ServerBackup(journal.home, ManualClock())


def age(backup: ServerBackup) -> None:
    for copy in backup.copies():
        older = backup.clock.unix_seconds() - HOUR_SECONDS
        os.utime(copy, (older, older))


def test_with_no_copy_minutes_set_a_check_writes_nothing(synced_home):
    backup = ServerBackup(synced_home, ManualClock())
    backup.follow()
    assert len(backup.copies()) == 0


def test_a_copy_that_fails_midway_leaves_nothing_counted_as_a_copy(backup, monkeypatch):
    def interrupted(path, target):
        raise OSError("disk full")

    monkeypatch.setattr(Path, "replace", interrupted)
    with pytest.raises(OSError):
        backup.follow()
    assert backup.copies() == []
    assert list(backup.folder().iterdir()) == []


def test_only_the_newest_copies_stay_the_newest_holds_the_rows_and_version_4s_are_left_alone(backup):
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
    assert len(names) == 3 and names[1] == "version-5-20260103-000000.db" and kept.exists() and actor_rows > 0, names
    backup.follow()
    assert len(backup.copies()) == 3, backup.copies()
