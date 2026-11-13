import os
import sqlite3

import pytest

from engine.container.round_state import RoundState
from engine.database.database import Database
from engine.journal.journal_home import JournalHome
from server.work.kept_round_container import KeptRoundContainer


class CountedRoundState(RoundState):
    def __init__(self) -> None:
        self.reset_count = 0

    def reset(self) -> None:
        self.reset_count += 1


@pytest.fixture
def connections(monkeypatch) -> list[object]:
    opened: list[object] = []
    connect = sqlite3.connect

    def counted_connect(*arguments, **options):
        opened.append(arguments)
        return connect(*arguments, **options)

    monkeypatch.setattr(sqlite3, "connect", counted_connect)
    return opened


def new_registry_version(home: JournalHome, synced_at: str) -> None:
    with sqlite3.connect(home.database, autocommit=True) as connection:
        connection.execute("UPDATE registry SET synced_at = ? WHERE id = 1", [synced_at])
    connection.close()


def test_two_rounds_open_one_connection(home, connections):
    kept = KeptRoundContainer(home)
    kept.round_container()
    kept.round_container()
    assert len(connections) == 1
    kept.close()


def test_a_round_returns_the_same_container(home):
    kept = KeptRoundContainer(home)
    assert kept.round_container() is kept.round_container()
    kept.close()


def test_reset_runs_on_round_state_services_each_round(home):
    kept = KeptRoundContainer(home)
    service = kept.round_container().get(CountedRoundState)
    kept.round_container()
    kept.round_container()
    assert service.reset_count == 2
    kept.close()


def test_a_new_registry_version_rebuilds_once(home, connections):
    kept = KeptRoundContainer(home)
    first = kept.round_container()
    new_registry_version(home, "2099-01-01T00:00:00")
    connection_count = len(connections)
    second = kept.round_container()
    third = kept.round_container()
    assert second is not first and third is second
    assert len(connections) == connection_count + 1
    kept.close()


def test_the_same_version_never_rebuilds(home, connections):
    kept = KeptRoundContainer(home)
    first = kept.round_container()
    for _ in range(5):
        assert kept.round_container() is first
    assert len(connections) == 1
    kept.close()


def test_close_twice_is_safe(home):
    kept = KeptRoundContainer(home)
    kept.round_container()
    kept.close()
    kept.close()
    assert kept.container is None


def system_log(home: JournalHome) -> str:
    return home.system_log.read_text()


def test_a_round_left_in_a_transaction_is_rolled_back_and_named(home):
    kept = KeptRoundContainer(home)
    database = kept.round_container().get(Database)
    database.connection.execute("BEGIN")
    kept.ended_round("event listeners")
    assert not database.has_transaction
    assert kept.round_container().get(Database) is database
    assert "event listeners" in system_log(home)
    kept.close()


def test_a_failed_round_keeps_the_container(home):
    kept = KeptRoundContainer(home)
    first = kept.round_container()
    kept.failed(RuntimeError("the work failed"), "event listeners")
    assert kept.round_container() is first
    kept.close()


def test_a_broken_connection_closes_and_the_next_round_rebuilds_with_a_logged_reason(home):
    kept = KeptRoundContainer(home)
    first = kept.round_container()
    kept.failed(sqlite3.DatabaseError("database disk image is malformed"), "event listeners")
    assert kept.container is None
    assert kept.round_container() is not first
    assert "kept container rebuilt: event listeners: database disk image is malformed" in system_log(home)
    kept.close()


def test_a_busy_error_keeps_the_container(home):
    kept = KeptRoundContainer(home)
    first = kept.round_container()
    busy = sqlite3.OperationalError("database is locked")
    busy.sqlite_errorcode = sqlite3.SQLITE_BUSY
    kept.failed(busy, "event listeners")
    assert kept.round_container() is first
    kept.close()


def test_a_replaced_database_file_rebuilds_at_the_next_round(home, tmp_path):
    kept = KeptRoundContainer(home)
    first = kept.round_container()
    copy = tmp_path / "copy.sqlite"
    first.get(Database).write_backup(copy)
    os.replace(copy, home.database)
    assert kept.round_container() is not first
    assert "kept container rebuilt: database file replaced" in system_log(home)
    kept.close()
