from pathlib import Path

import pytest

from engine.database.database import Database
from engine.database.shared_tables import SHARED_HOME_CACHE_SIZE, SharedTables
from engine.file.file_access import FileAccess
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
    return tuple(tuple(row) for row in database.rows(Statement("SELECT count(*), coalesce(sum(id), 0), coalesce(sum(version), 0), max(updated_at) FROM notes")))


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


class FakeDatabase:
    """A database outside any transaction, for the store's choices that need no rows."""

    has_transaction = False


def copied_home(tmp_path, name: str, template_database):
    copy = tmp_path / f"{name}.db"
    copy.write_text("")
    home = JournalHome(tmp_path / name, template_database=template_database)
    home.folder.mkdir()
    FileAccess.symlink_to(home.database, copy)
    return home, copy


def test_two_homes_from_one_template_share_a_table(tmp_path):
    first, _ = copied_home(tmp_path, "first", tmp_path / "template.db")
    second, _ = copied_home(tmp_path, "second", tmp_path / "template.db")
    loader = CountingLoader()
    SharedTables.shared(first).read(FakeDatabase(), "notes", ((1,),), loader)
    assert (SharedTables.shared(second).read(FakeDatabase(), "notes", ((1,),), loader), loader.loads) == ("load 1", 1)


def test_a_write_in_one_story_is_not_seen_by_the_next(tmp_path):
    stored, copy = copied_home(tmp_path, "written", tmp_path / "template-w.db")
    unchanged, _ = copied_home(tmp_path, "untouched", tmp_path / "template-w.db")
    Path(f"{copy}-wal").write_text("a write")
    loader = CountingLoader()
    SharedTables.shared(stored).read(FakeDatabase(), "notes", ((2,),), loader)
    assert (SharedTables.shared(unchanged).read(FakeDatabase(), "notes", ((2,),), loader), loader.loads) == ("load 2", 2)


def test_the_real_journal_still_keys_on_its_home(tmp_path):
    assert SharedTables.shared(JournalHome(tmp_path / "real")).template is None


def test_the_cache_is_bounded():
    assert SharedTables.shared.cache_info().maxsize == SHARED_HOME_CACHE_SIZE
