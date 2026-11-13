import threading

import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from engine.database.never_waiting_write_turns import NeverWaitingWriteTurns
from engine.database.write_turns import WriteTurns
from engine.journal.journal_home import JournalHome


class RecordingWriteTurns(WriteTurns):
    """Write turns that note each take and give back, in order."""

    def __init__(self) -> None:
        super().__init__()
        self.steps: list[str] = []

    def acquire(self) -> None:
        self.steps.append("take")

    def release(self) -> None:
        self.steps.append("give back")


class FailedBody(Exception):
    pass


@pytest.fixture
def turns() -> RecordingWriteTurns:
    return RecordingWriteTurns()


@pytest.fixture
def database(tmp_path, turns):
    opened = Database.opened(JournalHome(tmp_path), turns)
    opened.update(Statement("CREATE TABLE notes (id INTEGER PRIMARY KEY, text TEXT NOT NULL) STRICT"))
    turns.steps.clear()
    yield opened
    opened.close()


def insert_note(database: Database) -> int:
    return database.insert(Statement("INSERT INTO notes (text) VALUES (?)", ["a"]))


def test_transaction_asks_and_gives_back(database, turns):
    with database.transaction():
        insert_note(database)
        assert turns.steps == ["take"]
    assert turns.steps == ["take", "give back"]


def test_failed_transaction_gives_back(database, turns):
    with pytest.raises(FailedBody), database.transaction():
        insert_note(database)
        raise FailedBody
    assert turns.steps == ["take", "give back"]


def test_update_outside_transaction_asks_once_per_statement(database, turns):
    insert_note(database)
    turns.steps.clear()
    database.update(Statement("UPDATE notes SET text = ?", ["b"]))
    database.update(Statement("UPDATE notes SET text = ?", ["c"]))
    assert turns.steps == ["take", "give back", "take", "give back"]


def test_insert_outside_transaction_asks(database, turns):
    insert_note(database)
    assert turns.steps == ["take", "give back"]


def test_read_never_asks(database, turns):
    database.rows(Statement("SELECT count(*) FROM notes"))
    with database.consistent_read():
        database.rows(Statement("SELECT count(*) FROM notes"))
    assert turns.steps == []


def test_savepoint_inside_transaction_does_not_ask(database, turns):
    with database.transaction(), database.savepoint("inner"):
        insert_note(database)
    assert turns.steps == ["take", "give back"]


def test_nested_ask_in_same_thread_passes(turns):
    with turns.write_turn(), turns.write_turn():
        assert turns.steps == ["take"]
    assert turns.steps == ["take", "give back"]


def test_another_thread_asks_for_its_own_turn(turns):
    def ask() -> None:
        with turns.write_turn():
            pass

    with turns.write_turn():
        second_writer = threading.Thread(target=ask)
        second_writer.start()
        second_writer.join()
    assert turns.steps.count("take") == 2


def test_never_waiting_turns_never_block():
    turns = NeverWaitingWriteTurns()
    with turns.write_turn(), turns.write_turn():
        pass
    assert turns.depth.count == 0
