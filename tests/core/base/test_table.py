from dataclasses import dataclass
from datetime import datetime, timezone

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome
from core.base.metadata import Metadata
from core.base.model.model import Model
from core.base.model.table import Table, plural
from core.base.model.tables import Tables
from core.base.moment import Moment
from tests.core.base.test_lifecycle import LoanLifecycle, LoanState

AT = Moment(datetime(2026, 10, 31, 9, tzinfo=timezone.utc))


@dataclass(frozen=True, kw_only=True)
class LibraryEntry(Model):
    name = "library_entry"
    cli_noun = "entry"
    lifecycle = LoanLifecycle

    title: str
    shelf_id: int | None = None
    state: LoanState = LoanState.LENT
    is_rare: bool = False
    due_at: Moment | None = None


def test_a_table_is_named_as_the_plural_of_its_model():
    assert Table.build(LibraryEntry).name == "library_entries"
    assert (plural("task"), plural("task_dependency"), plural("key"), plural("class")) == ("tasks", "task_dependencies", "keys", "classes")


def test_the_columns_are_the_stored_fields_without_the_move():
    assert Table.build(LibraryEntry).columns == ("id", "version", "metadata", "created_at", "updated_at", "title", "shelf_id", "state", "is_rare", "due_at")


def test_the_fields_a_new_row_needs_are_told_from_those_with_a_default():
    table = Table.build(LibraryEntry)
    assert table.required_fields == ("title",)
    assert table.optional_fields == ("shelf_id", "state", "is_rare", "due_at")


def test_every_kind_of_value_reads_back_as_it_was_stored(tmp_path):
    entry = LibraryEntry(id=3, version=2, metadata=Metadata.parsed('{"reviews": {"asked": true}}'), created_at=AT, updated_at=AT,
                         title="Dune", shelf_id=None, state=LoanState.LATE, is_rare=True, due_at=AT)
    table = Table.build(LibraryEntry)
    database = Database.opened(JournalHome(tmp_path))
    database.update(Statement(f"CREATE TABLE {table.name} ({', '.join(table.columns)})"))
    row = table.row(entry, table.columns)
    database.insert(Statement(f"INSERT INTO {table.name} VALUES ({', '.join('?' * len(row))})", tuple(row.values())))
    assert table.row_model(database.rows(Statement(f"SELECT * FROM {table.name}"))[0]) == entry


def test_tables_works_out_each_models_table_once():
    tables = Tables()
    assert tables.table(LibraryEntry) is tables.table(LibraryEntry)
