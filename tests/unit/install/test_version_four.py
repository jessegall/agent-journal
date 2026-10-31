import sqlite3

from install.version_four import VersionFour


def test_a_journal_folder_with_a_journal_db_is_a_version_4_journal(tmp_path):
    sqlite3.connect(tmp_path / "journal.db").close()
    assert VersionFour(tmp_path).exists()


def test_a_journal_folder_with_the_version_4_code_is_one_too(tmp_path):
    (tmp_path / "src" / "journal").mkdir(parents=True)
    assert VersionFour(tmp_path).exists()


def test_an_empty_folder_and_a_version_5_install_are_not(tmp_path):
    assert not VersionFour(tmp_path).exists()
    sqlite3.connect(tmp_path / "version-5.db").close()
    (tmp_path / "src" / "core").mkdir(parents=True)
    assert not VersionFour(tmp_path).exists()
