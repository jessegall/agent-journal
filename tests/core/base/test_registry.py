import json
import sys

import pytest

from core.base.database.core_tables import CORE_MIGRATIONS
from core.base.database.database import Database
from core.base.database.schema import Schema
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome
from core.base.model.tables import Tables
from core.base.registry.dotted_path import DottedPath, DottedPathError
from core.base.registry.listener_entry import ListenerTiming
from core.base.registry.registry import Registry, StaleRegistryError
from tests.core.base.test_commands import LoanMake

SAMPLE = "tests.core.base.registry_sample:SampleGuard"
ENTRIES = {
    "nouns": {"loan": {"module": "loans", "model": "tests.core.base.test_model:Loan", "commands": []}},
    "handlers": {DottedPath.class_path(LoanMake).text: "tests.core.base.test_commands:LoanMake"},
    "subcommands": {"loan make": "tests.core.base.test_commands:LoanMake"},
    "guards": [
        {"name": "loans.no-second-loan", "event": "loan.create", "path": SAMPLE, "position": 2, "short_flag": ""},
        {"name": "core.lifecycle", "event": "*", "path": SAMPLE, "position": 1, "short_flag": ""},
        {"name": "loans.only-shelved", "event": "shelf.*", "path": SAMPLE, "position": 3, "short_flag": "confirm"},
    ],
    "listeners": [
        {"name": "loans.tell-the-reader", "event": "loan.*", "timing": "commit", "path": SAMPLE, "position": 1, "actor_id": 3},
        {"name": "loans.count-loans", "event": "loan.create", "timing": "save", "path": SAMPLE, "position": 2, "actor_id": 3},
    ],
}


@pytest.fixture
def database(tmp_path):
    opened = Database.opened(JournalHome(tmp_path))
    Schema(opened, Tables()).migrate((CORE_MIGRATIONS,))
    opened.insert(Statement("INSERT INTO registry (id, fingerprint, entries, synced_at) VALUES (1, 'abc', ?, '2026-10-31')", (json.dumps(ENTRIES),)))
    yield opened
    opened.close()


def test_the_guards_of_an_event_come_in_their_order(database):
    registry = Registry.read(database)
    assert [guard.name for guard in registry.event_guards("loan.create")] == ["core.lifecycle", "loans.no-second-loan"]
    assert [guard.name for guard in registry.event_guards("shelf.update")] == ["core.lifecycle", "loans.only-shelved"]


def test_a_guard_is_skipped_by_its_short_flag_or_by_name(database):
    guards = {guard.name: guard for guard in Registry.read(database).guards}
    assert guards["loans.only-shelved"].skip_flag == "--confirm"
    assert guards["loans.no-second-loan"].skip_flag == "--skip-guard loans.no-second-loan"


def test_listeners_are_listed_by_event_and_timing(database):
    registry = Registry.read(database)
    assert [listener.name for listener in registry.event_listeners("loan.create", ListenerTiming.COMMIT)] == ["loans.tell-the-reader"]
    assert [listener.name for listener in registry.event_listeners("loan.create", ListenerTiming.SAVE)] == ["loans.count-loans"]


def test_a_command_finds_its_handler(database):
    registry = Registry.read(database)
    assert registry.has_handler(LoanMake) and registry.command_handler(LoanMake).loaded() is LoanMake


def test_a_registry_built_from_other_code_is_refused(database):
    registry = Registry.read(database)
    registry.require_current("abc")
    with pytest.raises(StaleRegistryError, match="journal module sync"):
        registry.require_current("def")


def test_a_journal_never_synced_is_told_to_sync(tmp_path):
    database = Database.opened(JournalHome(tmp_path))
    Schema(database, Tables()).migrate((CORE_MIGRATIONS,))
    with pytest.raises(StaleRegistryError, match="never been synced"):
        Registry.read(database)


def test_a_class_named_by_its_path_is_imported_only_when_asked_for(database):
    sys.modules.pop("tests.core.base.registry_sample", None)
    Registry.read(database)
    assert "tests.core.base.registry_sample" not in sys.modules
    assert DottedPath(SAMPLE).loaded().__name__ == "SampleGuard"
    with pytest.raises(DottedPathError):
        DottedPath("tests.core.base.registry_sample:Nothing").loaded()
