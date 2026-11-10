import pytest

from engine.database.database import Database
from engine.database.kept_rows import KeptRows
from engine.database.statement import Statement
from engine.journal.journal_home import JournalHome
from engine.row.row_owner import RowOwner


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

    def collect_texts():
        calls.append(True)
        return texts(database)

    assert kept.read("notes", collect_texts, name="notes.text") == tuple(["Saved"])
    table_reads = dict(database.repeated_work.points().tables)
    assert kept.read("notes", collect_texts, name="notes.text") == tuple(["Saved"])
    assert len(calls) == 1 and database.repeated_work.points().tables == table_reads


def test_a_known_write_refreshes_the_kept_value_without_reloading_rows(database):
    kept = KeptRows(database)
    calls = []

    def collect_texts():
        calls.append(True)
        return texts(database)

    assert kept.read("notes", collect_texts, name="notes.text") == tuple(["Saved"])
    database.update(Statement("UPDATE notes SET text = 'Updated', version = version + 1"))
    kept.update("notes", lambda values: tuple(["Updated"]), name="notes.text")
    assert kept.read("notes", collect_texts, name="notes.text") == tuple(["Updated"])
    assert len(calls) == 1


def test_a_rollback_without_writes_keeps_the_loaded_rows(database):
    kept = KeptRows(database)
    calls = []

    def collect_texts():
        calls.append(True)
        return texts(database)

    assert kept.read("notes", collect_texts, name="notes.text") == tuple(["Saved"])
    with pytest.raises(RollbackRequested), database.transaction():
        raise RollbackRequested
    assert kept.read("notes", collect_texts, name="notes.text") == tuple(["Saved"])
    assert len(calls) == 1


def test_a_read_only_transaction_reuses_the_kept_value(database):
    kept = KeptRows(database)
    assert kept.read("notes", lambda: texts(database), name="notes.text") == tuple(["Saved"])
    table_reads = dict(database.repeated_work.points().tables)
    with database.transaction():
        assert kept.read("notes", lambda: texts(database), name="notes.text") == tuple(["Saved"])
    assert database.repeated_work.points().tables == table_reads


def test_a_rollback_reuses_rows_that_were_never_loaded_from_the_failed_write(database):
    kept = KeptRows(database)
    calls = []

    def collect_texts():
        calls.append(True)
        return texts(database)

    assert kept.read("notes", collect_texts, name="notes.text") == tuple(["Saved"])
    with pytest.raises(RollbackRequested), database.transaction():
        database.update(Statement("UPDATE notes SET text = 'Temporary', version = version + 1"))
        raise RollbackRequested
    assert kept.read("notes", collect_texts, name="notes.text") == tuple(["Saved"])
    assert len(calls) == 1


def test_distinct_named_loaders_of_one_table_keep_their_own_values(database):
    kept = KeptRows(database)
    assert kept.read("notes", lambda: texts(database), name="notes.text") == tuple(["Saved"])
    assert kept.read("notes", lambda: len(texts(database)), name="notes.count") == 1


def test_a_write_transaction_reuses_reads_until_another_write(database):
    kept = KeptRows(database)
    calls = []

    def collect_texts():
        calls.append(True)
        return texts(database)

    with database.transaction():
        database.update(Statement("UPDATE notes SET text = 'Temporary', version = version + 1"))
        assert kept.read("notes", collect_texts, name="notes.text") == tuple(["Temporary"])
        table_reads = dict(database.repeated_work.points().tables)
        assert kept.read("notes", collect_texts, name="notes.text") == tuple(["Temporary"])
        assert len(calls) == 1 and database.repeated_work.points().tables == table_reads


def test_a_write_by_another_connection_is_read_after_a_rollback_that_wrote_nothing(database, tmp_path):
    kept = KeptRows(database)
    assert kept.read("notes", lambda: texts(database), name="notes.texts") == tuple(["Saved"])
    with pytest.raises(RollbackRequested):
        with database.transaction():
            raise RollbackRequested()
    script = Database.opened(JournalHome(tmp_path))
    script.update(Statement("UPDATE notes SET version = 2, text = 'Written by the script' WHERE id = 1"))
    script.close()
    assert kept.read("notes", lambda: texts(database), name="notes.texts") == tuple(["Written by the script"])


def test_current_results_reuse_reads_and_refresh_after_a_write(database):
    kept = KeptRows(database)
    calls = []

    def read_notes():
        calls.append(True)
        return texts(database)

    assert kept.scoped_current(read_notes, name="notes.current") == tuple(["Saved"])
    assert kept.scoped_current(read_notes, name="notes.current") == tuple(["Saved"])
    assert len(calls) == 1
    database.update(Statement("UPDATE notes SET text = 'Changed', version = version + 1"))
    assert kept.scoped_current(read_notes, name="notes.current") == tuple(["Changed"])
    assert len(calls) == 2


def test_current_results_refresh_after_rollback(database):
    kept = KeptRows(database)
    with pytest.raises(RollbackRequested), database.transaction():
        database.update(Statement("UPDATE notes SET text = 'Temporary', version = version + 1"))
        assert kept.scoped_current(lambda: texts(database), name="notes.current") == tuple(["Temporary"])
        raise RollbackRequested
    assert kept.scoped_current(lambda: texts(database), name="notes.current") == tuple(["Saved"])


def test_current_results_keep_environments_separate(database):
    kept = KeptRows(database)
    database.row_owner = RowOwner(None, 1)
    assert kept.scoped_current(lambda: "First", name="notes.current") == "First"
    database.row_owner = RowOwner(None, 2)
    assert kept.scoped_current(lambda: "Second", name="notes.current") == "Second"
    database.row_owner = RowOwner(None, 1)
    assert kept.scoped_current(lambda: "Unexpected reload", name="notes.current") == "First"


def test_current_results_refresh_after_an_external_write(database, tmp_path):
    kept = KeptRows(database)
    assert kept.scoped_current(lambda: texts(database), name="notes.current") == tuple(["Saved"])
    second_database = Database.opened(JournalHome(tmp_path))
    second_database.update(Statement("UPDATE notes SET text = 'External', version = version + 1"))
    second_database.close()
    assert kept.scoped_current(lambda: texts(database), name="notes.current") == tuple(["External"])
