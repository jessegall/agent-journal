import sqlite3
from concurrent.futures import ThreadPoolExecutor
from threading import Event

from engine.database.database import Database
from engine.database.listener_cursor_table import ListenerCursorTable
from engine.listener.commit.commit_listener_runner import CommitListenerRunner
from server.work.listeners.ordinary_listener_work import OrdinaryListenerWork
from server.work.rounds.journal_round import JournalRound
from server.work.rounds.kept_round_container import background_container
from server.work.rounds.per_round_container import PerRoundContainer
from server.work.rounds.round_work import RoundWork


class ListenerRound(RoundWork):
    """Signals when an ordinary listener round begins."""

    def __init__(self) -> None:
        self.entered = Event()

    def run(self, container) -> None:
        self.entered.set()
        OrdinaryListenerWork().run(container)


LONG_WAIT_SECONDS = 60


def waiting_container(home):
    container = background_container(home)
    container.get(Database).set_busy_timeout(LONG_WAIT_SECONDS)
    return container


def test_an_ordinary_listener_round_goes_on_once_the_writer_it_waits_for_lets_go(journal, monkeypatch):
    with monkeypatch.context() as delayed:
        delayed.setattr(CommitListenerRunner, "run", lambda runner: None)
        made = journal.run('task make "Waiting for a listener" --brief "A task whose events wait"')
        assert made.code == 0, made.text
    positions = journal.container.get(ListenerCursorTable).positions()
    writing = Event()
    store = Database.update

    def noted_write(database, statement):
        writing.set()
        return store(database, statement)

    monkeypatch.setattr(Database, "update", noted_write)
    connection = sqlite3.connect(journal.home.database, timeout=0, autocommit=True)
    try:
        connection.execute("BEGIN IMMEDIATE")
        with ThreadPoolExecutor(1) as pool:
            running = pool.submit(JournalRound(journal.home, "ordinary listener", ListenerRound(), PerRoundContainer(journal.home, waiting_container)).run)
            try:
                assert writing.wait(30)
            finally:
                connection.execute("ROLLBACK")
            running.result(timeout=60)
    finally:
        connection.close()
    after = journal.container.get(ListenerCursorTable).positions()
    assert any(after[name] > position for name, position in positions.items())
