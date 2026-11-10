import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from engine.journal.journal_home import JournalHome
from core.base.listener.event_rows import EventRows
from engine.model.tables import Tables
from engine.query.queries import Queries
from tests.unit.engine.model.test_table import LogEntry
from tests.unit.engine.query.test_query import entries

__all__ = ["entries"]


@pytest.fixture
def event_rows(entries):
    tables = Tables()
    return EventRows(Queries(entries.database, tables))


def test_prepared_rows_are_read_together_and_reused_after_other_writes(entries, event_rows):
    reads = []
    entries.database.connection.set_trace_callback(reads.append)
    event_rows.prepare(LogEntry, [1, 2, 3])
    for number in range(12):
        entries.database.update(Statement("UPDATE log_entries SET version = version + 1 WHERE id = 7"))
        assert event_rows.required(LogEntry, 1).title == "Book 1"
    selects = [sql for sql in reads if sql.startswith("SELECT * FROM log_entries")]
    assert len(selects) == 1


def test_a_saved_row_replaces_the_cached_row_without_another_read(entries, event_rows):
    row = event_rows.required(LogEntry, 1)
    entries.database.update(Statement("UPDATE log_entries SET title = 'Saved', version = version + 1 WHERE id = 1"))
    event_rows.remember(row.changed(title="Saved", version=row.version + 1))
    reads = []
    entries.database.connection.set_trace_callback(reads.append)
    assert event_rows.required(LogEntry, 1).title == "Saved"
    assert not any(sql.startswith("SELECT *") for sql in reads)


def test_a_rollback_discards_a_saved_cached_row(entries, event_rows):
    row = event_rows.required(LogEntry, 1)
    with pytest.raises(RuntimeError), entries.database.transaction():
        entries.database.update(Statement("UPDATE log_entries SET title = 'Temporary', version = version + 1 WHERE id = 1"))
        event_rows.remember(row.changed(title="Temporary", version=row.version + 1))
        raise RuntimeError()
    assert event_rows.required(LogEntry, 1).title == "Book 1"


def test_an_external_commit_refreshes_the_cached_row(entries, event_rows, tmp_path):
    assert event_rows.required(LogEntry, 1).title == "Book 1"
    external = Database.opened(JournalHome(tmp_path))
    try:
        external.update(Statement("UPDATE log_entries SET title = 'External', version = version + 1 WHERE id = 1"))
    finally:
        external.close()
    assert event_rows.required(LogEntry, 1).title == "External"


def test_a_deleted_row_is_not_returned_from_the_cache(entries, event_rows):
    row = event_rows.required(LogEntry, 1)
    entries.database.update(Statement("DELETE FROM log_entries WHERE id = 1"))
    event_rows.remove(row)
    assert event_rows.find(LogEntry, 1) is None


def test_an_external_unrelated_write_keeps_the_row_without_loading_it_twice(entries, event_rows, tmp_path):
    assert event_rows.required(LogEntry, 1).title == "Book 1"
    external = Database.opened(JournalHome(tmp_path))
    try:
        external.update(Statement("UPDATE log_entries SET version = version + 1 WHERE id = 7"))
    finally:
        external.close()
    reads = []
    entries.database.connection.set_trace_callback(reads.append)
    assert event_rows.required(LogEntry, 1).title == "Book 1"
    assert not any(sql.startswith("SELECT *") for sql in reads)


def test_a_row_without_a_session_column_is_read_once_whoever_reads_it(entries, event_rows):
    reads = []
    entries.database.connection.set_trace_callback(reads.append)
    event_rows.required(LogEntry, 1)
    entries.database.read_actor_id = 694
    try:
        event_rows.required(LogEntry, 1)
    finally:
        entries.database.read_actor_id = None
    assert len([sql for sql in reads if sql.startswith("SELECT * FROM log_entries")]) == 1
