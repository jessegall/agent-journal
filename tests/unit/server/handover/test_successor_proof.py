from engine.time.clock import Clock
import json
import sqlite3

import pytest

from engine.journal.journal_home import JournalHome
from engine.module.errors.module_error import ModuleError
from server.tick.server_backup import ServerBackup
from server.handover.successor_proof import SuccessorProof
from server.handover import successor_proof


@pytest.fixture
def home(tmp_path, monkeypatch) -> JournalHome:
    journal = JournalHome(tmp_path)
    sqlite3.connect(journal.database).close()
    monkeypatch.setattr(successor_proof, "sync_modules", lambda synced_home: None)
    return journal


def test_new_migrations_leave_a_database_copy_to_go_back_to(home, monkeypatch):
    monkeypatch.setattr(SuccessorProof, "has_pending_migrations", lambda proof: True)
    SuccessorProof(home).run()
    assert len(ServerBackup(home, Clock()).copies()) == 1


def test_a_listed_module_that_refuses_the_new_core_fails_the_proof_on_the_empty_database(tmp_path):
    journal = JournalHome(tmp_path)
    journal.module_list.write_text(json.dumps(["tests.unit.engine.module.test_module_order:FutureCoreModule"]))
    with pytest.raises(ModuleError, match="needs core"):
        SuccessorProof(journal).run()


def test_both_proof_homes_hold_the_listed_modules(home, monkeypatch, tmp_path_factory):
    home.module_list.write_text("[]")
    home.modules_folder.mkdir()
    (home.modules_folder / "acme.py").write_text("")
    synced = []
    monkeypatch.setattr(successor_proof, "sync_modules", lambda synced_home: synced.append((synced_home.module_list.read_text(), (synced_home.modules_folder / "acme.py").exists())))
    monkeypatch.setattr(SuccessorProof, "has_pending_migrations", lambda proof: True)
    SuccessorProof(home).run()
    assert synced == [("[]", True), ("[]", True)]


def test_no_new_migrations_write_no_copy(home, monkeypatch):
    monkeypatch.setattr(SuccessorProof, "has_pending_migrations", lambda proof: False)
    SuccessorProof(home).run()
    assert ServerBackup(home, Clock()).copies() == []
