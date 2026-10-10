import pickle

from controllers import stored
from controllers.types import Reminders, Todos
from engine.version import version
from features.kept_rows.snapshot import read, snapshot_file, write
from resources.base import SYSTEM
from resources.types import Todo
from tests.conftest import fresh
from tests.kit import counted


def held(record):
    """A todo and a reminder read into memory, as a server that has been up for a while holds them."""
    todo = Todos(record, actor=SYSTEM).create("kept")
    reminder = Reminders(record, actor=SYSTEM).create("also kept")
    Todos(record, actor=SYSTEM).rows.peek(todo.n)
    Reminders(record, actor=SYSTEM).rows.peek(reminder.n)
    return todo.n, reminder.n


def parsed_after_restart(record, todo: int, reminder: int) -> list:
    with counted() as work:
        Todos(record, actor=SYSTEM).rows.peek(todo)
        Reminders(record, actor=SYSTEM).rows.peek(reminder)
    return sorted(kind for kind, _ in work.parsed)


def test_rows_held_when_the_server_stops_are_held_again_when_the_next_one_starts():
    record = fresh()
    todo, reminder = held(record)
    write(record.root)
    stored.forget_held()
    assert read(record.root, "") >= 2, "the rows come back from the snapshot"
    assert parsed_after_restart(record, todo, reminder) == [], "a kept row whose file did not change is not parsed again"
    assert not snapshot_file(record.root).exists(), "a snapshot is read once, so a server that dies without writing one never starts from an old one"


def test_a_type_whose_version_changed_is_read_again_and_the_others_are_kept(monkeypatch):
    record = fresh()
    todo, reminder = held(record)
    write(record.root)
    stored.forget_held()
    monkeypatch.setattr(Todo, "version", Todo.version + 1)
    read(record.root, "")
    assert parsed_after_restart(record, todo, reminder) == ["todo"], "only the type with a new version is parsed again"


def test_a_row_changed_while_the_server_was_down_is_read_again():
    record = fresh()
    todo, reminder = held(record)
    write(record.root)
    stored.forget_held()
    Todos(record, actor=SYSTEM).rows.write_file(Todos(record, actor=SYSTEM).rows.reparsed(todo))
    read(record.root, "")
    assert parsed_after_restart(record, todo, reminder) == ["todo"], "a row's file decides, whatever the snapshot held"


def test_a_release_asks_for_a_full_restart_in_its_changelog_entry():
    record = fresh()
    todo, reminder = held(record)
    asks = "## 99.0.0 — Everything reads again\n- It does.\n<!-- full-restart -->\n\n## 98.0.0 — Before\n- Nothing.\n"
    quiet = "## 99.0.0 — Nothing special\n- It runs.\n\n## 98.0.0 — Before\n- Nothing.\n"
    older = "## 0.0.1 — Long ago\n- It asked once.\n<!-- full-restart -->\n"
    outcomes = []
    for changes in (asks, quiet, older):
        write(record.root)
        stored.forget_held()
        outcomes.append((read(record.root, changes) > 0, parsed_after_restart(record, todo, reminder)))
        stored.forget_held()
    assert outcomes == [(False, ["reminder", "todo"]), (True, []), (True, [])], \
        f"a newer release that asks drops every kept row; one that does not ask, or one older than the build that wrote the snapshot ({version()}), drops none"


def test_a_kept_row_that_will_not_read_back_is_dropped_and_read_from_its_file():
    record = fresh()
    todo, reminder = held(record)
    write(record.root)
    kept = pickle.loads(snapshot_file(record.root).read_bytes())
    for folder, (was, rows) in kept["folders"].items():
        if folder.endswith("/todo"):
            kept["folders"][folder] = (was, [(key, stamp, b"not a pickle") for key, stamp, _ in rows])
    snapshot_file(record.root).write_bytes(pickle.dumps(kept))
    stored.forget_held()
    read(record.root, "")
    assert parsed_after_restart(record, todo, reminder) == ["todo"], "the row that would not read back is parsed from its file and the call goes on"
    snapshot_file(record.root).write_bytes(b"not a snapshot")
    assert read(record.root, "") == 0, "a snapshot that is not one is dropped, and the server starts with nothing held"
    assert not snapshot_file(record.root).exists()
