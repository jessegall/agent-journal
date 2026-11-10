import sqlite3
from concurrent.futures import ThreadPoolExecutor, TimeoutError
from threading import Event

import pytest

from engine.database.listener_cursor_table import ListenerCursorTable
from engine.listener.commit_listener_runner import CommitListenerRunner
from server.work.journal_round import JournalRound
from server.work.ordinary_listener_work import OrdinaryListenerWork
from server.work.round_work import RoundWork
from tests.stories.core.support.fixtures import UserJoined


class ListenerRound(RoundWork):
    """Signals when an ordinary listener round begins."""

    def __init__(self) -> None:
        self.entered = Event()

    def run(self, container) -> None:
        self.entered.set()
        OrdinaryListenerWork().run(container)


def test_an_ordinary_listener_round_waits_past_five_seconds_for_a_writer(new_story, monkeypatch):
    story = new_story(fixture=UserJoined)
    with monkeypatch.context() as delayed:
        delayed.setattr(CommitListenerRunner, "run", lambda runner: None)
        story.expect_success('task make "Waiting for a listener" --environment main')
    positions = story.container.get(ListenerCursorTable).positions()
    work = ListenerRound()
    connection = sqlite3.connect(story.home.database, timeout=0, autocommit=True)
    try:
        connection.execute("BEGIN IMMEDIATE")
        with ThreadPoolExecutor(1) as pool:
            running = pool.submit(JournalRound(story.home, "ordinary listener", work).run)
            try:
                story.expect_rows(work.entered.wait(3))
                with pytest.raises(TimeoutError):
                    running.result(timeout=5.2)
            finally:
                connection.execute("ROLLBACK")
            running.result(timeout=10)
    finally:
        connection.close()
    after = story.container.get(ListenerCursorTable).positions()
    story.expect_rows(any(after[name] > position for name, position in positions.items()))
