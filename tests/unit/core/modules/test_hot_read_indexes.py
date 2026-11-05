import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.journal_container import opened_container
from core.base.journal_home import JournalHome
from core.base.module.module_sync import ModuleSync
from core.modules.tasks.models.support.views import closed_task_counts_select


@pytest.fixture
def database(tmp_path):
    container = opened_container(JournalHome(tmp_path))
    container.get(ModuleSync).run()
    opened = container.get(Database)
    yield opened
    opened.close()


@pytest.mark.parametrize("statement,index", [
    (Statement(closed_task_counts_select(1), ("2026-11-01", 1, "2026-11-01")), "tasks_environment_closed"),
    (Statement("SELECT * FROM plugin_queue_files WHERE plugin_id = ? AND name = ?", (1, "card.json")), "plugin_queue_files_plugin_name"),
    (Statement("SELECT * FROM checks WHERE removed_at IS NULL AND task_wait_id > ?", [0]), "checks_open_task_wait"),
    (Statement("SELECT id FROM agents WHERE role <> ?", ["main"]), "agents_role"),
])
def test_a_hot_read_uses_its_index(database, statement, index):
    plans = [row[3] for row in database.connection.execute(f"EXPLAIN QUERY PLAN {statement.sql}", statement.parameters)]
    assert any(index in plan for plan in plans), plans
