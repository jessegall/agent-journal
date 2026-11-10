from engine.time.clock import Clock
import pytest

from core.base.database.core_tables_migration import CORE_MIGRATIONS
from core.base.database.database import Database
from core.base.database.listener_cursor_table import ListenerCursorTable
from core.base.database.schema import Schema
from core.base.database.statement import Statement
from engine.journal.journal_home import JournalHome
from core.base.model.tables import Tables


@pytest.mark.parametrize("present", [[], ["present"]], ids=["no-listeners", "one-listener"])
def test_removing_absent_listeners_cleans_cursors_and_skips_without_a_cursor(tmp_path, present):
    database = Database.opened(JournalHome(tmp_path))
    Schema(database, Tables(), Clock()).migrate([CORE_MIGRATIONS])
    cursors = ListenerCursorTable(database)
    cursors.start("present")
    cursors.start("removed")
    cursors.failure_count("present", 0)
    cursors.failure_count("removed", 0)
    cursors.failure_count("skip-only", 0)

    with database.transaction():
        cursors.remove_absent(present)

    assert set(cursors.positions()) == set(present)
    assert {row[0] for row in database.rows(Statement("SELECT listener FROM listener_skips"))} == set(present)
    database.close()
