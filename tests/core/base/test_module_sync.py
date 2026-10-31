import json
import os

import pytest

from core.base.container import Container
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.module_finder import ModuleFinder
from core.base.module.module_sync import ModuleSync
from core.base.registry.registry import Registry, StaleRegistryError
from tests.core.base import sync_sample

LOANS = "tests.core.base.sync_sample:LoansModule"
LOAN_COUNT = "tests.core.base.sync_sample:LoanCountModule"
EVENT = Statement("INSERT INTO events (actor_id, row_id, name, row_table, command, created_at) VALUES (1, 1, 'loan.create', 'loans', 'LoanMake', '2026')")


def synced(home: JournalHome, *modules: str) -> Container:
    home.module_list.write_text(json.dumps(list(modules)))
    container = Container()
    container.bind(JournalHome, home)
    container.bind(Database, Database.opened(home))
    container.get(ModuleSync).run()
    return container


def test_the_registry_after_a_sync_names_every_noun_handler_guard_and_listener(tmp_path):
    container = synced(JournalHome(tmp_path), LOANS, LOAN_COUNT)
    database = container.get(Database)
    registry = Registry.read(database)
    assert {noun: (entry.module, entry.model.text) for noun, entry in registry.nouns.items()} == {"loan": ("loans", "tests.core.base.test_model:Loan")}
    assert list(registry.handlers) == ["core.base.command.make_command:MakeCommand"]
    assert [guard.name for guard in registry.guards] == ["loans.late-only"]
    module_actor = database.rows(Statement("SELECT id FROM actors WHERE type = 'module' AND name = 'loan-count'"))[0]["id"]
    assert [(listener.name, listener.timing.value, listener.actor_id) for listener in registry.listeners] == [("loans.count-overdue", "commit", module_actor)]
    assert [tuple(row) for row in database.rows(Statement("SELECT id, type, name FROM actors ORDER BY id"))] == [(1, "core", "core"), (2, "module", "loans"), (3, "module", "loan-count")]


def test_a_second_sync_changes_nothing(tmp_path):
    home = JournalHome(tmp_path)
    synced(home, LOANS, LOAN_COUNT)
    before = Database.opened(home).rows(Statement("SELECT * FROM registry"))[0]
    after = synced(home, LOANS, LOAN_COUNT).get(Database).rows(Statement("SELECT * FROM registry"))[0]
    assert tuple(before) == tuple(after)


def test_a_changed_module_changes_the_fingerprint_and_the_old_registry_is_refused(tmp_path):
    home = JournalHome(tmp_path)
    database = synced(home, LOANS).get(Database)
    modules = ModuleFinder(home).found()
    status = os.stat(sync_sample.__file__)
    os.utime(sync_sample.__file__, ns=(status.st_atime_ns, status.st_mtime_ns + 1_000_000))
    try:
        with pytest.raises(StaleRegistryError):
            Registry.read(database).require_current(CodeFingerprint().text(modules))
    finally:
        os.utime(sync_sample.__file__, ns=(status.st_atime_ns, status.st_mtime_ns))


def test_a_new_commit_listener_starts_at_the_newest_event(tmp_path):
    home = JournalHome(tmp_path)
    database = synced(home, LOANS).get(Database)
    database.insert(EVENT)
    database.insert(EVENT)
    database = synced(home, LOANS, LOAN_COUNT).get(Database)
    assert database.rows(Statement("SELECT event_id FROM listener_cursors WHERE listener = 'loans.count-overdue'"))[0][0] == 2
