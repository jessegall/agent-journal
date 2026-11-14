import sqlite3
from concurrent.futures import ThreadPoolExecutor, TimeoutError
from threading import Event

import pytest

from engine.database.listener_cursor_table import ListenerCursorTable
from engine.listener.commit.commit_listener_runner import CommitListenerRunner
from server.work.listeners.ordinary_listener_work import OrdinaryListenerWork
from server.work.rounds.journal_round import JournalRound
from server.work.rounds.per_round_container import PerRoundContainer
from server.work.rounds.round_work import RoundWork


class ListenerRound(RoundWork):
    """Signals when an ordinary listener round begins."""

    def __init__(self) -> None:
        self.entered = Event()

    def run(self, container) -> None:
        self.entered.set()
        OrdinaryListenerWork().run(container)


def test_an_ordinary_listener_round_waits_past_five_seconds_for_a_writer(journal, monkeypatch):
    with monkeypatch.context() as delayed:
        delayed.setattr(CommitListenerRunner, "run", lambda runner: None)
        made = journal.run('task make "Waiting for a listener" --brief "A task whose events wait"')
        assert made.code == 0, made.text
    positions = journal.container.get(ListenerCursorTable).positions()
    work = ListenerRound()
    connection = sqlite3.connect(journal.home.database, timeout=0, autocommit=True)
    try:
        connection.execute("BEGIN IMMEDIATE")
        with ThreadPoolExecutor(1) as pool:
            running = pool.submit(JournalRound(journal.home, "ordinary listener", work, PerRoundContainer(journal.home)).run)
            try:
                assert work.entered.wait(3)
                with pytest.raises(TimeoutError):
                    running.result(timeout=5.2)
            finally:
                connection.execute("ROLLBACK")
            running.result(timeout=10)
    finally:
        connection.close()
    after = journal.container.get(ListenerCursorTable).positions()
    assert any(after[name] > position for name, position in positions.items())
