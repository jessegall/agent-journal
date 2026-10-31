import pytest

from core.base.database.core_tables import CORE_MIGRATIONS
from core.base.database.database import Database
from core.base.database.schema import Schema
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome
from core.base.model.tables import Tables


@pytest.fixture
def database(tmp_path):
    opened = Database.opened(JournalHome(tmp_path))
    yield opened
    opened.close()


def test_a_fresh_database_gets_every_bookkeeping_table_once(database):
    schema = Schema(database, Tables())
    assert schema.migrate([CORE_MIGRATIONS]) == ["core 1", "core 2"]
    assert schema.migrate([CORE_MIGRATIONS]) == []
    names = [row["name"] for row in database.rows(Statement("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name"))]
    assert names == ["actors", "events", "listener_cursors", "listener_skips", "migrations", "refusals", "registry"]


def test_the_core_migrations_make_the_core_actor_for_the_rows_modules_seed(database):
    Schema(database, Tables()).migrate([CORE_MIGRATIONS])
    assert [tuple(row) for row in database.rows(Statement("SELECT id, type, name FROM actors"))] == [(1, "core", "core")]
