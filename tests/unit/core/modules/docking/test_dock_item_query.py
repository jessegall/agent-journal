from unittest.mock import patch

import pytest

from core.base.database.database import Database
from engine.journal.journal_home import JournalHome
from core.base.model.tables import Tables
from engine.time.timestamp import Timestamp
from core.modules.docking.docking_module import DockingModule
from core.modules.docking.queries.dock_item_query import DockItemQuery


@pytest.fixture
def database(tmp_path):
    opened = Database.opened(JournalHome(tmp_path))
    for migration in DockingModule.migrations:
        if migration.number in (1, 4, 5, 6):
            migration().run(opened)
    yield opened
    opened.close()


def test_leaving_items_use_the_due_index_without_a_table_scan(database):
    query = DockItemQuery(database, Tables())
    with patch.object(database, "rows", wraps=database.rows) as reads:
        query.leaving(Timestamp.parsed("2026-11-05T13:00:00+00:00"))
    plans = [row[3] for call in reads.call_args_list for row in database.connection.execute(
        f"EXPLAIN QUERY PLAN {call.args[0].sql}", call.args[0].parameters)]
    assert plans and all("SEARCH dock_items USING INDEX dock_items_due" in plan for plan in plans), plans
    assert all("SCAN" not in plan for plan in plans), plans


def test_waiting_items_of_a_row_use_the_target_index_without_a_table_scan(database):
    query = DockItemQuery(database, Tables()).row_items("task", 44).waiting()
    statement = query.select.statement()
    plans = [row[3] for row in database.connection.execute(f"EXPLAIN QUERY PLAN {statement.sql}", statement.parameters)]
    assert plans and all("SEARCH dock_items USING INDEX dock_items_target" in plan for plan in plans), plans
    assert all("SCAN" not in plan for plan in plans), plans
