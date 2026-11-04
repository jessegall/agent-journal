import sqlite3

import pytest

from core.base.journal_home import JournalHome
from server.server_backup import ServerBackup
from server.successor_proof import SuccessorProof
from server import successor_proof


@pytest.fixture
def home(tmp_path, monkeypatch) -> JournalHome:
    journal = JournalHome(tmp_path)
    sqlite3.connect(journal.database).close()
    monkeypatch.setattr(successor_proof, "sync_modules", lambda synced_home: None)
    return journal


def test_new_migrations_leave_a_database_copy_to_go_back_to(home, monkeypatch):
    monkeypatch.setattr(SuccessorProof, "has_pending_migrations", lambda proof: True)
    SuccessorProof(home).run()
    assert len(ServerBackup(home).copies()) == 1


def test_no_new_migrations_write_no_copy(home, monkeypatch):
    monkeypatch.setattr(SuccessorProof, "has_pending_migrations", lambda proof: False)
    SuccessorProof(home).run()
    assert ServerBackup(home).copies() == []
