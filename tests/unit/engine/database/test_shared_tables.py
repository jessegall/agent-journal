import pytest

from engine.database.database import Database
from engine.database.kept_rows import KeptRows
from engine.database.shared_tables import SharedTables
from engine.database.statement import Statement
from engine.journal.journal_home import JournalHome

TABLE = "CREATE TABLE notes (id INTEGER PRIMARY KEY, version INTEGER NOT NULL, updated_at TEXT NOT NULL, text TEXT NOT NULL)"


class CountingLoader:
    def __init__(self) -> None:
        self.loads = 0

    def __call__(self) -> str:
        self.loads += 1
        return f"load {self.loads}"


@pytest.fixture
def home(tmp_path):
    database = Database.opened(JournalHome(tmp_path))
    database.update(Statement(TABLE))
    database.insert(Statement("INSERT INTO notes VALUES (1, 1, '2026', 'Saved')"))
    database.close()
    return JournalHome(tmp_path)


def table_signature(database):
    return tuple(tuple(row) for row in database.rows(KeptRows.signature_read("notes", "1 = 1", ())))


def read_table(home, tables, loader):
    database = Database.opened(home)
    try:
        return tables.read(database, "notes", table_signature(database), loader)
    finally:
        database.close()


def test_a_fresh_connection_of_the_same_home_loads_the_table_once(home):
    tables, loader = SharedTables(), CountingLoader()
    assert (read_table(home, tables, loader), read_table(home, tables, loader), loader.loads) == ("load 1", "load 1", 1)


def test_a_change_to_the_table_loads_it_again(home):
    tables, loader = SharedTables(), CountingLoader()
    read_table(home, tables, loader)
    database = Database.opened(home)
    database.update(Statement("UPDATE notes SET version = 2, updated_at = '2027'"))
    database.close()
    assert (read_table(home, tables, loader), loader.loads) == ("load 2", 2)


def test_a_table_read_inside_a_transaction_is_not_kept(home):
    tables, loader = SharedTables(), CountingLoader()
    database = Database.opened(home)
    with database.transaction():
        database.update(Statement("UPDATE notes SET version = 2, updated_at = '2027'"))
        tables.read(database, "notes", table_signature(database), loader)
    database.close()
    assert (read_table(home, tables, loader), loader.loads) == ("load 2", 2)


def test_each_home_shares_one_store(tmp_path):
    assert SharedTables.shared(JournalHome(tmp_path / "one")) is SharedTables.shared(JournalHome(tmp_path / "one"))
    assert SharedTables.shared(JournalHome(tmp_path / "one")) is not SharedTables.shared(JournalHome(tmp_path / "two"))
