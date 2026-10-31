from dataclasses import dataclass
from datetime import datetime, timezone

import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.database.table_statements import TableStatements
from core.base.journal_home import JournalHome
from core.base.model.model import Model
from core.base.model.table import Table
from core.base.timestamp import Timestamp

AT = Timestamp(datetime(2026, 10, 31, 9, tzinfo=timezone.utc))


@dataclass(frozen=True, kw_only=True)
class Shelf(Model):
    model_name = "shelf"
    cli_name = "shelf"
    table = "shelves"

    label: str
    level: int = 1


@pytest.fixture
def statements():
    return TableStatements(Table.build(Shelf))


@pytest.fixture
def database(tmp_path):
    opened = Database.opened(JournalHome(tmp_path))
    opened.update(Statement("CREATE TABLE shelves (id INTEGER PRIMARY KEY, label TEXT NOT NULL, level INTEGER NOT NULL, version INTEGER NOT NULL,"
                            " metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT"))
    yield opened
    opened.close()


def test_an_insert_writes_the_first_version_and_both_timestamps(statements):
    statement = statements.insert({"id": 0, "label": "top", "level": 2}, AT)
    assert statement.sql == "INSERT INTO shelves (label, level, version, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
    assert statement.parameters == ("top", 2, 1, AT.text, AT.text)


def test_an_update_writes_only_the_changed_fields_at_the_version_read(statements):
    statement = statements.update(4, 2, {"level": 3}, AT)
    assert statement.sql == "UPDATE shelves SET level = ?, version = version + 1, updated_at = ? WHERE id = ? AND version = ?"
    assert statement.parameters == (3, AT.text, 4, 2)


def test_an_update_at_a_stale_version_changes_no_row(statements, database):
    row_id = database.insert(statements.insert({"label": "top", "level": 1}, AT))
    assert database.update(statements.update(row_id, 1, {"level": 2}, AT)) == 1
    assert database.update(statements.update(row_id, 1, {"level": 3}, AT)) == 0
    assert database.rows(statements.read(row_id))[0]["level"] == 2


def test_a_delete_and_a_read_name_the_row(statements):
    assert statements.delete(4, 2) == Statement("DELETE FROM shelves WHERE id = ? AND version = ?", (4, 2))
    assert statements.read(4) == Statement("SELECT * FROM shelves WHERE id = ?", [4])
