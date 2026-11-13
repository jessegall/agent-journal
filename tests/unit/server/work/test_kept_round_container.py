import json
import sqlite3

import pytest

from engine.container.round_state import RoundState
from engine.journal.journal_home import JournalHome
from engine.module.journal_container import sync_modules
from server.work.kept_round_container import KeptRoundContainer


class CountedRoundState(RoundState):
    def __init__(self) -> None:
        self.reset_count = 0

    def reset(self) -> None:
        self.reset_count += 1


@pytest.fixture
def home(tmp_path) -> JournalHome:
    home = JournalHome(tmp_path)
    home.module_list.parent.mkdir(parents=True, exist_ok=True)
    home.module_list.write_text(json.dumps([]))
    sync_modules(home)
    return home


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
        connection.execute("UPDATE registry SET synced_at = ? WHERE id = 1", (synced_at,))
    connection.close()


def test_two_rounds_open_one_connection(home, connections):
    kept = KeptRoundContainer(home)
    kept.for_round()
    kept.for_round()
    assert len(connections) == 1
    kept.close()


def test_a_round_returns_the_same_container(home):
    kept = KeptRoundContainer(home)
    assert kept.for_round() is kept.for_round()
    kept.close()


def test_reset_runs_on_round_state_services_each_round(home):
    kept = KeptRoundContainer(home)
    service = kept.for_round().get(CountedRoundState)
    kept.for_round()
    kept.for_round()
    assert service.reset_count == 2
    kept.close()


def test_a_new_registry_version_rebuilds_once(home, connections):
    kept = KeptRoundContainer(home)
    first = kept.for_round()
    new_registry_version(home, "2099-01-01T00:00:00")
    second = kept.for_round()
    third = kept.for_round()
    assert second is not first and third is second
    assert len(connections) == 3
    kept.close()


def test_the_same_version_never_rebuilds(home, connections):
    kept = KeptRoundContainer(home)
    first = kept.for_round()
    for _ in range(5):
        assert kept.for_round() is first
    assert len(connections) == 1
    kept.close()


def test_close_twice_is_safe(home):
    kept = KeptRoundContainer(home)
    kept.for_round()
    kept.close()
    kept.close()
    assert kept.container is None
