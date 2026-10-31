import sqlite3

import pytest

from core.base.upgrade.version_four_source import VersionFourSource


def version_four(tmp_path):
    path = tmp_path / "journal.db"
    connection = sqlite3.connect(path)
    connection.executescript("CREATE TABLE tasks (id INTEGER PRIMARY KEY, title TEXT); INSERT INTO tasks VALUES (1, 'Fix'), (2, 'Ship'); CREATE TABLE plans (id INTEGER PRIMARY KEY);")
    connection.commit()
    connection.close()
    return path


def test_the_source_reads_the_rows_of_a_table_and_lists_the_tables(tmp_path):
    with VersionFourSource(version_four(tmp_path)) as source:
        assert [row["title"] for row in source.rows("tasks")] == ["Fix", "Ship"]
        assert source.tables() == ("plans", "tasks")


def test_the_source_never_writes_to_the_version_4_database(tmp_path):
    path = version_four(tmp_path)
    before = path.read_bytes()
    with VersionFourSource(path) as source:
        with pytest.raises(sqlite3.OperationalError, match="readonly"):
            source.connection.execute("DELETE FROM tasks")
    assert path.read_bytes() == before


def test_a_missing_table_gives_no_rows(tmp_path):
    with VersionFourSource(version_four(tmp_path)) as source:
        assert source.rows("nothing") == []
