from engine.time.clock import Clock
import pytest

from engine.database.core_tables_migration import CORE_MIGRATIONS
from engine.database.database import Database
from engine.database.schema import Schema
from engine.database.statement import Statement
from engine.journal.journal_home import JournalHome
from engine.model.tables import Tables


@pytest.fixture
def database(tmp_path):
    opened = Database.opened(JournalHome(tmp_path))
    yield opened
    opened.close()


def test_a_fresh_database_gets_every_bookkeeping_table_once(database):
    schema = Schema(database, Tables(), Clock())
    assert schema.migrate([CORE_MIGRATIONS]) == ["core 1", "core 2", "core 3", "core 4"]
    assert schema.migrate([CORE_MIGRATIONS]) == []
    names = [row["name"] for row in database.rows(Statement("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name"))]
    assert names == ["actors", "events", "listener_cursors", "listener_skips", "migrations", "refusals", "registry", "version_four_map", "version_four_moves"]


def test_the_core_migrations_make_the_core_actor_for_the_rows_modules_seed(database):
    Schema(database, Tables(), Clock()).migrate([CORE_MIGRATIONS])
    assert [tuple(row) for row in database.rows(Statement("SELECT id, type, name FROM actors"))] == [(1, "core", "core")]
