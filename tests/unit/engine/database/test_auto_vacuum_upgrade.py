import sqlite3

from engine.database.auto_vacuum_upgrade import AutoVacuumUpgrade
from engine.database.database import Database

INCREMENTAL = 2


def older_database(tmp_path) -> Database:
    """A database made before incremental auto vacuum: its tables were written with the mode off."""
    connection = sqlite3.connect(tmp_path / "version-5.db", autocommit=True)
    connection.execute("PRAGMA auto_vacuum = NONE")
    connection.execute("CREATE TABLE notes (id INTEGER PRIMARY KEY, text TEXT)")
    connection.executemany("INSERT INTO notes (text) VALUES (?)", [tuple(["note"])] * 50)
    connection.close()
    return Database.configured(sqlite3.connect(tmp_path / "version-5.db", autocommit=True))


def test_an_older_database_gets_incremental_auto_vacuum_and_keeps_its_rows(tmp_path):
    database, informed = older_database(tmp_path), []
    assert database.connection.execute("PRAGMA auto_vacuum").fetchone()[0] == 0
    AutoVacuumUpgrade(database).run(informed.append)
    assert database.connection.execute("PRAGMA auto_vacuum").fetchone()[0] == INCREMENTAL
    assert database.connection.execute("SELECT count(*) FROM notes").fetchone()[0] == 50
    assert len(informed) == 1 and "seconds" in informed[0]


def test_a_second_run_does_nothing(tmp_path):
    database, informed = older_database(tmp_path), []
    AutoVacuumUpgrade(database).run(informed.append)
    AutoVacuumUpgrade(database).run(informed.append)
    assert len(informed) == 1
