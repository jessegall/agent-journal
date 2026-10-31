import sqlite3

import pytest

from install.backup_mismatch_error import BackupMismatchError
from install.version_four_backup import VersionFourBackup
from tests.stories.fixtures.version_four import version_four_fixture


def journal_with_version_four(tmp_path, version: str | None = "4.28.0"):
    journal = tmp_path / ".journal"
    journal.mkdir()
    version_four_fixture(journal / "journal.db")
    if version is not None:
        (journal / "src" / "journal").mkdir(parents=True)
        (journal / "src" / "journal" / "version.py").write_text(f'VERSION = "{version}"\n')
    return journal


def test_the_backup_holds_every_table_with_its_rows_and_the_version_file_beside_it(tmp_path):
    journal = journal_with_version_four(tmp_path)
    backup = VersionFourBackup(journal).make()
    assert backup.path == journal / "version-4" / "4.28.0" / "journal.db" and not backup.kept
    assert (journal / "version-4" / "4.28.0" / "version.py").read_text() == 'VERSION = "4.28.0"\n'
    backup_connection = sqlite3.connect(backup.path)
    assert backup_connection.execute("SELECT count(*) FROM tasks").fetchone()[0] == 4 and backup.tables >= 8
    backup_connection.close()


def test_a_database_in_wal_mode_is_copied_whole_with_the_changes_still_in_its_wal_file(tmp_path):
    journal = journal_with_version_four(tmp_path)
    writer = sqlite3.connect(journal / "journal.db")
    writer.execute("PRAGMA journal_mode = WAL")
    writer.execute("INSERT INTO tasks (title) VALUES ('Kept in the wal')")
    writer.commit()
    backup = VersionFourBackup(journal).make()
    backup_connection = sqlite3.connect(backup.path)
    assert backup_connection.execute("SELECT count(*) FROM tasks WHERE title = 'Kept in the wal'").fetchone()[0] == 1
    backup_connection.close()
    writer.close()


def test_the_original_is_not_changed_by_a_backup(tmp_path):
    journal = journal_with_version_four(tmp_path)
    starting_bytes = (journal / "journal.db").read_bytes()
    VersionFourBackup(journal).make()
    assert (journal / "journal.db").read_bytes() == starting_bytes


def test_a_second_upgrade_keeps_the_first_backup(tmp_path):
    journal = journal_with_version_four(tmp_path)
    first = VersionFourBackup(journal).make()
    modified = sqlite3.connect(journal / "journal.db")
    modified.execute("DELETE FROM tasks")
    modified.commit()
    modified.close()
    second_backup = VersionFourBackup(journal).make()
    assert second_backup.kept and second_backup.path == first.path
    backup_connection = sqlite3.connect(first.path)
    assert backup_connection.execute("SELECT count(*) FROM tasks").fetchone()[0] == 4
    backup_connection.close()


def test_the_backup_of_a_journal_without_version_4_code_is_stamped_unknown(tmp_path):
    journal = journal_with_version_four(tmp_path, version=None)
    assert VersionFourBackup(journal).make().path == journal / "version-4" / "unknown" / "journal.db"


def test_a_copy_that_differs_from_the_original_is_refused_and_removed(tmp_path, monkeypatch):
    journal = journal_with_version_four(tmp_path)

    def damaged(self, original, target):
        connection = sqlite3.connect(target)
        connection.execute("CREATE TABLE tasks (id INTEGER PRIMARY KEY)")
        connection.commit()
        connection.close()

    monkeypatch.setattr(VersionFourBackup, "copy", damaged)
    with pytest.raises(BackupMismatchError, match="does not hold the rows the original does"):
        VersionFourBackup(journal).make()
    assert not (journal / "version-4" / "4.28.0" / "journal.db").exists()
