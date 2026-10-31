import json

import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome
from core.base.module.module_error import ModuleError
from core.base.module.module_removal import ModuleRemoval
from tests.core.base.test_module_sync import LOAN_COUNT, LOANS, synced

REMOVABLE_LOANS = "tests.core.base.sync_sample:RemovableLoansModule"
LOAN = Statement("INSERT INTO loans (title, state, version, created_at, updated_at) VALUES ('Dune', 'lent', 1, '2026', '2026')")
TABLES = Statement("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'loans'")


def test_a_module_whose_tables_hold_rows_is_refused(tmp_path):
    container = synced(JournalHome(tmp_path), LOANS)
    container.get(Database).insert(LOAN)
    with pytest.raises(ModuleError, match="loans still has 1 rows in loans"):
        container.get(ModuleRemoval).remove("loans")


def test_a_module_with_a_removal_migration_is_removed_with_its_rows(tmp_path):
    home = JournalHome(tmp_path)
    container = synced(home, REMOVABLE_LOANS)
    database = container.get(Database)
    database.insert(LOAN)
    container.get(ModuleRemoval).remove("loans")
    assert database.rows(TABLES) == []
    assert database.rows(Statement("SELECT * FROM migrations WHERE module = 'loans'")) == []
    assert json.loads(home.module_list.read_text()) == []


def test_a_removed_module_takes_its_listener_cursors_with_it(tmp_path):
    container = synced(JournalHome(tmp_path), LOANS, LOAN_COUNT)
    container.get(ModuleRemoval).remove("loan-count")
    assert container.get(Database).rows(Statement("SELECT * FROM listener_cursors")) == []


def test_a_default_or_unknown_module_cannot_be_removed(tmp_path):
    container = synced(JournalHome(tmp_path), LOANS)
    with pytest.raises(ModuleError, match="no installed plugin"):
        container.get(ModuleRemoval).remove("tasks")
