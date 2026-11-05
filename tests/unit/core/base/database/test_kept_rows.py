import pytest

from core.base.database.database import Database
from core.base.database.kept_rows import KeptRows
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome


class RollbackRequested(Exception):
    pass


@pytest.fixture
def database(tmp_path):
    database = Database.opened(JournalHome(tmp_path))
    database.update(Statement("CREATE TABLE notes (id INTEGER PRIMARY KEY, version INTEGER NOT NULL, updated_at TEXT NOT NULL, text TEXT NOT NULL) STRICT"))
    database.insert(Statement("INSERT INTO notes VALUES (1, 1, '2026', 'Saved')"))
    yield database
    database.close()


def texts(database):
    return tuple(row[0] for row in database.rows(Statement("SELECT text FROM notes ORDER BY id")))


@pytest.mark.parametrize("warm", [False, True], ids=["first-read-in-transaction", "previously-kept"])
def test_rolled_back_values_are_not_kept(database, warm):
    kept = KeptRows(database)
    if warm:
        assert kept.read("notes", lambda: texts(database), name="notes.text") == tuple(["Saved"])
    with pytest.raises(RollbackRequested):
        with database.transaction():
            database.update(Statement("UPDATE notes SET text = 'Temporary', version = version + 1"))
            assert kept.read("notes", lambda: texts(database), name="notes.text") == tuple(["Temporary"])
            raise RollbackRequested

    assert kept.read("notes", lambda: texts(database), name="notes.text") == tuple(["Saved"])


def test_a_savepoint_rollback_does_not_keep_its_value(database):
    kept = KeptRows(database)
    with database.transaction():
        database.update(Statement("UPDATE notes SET text = 'Outer', version = version + 1"))
        with pytest.raises(RollbackRequested):
            with database.savepoint("Inner write"):
                database.update(Statement("UPDATE notes SET text = 'Inner', version = version + 1"))
                assert kept.read("notes", lambda: texts(database), name="notes.text") == tuple(["Inner"])
                raise RollbackRequested
        assert kept.read("notes", lambda: texts(database), name="notes.text") == tuple(["Outer"])
    assert kept.read("notes", lambda: texts(database), name="notes.text") == tuple(["Outer"])


def test_unchanged_reads_run_the_loader_once_and_read_no_more_table_rows(database):
    kept = KeptRows(database)
    calls = []

    def load_texts():
        calls.append(True)
        return texts(database)

    assert kept.read("notes", load_texts, name="notes.text") == tuple(["Saved"])
    table_reads = dict(database.tally.points().tables)
    assert kept.read("notes", load_texts, name="notes.text") == tuple(["Saved"])
    assert len(calls) == 1 and database.tally.points().tables == table_reads


def test_a_read_only_transaction_reuses_the_kept_value(database):
    kept = KeptRows(database)
    assert kept.read("notes", lambda: texts(database), name="notes.text") == tuple(["Saved"])
    table_reads = dict(database.tally.points().tables)
    with database.transaction():
        assert kept.read("notes", lambda: texts(database), name="notes.text") == tuple(["Saved"])
    assert database.tally.points().tables == table_reads


def test_distinct_named_loaders_of_one_table_keep_their_own_values(database):
    kept = KeptRows(database)
    assert kept.read("notes", lambda: texts(database), name="notes.text") == tuple(["Saved"])
    assert kept.read("notes", lambda: len(texts(database)), name="notes.count") == 1


def test_a_write_transaction_reuses_reads_until_another_write(database):
    kept = KeptRows(database)
    calls = []

    def load_texts():
        calls.append(True)
        return texts(database)

    with database.transaction():
        database.update(Statement("UPDATE notes SET text = 'Temporary', version = version + 1"))
        assert kept.read("notes", load_texts, name="notes.text") == tuple(["Temporary"])
        table_reads = dict(database.tally.points().tables)
        assert kept.read("notes", load_texts, name="notes.text") == tuple(["Temporary"])
        assert len(calls) == 1 and database.tally.points().tables == table_reads
