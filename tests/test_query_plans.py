from pathlib import Path

from journal.app import App
from journal.config import Config
from journal.db.connection import Connection
from journal.models.entry import Entry
from journal.references import events
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.repositories.messages import Messages
from journal.repositories.scope import Scope
from journal.repositories.tasks import Tasks
from journal.support.actor import Actor


def planned_reads(app: App, read) -> list[list[str]]:
    connection, statements, main = app.container.get(Connection), [], app.container.get(Environments).lookup("main").row_id
    raw = connection._local()
    connection.cache.cleared()
    raw.set_trace_callback(statements.append)
    with app.container.get(Scope).environment(main):
        read()
    raw.set_trace_callback(None)
    selects = [sql for sql in dict.fromkeys(statements) if sql.lstrip().upper().startswith("SELECT")]
    return [[row[3] for row in raw.execute(f"EXPLAIN QUERY PLAN {sql}").fetchall()] for sql in selects]


def is_slow(step: str) -> bool:
    return step.startswith("SCAN ") and " USING " not in step or "TEMP B-TREE" in step


def test_docked_cards_and_scoped_reads_use_indexes_and_sort_nothing(tmp_path: Path):
    app = App(Config(tmp_path, port=0))
    messages, tasks = app.container.get(Messages), app.container.get(Tasks)
    docked = planned_reads(app, lambda: messages.docked_cards(messages.main_chat()))
    assert any("messages_docked" in step for plan in docked for step in plan), f"the docked cards are read through their index: {docked}"
    scoped = planned_reads(app, lambda: tasks.unfinished_count())
    assert not [step for plan in docked + scoped for step in plan if is_slow(step)], f"no read scans a table or sorts: {docked + scoped}"


def test_session_entries_are_found_behind_newer_entries_of_other_sessions(tmp_path: Path):
    app = App(Config(tmp_path, port=0))
    entries, main = app.container.get(Entries), app.container.get(Environments).lookup("main").row_id
    with app.container.get(Scope).environment(main):
        older = entries.save(Entry(environment_id=main, entry_type=events.PROMPT_SUBMITTED, actor=Actor.agent("s1"), data={"prompt": "go on"}), Actor.system())
        for n in range(60):
            entries.save(Entry(environment_id=main, entry_type=events.PROMPT_SUBMITTED, actor=Actor.agent("s2"), data={"prompt": f"turn {n}"}), Actor.system())
        assert [entry.row_id for entry in entries.session_kind_entries(events.PROMPT_SUBMITTED, "s1")] == [older.row_id], "the session's own prompt is found behind sixty newer ones of another session"
        assert [entry.row_id for entry in entries.session_moves((events.PROMPT_SUBMITTED,), "s1")] == [older.row_id], "and so is its move"
