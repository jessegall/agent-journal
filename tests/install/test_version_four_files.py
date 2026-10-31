import sqlite3

from install.version_four_files import VersionFourFiles
from tests.install.test_version_four_backup import journal_with_version_four


def test_the_database_its_side_files_and_the_code_move_into_version_4_and_the_rest_stays(tmp_path):
    journal = journal_with_version_four(tmp_path)
    (journal / "journal.db-wal").write_bytes(b"w")
    (journal / "keep.txt").write_text("stay")
    files = VersionFourFiles(journal)
    assert not files.are_retired()
    assert files.retire() == ["journal.db", "journal.db-wal", "src/journal"]
    assert files.are_retired() and (journal / "version-4" / "journal.db-wal").is_file() and (journal / "version-4" / "src" / "journal" / "version.py").is_file()
    assert not (journal / "journal.db").exists() and (journal / "keep.txt").read_text() == "stay"
    assert sqlite3.connect(journal / "version-4" / "journal.db").execute("SELECT count(*) FROM tasks").fetchone()[0] == 2


def test_retiring_what_is_not_there_moves_nothing(tmp_path):
    journal = tmp_path / ".journal"
    journal.mkdir()
    assert VersionFourFiles(journal).retire() == []
