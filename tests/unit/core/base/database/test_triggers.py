import sqlite3
from dataclasses import dataclass
from enum import StrEnum

import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.database.triggers import Triggers
from core.base.journal_home import JournalHome
from core.base.model.model import Model
from core.base.model.tables import Tables
from tests.unit.core.base.model.test_lifecycle import ItemLifecycle, ItemState


class ItemLength(StrEnum):
    SHORT = "short"
    LONG = "long"


@dataclass(frozen=True, kw_only=True)
class Item(Model):
    model_name = "item"
    cli_name = "item"
    lifecycle = ItemLifecycle

    title: str
    state: ItemState = ItemState.OPEN
    length: ItemLength = ItemLength.SHORT


@pytest.fixture
def database(tmp_path):
    opened = Database.opened(JournalHome(tmp_path))
    opened.update(Statement("CREATE TABLE items (id INTEGER PRIMARY KEY, title TEXT NOT NULL, state TEXT NOT NULL, length TEXT NOT NULL) STRICT"))
    Triggers(opened, Tables()).rebuild([Item])
    yield opened
    opened.close()


def refused(database: Database, sql: str) -> str:
    with pytest.raises(sqlite3.IntegrityError) as raised:
        database.update(Statement(sql))
    return str(raised.value)


def test_a_new_row_starts_only_in_an_initial_state(database):
    assert refused(database, "INSERT INTO items (title, state, length) VALUES ('Dune', 'closed', 'short')") == "rule: a new item starts as open"
    database.insert(Statement("INSERT INTO items (title, state, length) VALUES ('Dune', 'open', 'short')"))


def test_a_state_changes_only_along_a_move_and_an_unchanged_state_passes(database):
    database.insert(Statement("INSERT INTO items (title, state, length) VALUES ('Dune', 'open', 'short')"))
    database.update(Statement("UPDATE items SET title = 'Dune Messiah', state = 'open'"))
    database.update(Statement("UPDATE items SET state = 'closed'"))
    assert refused(database, "UPDATE items SET state = 'paused'").startswith("rule: no move of an item")


def test_a_row_is_deleted_only_in_a_deletable_state(database):
    database.insert(Statement("INSERT INTO items (title, state, length) VALUES ('Dune', 'open', 'short')"))
    database.update(Statement("UPDATE items SET state = 'paused'"))
    assert refused(database, "DELETE FROM items") == "rule: an item in that state cannot be deleted"


def test_an_enum_column_takes_only_its_enum_values(database):
    assert refused(database, "INSERT INTO items (title, state, length) VALUES ('Dune', 'open', 'forever')") == "rule: an item's length is one of short, long"
    database.insert(Statement("INSERT INTO items (title, state, length) VALUES ('Dune', 'open', 'long')"))
    assert refused(database, "UPDATE items SET length = 'forever'") == "rule: an item's length is one of short, long"


def test_rebuilding_twice_leaves_one_set_of_triggers(database):
    Triggers(database, Tables()).rebuild([Item])
    names = [row["name"] for row in database.rows(Statement("SELECT name FROM sqlite_master WHERE type = 'trigger' ORDER BY name"))]
    assert names == ["items_rule_length_insert", "items_rule_length_update", "items_rule_state_delete", "items_rule_state_insert", "items_rule_state_move"]
