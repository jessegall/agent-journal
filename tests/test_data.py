from datetime import datetime, timezone
from journal.config import Config
from journal.support.masks import Masks
from journal.support.secret_values import SecretValues
"""Phase one: a task is created, linked, updated and deleted in a real database, and every model event is heard with its actor."""

import json
import threading

import pytest

from journal.db.query import Query
from journal.db.unknown_column import UnknownColumn
from journal.events.models.created import Created
from journal.events.models.creating import Creating
from journal.events.models.deleted import Deleted
from journal.events.models.model_event import ModelEvent
from journal.events.models.saved import Saved
from journal.events.models.saving import Saving
from journal.events.models.updated import Updated
from journal.events.models.updating import Updating
from journal.events.listener import Listener
from journal.features.listeners.unlink_deleted import UnlinkDeleted
from journal.support.rejection import Rejection
from journal.support.actor import Actor
from journal.models.entry import Entry
from journal.models.link import Link
from journal.models.support.ref import Ref
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.links import Links
from journal.repositories.environment_owners import EnvironmentOwners
from journal.repositories.users import Users
from journal.support.missing_row import MissingRow
from journal.repositories.checks import Checks
from journal.repositories.questions import Questions
from journal.repositories.tasks import Tasks
from journal.support.scope_missing import ScopeMissing

USER = Actor.user(1)
AGENT = Actor.agent("abc")


class Heard(Listener[ModelEvent]):
    def __init__(self):
        self.events = []

    def handle(self, event):
        self.events.append(event)


def tasks_of(connection, bus, scope) -> Tasks:
    return Tasks(connection, bus, scope, Links(connection, bus), Questions(connection, bus, scope), Checks(connection, bus))


class SayNo(Listener[Creating]):
    def handle(self, event):
        raise Rejection("not today")


def test_a_saved_task_gets_an_id_and_the_actor_stamp(connection, bus, scope):
    tasks = tasks_of(connection, bus, scope)
    task = tasks.save(Task(environment_id=1, title="write the release notes"), actor=USER)
    assert task.id == 1
    assert task.creator == USER and task.updater == USER
    assert task.created_at is not None
    assert tasks.find(1) == task


def test_every_model_event_is_heard_in_order_with_its_actor(connection, bus, scope):
    heard = Heard()
    bus.listen(ModelEvent, heard)
    tasks = tasks_of(connection, bus, scope)
    task = tasks.save(Task(environment_id=1, title="t"), actor=USER)
    tasks.save(task.with_(state=TaskState.STARTED), actor=AGENT)
    tasks.delete(task, actor=USER)
    kinds = [type(e).__name__ for e in heard.events]
    assert kinds == ["Saving", "Creating", "Created", "Saved", "Saving", "Updating", "Updated", "Saved", "Deleting", "Deleted"]
    assert heard.events[5].actor == AGENT and heard.events[5].model.state == TaskState.STARTED
    with pytest.raises(MissingRow):
        tasks.find(task.id)


def test_a_refusing_listener_stops_the_write(connection, bus, scope):
    bus.listen(Creating, SayNo())
    tasks = tasks_of(connection, bus, scope)
    with pytest.raises(Rejection):
        tasks.save(Task(environment_id=1, title="t"), actor=USER)
    with scope.environment(1):
        assert tasks.all() == []


def test_links_join_any_two_rows_and_leave_with_a_deleted_row(connection, bus, scope):
    tasks, links = tasks_of(connection, bus, scope), Links(connection, bus)
    bus.listen(Deleted, UnlinkDeleted(links))
    item = tasks.save(Task(environment_id=1, title="a"), actor=USER)
    b = tasks.save(Task(environment_id=1, title="b"), actor=USER)
    links.save(Link(source=Ref.build(item), target=Ref.build(b), kind="blocks"), actor=AGENT)
    assert links.targets(item, "blocks") == [Ref.build(b)]
    assert links.all_sources(b) == [Ref.build(item)]
    assert len(links.connecting(item, b)) == 1
    tasks.delete(b, actor=USER)
    assert links.link_rows(item) == []


def test_where_reads_typed_values_back(connection, bus, scope):
    tasks = tasks_of(connection, bus, scope)
    tasks.save(Task(environment_id=1, title="open"), actor=USER)
    started = tasks.save(Task(environment_id=1, title="started", state=TaskState.STARTED), actor=USER)
    with scope.environment(1):
        assert tasks.with_state(TaskState.STARTED) == [started]
    with scope.environment(2):
        assert tasks.scoped() == [] and tasks.matching(title="open") == [] and tasks.search(["open"]) == [] and tasks.count() == 0, "every read is the scope's, whatever it asks"
    with pytest.raises(ScopeMissing):
        tasks.matching(title="open")
    assert [t.title for t in tasks.global_matching(title="open")] == ["open"], "a read across environments says so by its name"


def test_writes_from_many_threads_all_land(connection, bus, scope):
    tasks = tasks_of(connection, bus, scope)

    def write(n):
        tasks.save(Task(environment_id=1, title=f"t{n}"), actor=USER)

    threads = [threading.Thread(target=write, args=(n,)) for n in range(20)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    with scope.environment(1):
        assert len(tasks.all()) == 20


def test_a_column_a_model_gained_is_added_to_a_table_made_before_it(tmp_path):
    from journal.db.connection import Connection
    from journal.db.schema import Schema
    from journal.models.all_models import AllModels
    old = Connection(tmp_path / "old.db", Masks(SecretValues(Config(tmp_path))))
    with old.transaction() as db:
        db.execute("CREATE TABLE messages (id INTEGER PRIMARY KEY AUTOINCREMENT, environment_id INTEGER)")
    Schema(old, AllModels.MODELS).create()
    names = {row["name"] for row in old.execute("PRAGMA table_info(messages)").fetchall()}
    assert "idempotency" in names and "text" in names


def test_a_thread_returns_its_connection_to_the_pool(connection):
    import threading
    def work():
        connection.all("SELECT 1")
        connection.release()
    for _ in range(30):
        t = threading.Thread(target=work)
        t.start()
        t.join()
    assert len(connection._open) <= 2


def test_a_row_older_than_a_column_loads_with_the_fields_default(tmp_path):
    from journal.db.connection import Connection
    from journal.db.schema import Schema
    from journal.events.bus import Bus
    from journal.models.all_models import AllModels
    from journal.repositories.messages import Messages
    from journal.repositories.reactions import Reactions
    from journal.repositories.links import Links
    from journal.repositories.environments import Environments
    from journal.repositories.scope import Scope
    old = Connection(tmp_path / "old.db", Masks(SecretValues(Config(tmp_path))))
    with old.transaction() as db:
        db.execute("CREATE TABLE messages (id INTEGER PRIMARY KEY AUTOINCREMENT, environment_id INTEGER, author TEXT, text TEXT, created_at TEXT, updated_at TEXT, creator TEXT, updater TEXT)")
        db.execute("INSERT INTO messages (environment_id, author, text, created_at, updated_at, creator, updater) VALUES (1, 'user', 'old', '2026-01-01T00:00:00+00:00', '2026-01-01T00:00:00+00:00', 'user:1', 'user:1')")
    Schema(old, AllModels.MODELS).create()
    bus = Bus()
    scope = Scope(Environments(old, bus))
    message = Messages(old, bus, scope, Reactions(old, bus, scope, Links(old, bus)), Links(old, bus), EnvironmentOwners(Links(old, bus), Users(old, bus), Environments(old, bus))).find(1)
    assert message.files == () and message.acknowledgement is False and message.idempotency == "" and message.read_at is None


def test_a_title_is_one_line_of_eighty_characters_without_a_colon_and_an_old_one_is_left_alone(connection, bus, scope):
    from journal.support.actor import Actor
    from journal.models.task import Task
    from journal.support.rejection import Rejection
    from journal.repositories.tasks import Tasks
    tasks = tasks_of(connection, bus, scope)
    with pytest.raises(Rejection, match="at most 80 characters"):
        tasks.save(Task(environment_id=1, title="x" * 81), Actor.system())
    with pytest.raises(Rejection, match="no colon"):
        tasks.save(Task(environment_id=1, title="Titles: the rule"), Actor.system())
    short = tasks.save(Task(environment_id=1, title="The title rule", brief="x" * 500), Actor.system())
    assert tasks.save(short.with_(brief="changed"), Actor.system()).brief == "changed", "a row saved again with the title it had is left alone"


def test_a_row_answers_its_heading_its_summary_and_its_dock_card():
    from journal.models.doc import Doc
    from journal.models.fact import Fact
    from journal.models.plan import Plan
    from journal.models.report import Report
    from journal.models.support.dock_card import DockCard
    from journal.models.support.row_card import RowCard
    report = Report(id=33, title="What the dock showed", abstract="One line about it", body="## First\n\ntext")
    assert report.heading() == "Report 33: What the dock showed" and report.summary_line() == "One line about it"
    assert Doc(id=3, title="Notes", body="# Notes\n\nThe first line.\nThe second.").summary_line() == "The first line."
    task = Task(id=12, title="Write it", brief="First line of the brief\nmore")
    assert task.heading() == "Task 12: Write it" and task.summary_line() == "First line of the brief"
    assert Fact(id=2, text="Ports are fixed").heading() == "Fact 2" and Fact(id=2).summary_line() == ""
    assert task.docked() == DockCard.plain() and [b.label for b in DockCard.plain().buttons] == ["Open", "Close"]
    assert [(b.label, b.act) for b in Plan(id=1).docked().buttons] == [("Open plan", "open"), ("Approve", "approve"), ("Close", "close")]
    assert RowCard.build(report).as_data() == {"row": "reports:33", "heading": "Report 33: What the dock showed", "summary": "One line about it", "dock": {"buttons": [{"label": "Open", "act": "open"}, {"label": "Close", "act": "close"}], "folds": True}}, "a card carries no file: a document is downloaded from where it is read"


def test_the_time_keys_migration_renames_at_in_the_column_and_the_stored_json(connection):
    """Migration 20: the edits column at becomes time, and the at key inside an entry's data, a check's progress and a dump's question and answers becomes time; a record without them is left as it is."""
    from journal.db.migrations.time_keys import TimeKeys
    connection.execute("ALTER TABLE edits RENAME COLUMN time TO at")
    for table, now, then in (("checks", "progress", "running"), ("dumps", "choice", "chosen"), ("dumps", "claimed", "taken")):
        connection.execute(f"ALTER TABLE {table} RENAME COLUMN {now} TO {then}")
    connection.execute("INSERT INTO entries (environment_id, kind, actor, data, created_at, creator) VALUES (1, 'nudge', 'system', ?, '2026-10-21', 'system')", (json.dumps({"key": "k", "at": 5.0}),))
    connection.execute("INSERT INTO entries (environment_id, kind, actor, data, created_at, creator) VALUES (1, 'ran', 'system', ?, '2026-10-21', 'system')", (json.dumps({"command": "ls"}),))
    connection.execute("INSERT INTO checks (title, running, created_at, creator) VALUES ('c', ?, '2026-10-21', 'system')", (json.dumps({"at": 7.0, "output": ""}),))
    connection.execute("INSERT INTO dumps (environment_id, question, answers, chosen, taken, created_at, creator) VALUES (1, ?, ?, '{}', '{}', '2026-10-21', 'system')", (json.dumps({"at": 1.0, "text": "q"}), json.dumps([{"question": "q", "answer": "a", "at": 2.0}])))
    TimeKeys().apply(connection)
    assert "time" in {row["name"] for row in connection.all("PRAGMA table_info(edits)")} and "at" not in {row["name"] for row in connection.all("PRAGMA table_info(edits)")}
    nudge, completed = [json.loads(row["data"]) for row in connection.all("SELECT data FROM entries ORDER BY id")]
    assert nudge == {"key": "k", "time": 5.0} and completed == {"command": "ls"}, "the key moves where it is, and a row without it is untouched"
    assert json.loads(connection.one("SELECT running FROM checks")["running"]) == {"time": 7.0, "output": ""}
    dump = connection.one("SELECT question, answers FROM dumps")
    assert json.loads(dump["question"]) == {"time": 1.0, "text": "q"} and json.loads(dump["answers"]) == [{"question": "q", "answer": "a", "time": 2.0}]
    connection.execute("ALTER TABLE edits ADD COLUMN at REAL DEFAULT 0")
    connection.execute("INSERT INTO edits (environment_id, session, path, at, time, created_at, creator) VALUES (1, 's', 'a.py', 9.0, 0, '2026-10-21', 'system')")
    TimeKeys().apply(connection)
    names = {row["name"] for row in connection.all("PRAGMA table_info(edits)")}
    assert "at" not in names and connection.one("SELECT time FROM edits")["time"] == 9.0, "where the schema already added the time column, the old at column's values move into it and the column goes"


def test_the_trigger_phrases_migration_renames_the_words_column(connection):
    """Migration 21: a trigger's words column becomes phrases, carried over when the schema already added phrases."""
    from journal.db.migrations.trigger_phrases import TriggerPhrases
    connection.execute("ALTER TABLE triggers ADD COLUMN words TEXT DEFAULT '[]'")
    connection.execute("INSERT INTO triggers (phrases, words, action, text, created_at, creator) VALUES ('[]', '[\"deploy\"]', 'deny', 'no', '2026-10-21', 'system')")
    TriggerPhrases().apply(connection)
    names = {row["name"] for row in connection.all("PRAGMA table_info(triggers)")}
    assert "words" not in names and connection.one("SELECT phrases FROM triggers")["phrases"] == '["deploy"]'
    connection.execute("ALTER TABLE triggers RENAME COLUMN phrases TO words")
    TriggerPhrases().apply(connection)
    assert "phrases" in {row["name"] for row in connection.all("PRAGMA table_info(triggers)")}, "a record from before, with words alone, has the column renamed"


def test_no_dataclass_field_shadows_a_property_or_method_of_its_class_or_a_parent():
    """A frozen dataclass whose field is named like a property or a method on it, its own or inherited, cannot be built: the generated __init__ sets the field and the property has no setter. Every dataclass under the package is checked, so a rename can never leave such a pair behind."""
    import dataclasses
    import importlib
    import inspect
    import pkgutil
    import journal
    clashes = []
    for matched in pkgutil.walk_packages(journal.__path__, "journal."):
        module = importlib.import_module(matched.name)
        for name, cls in inspect.getmembers(module, inspect.isclass):
            if cls.__module__ != matched.name or not dataclasses.is_dataclass(cls):
                continue
            for field in dataclasses.fields(cls):
                for owner in cls.__mro__:
                    attribute = owner.__dict__.get(field.name)
                    if isinstance(attribute, property) or inspect.isfunction(attribute):
                        clashes.append(f"{cls.__module__}.{cls.__name__}.{field.name} shadows {owner.__name__}.{field.name}")
    assert clashes == [], "\n".join(clashes)


def test_the_dashboard_sections_migration_renames_the_heading_column(connection):
    """Migration 22: a dashboard line's heading column becomes section, carried over when the schema already added section."""
    from journal.db.migrations.dashboard_sections import DashboardSections
    connection.execute("ALTER TABLE dashboard_rows ADD COLUMN heading TEXT DEFAULT ''")
    connection.execute("INSERT INTO dashboard_rows (plugin, key, label, heading, section, created_at, creator) VALUES ('p', 'k', 'l', 'Totals', '', '2026-10-21', 'system')")
    DashboardSections().apply(connection)
    names = {row["name"] for row in connection.all("PRAGMA table_info(dashboard_rows)")}
    assert "heading" not in names and connection.one("SELECT section FROM dashboard_rows")["section"] == "Totals"


def test_the_chart_drop_keeps_only_workflows_a_user_or_an_agent_wrote_as_documents(connection):
    from journal.db.migrations.chart_drop import ChartDrop
    with connection.transaction() as db:
        db.execute("ALTER TABLE docs RENAME COLUMN creator TO created_by")
        db.execute("ALTER TABLE docs RENAME COLUMN updater TO updated_by")
        db.execute("CREATE TABLE charts (id INTEGER PRIMARY KEY, created_at TEXT, created_by TEXT, updated_at TEXT, updated_by TEXT, title TEXT, revision INTEGER, shipped INTEGER, event TEXT, state TEXT, places TEXT, drawing TEXT, drawn_version INTEGER, locked INTEGER)")
        db.execute("CREATE TABLE nodes (id INTEGER PRIMARY KEY, kind TEXT, key TEXT, text TEXT)")
        db.execute("CREATE TABLE counts (id INTEGER PRIMARY KEY)")
        db.execute("CREATE TABLE noted_times (id INTEGER PRIMARY KEY)")
        rows = [("Hold the stop while a task is parked", 5, 1, "system"), ("Remind to commit after twenty writes", 2, 1, "user:1"), ("Ask about an open question after ten quiet minutes", 0, 0, "agent:s1")]
        for title, revision, shipped, editor in rows:
            db.execute("INSERT INTO charts (created_at, created_by, updated_at, updated_by, title, revision, shipped, event, state, places, drawing, drawn_version, locked) VALUES ('t', 'system', 't', ?, ?, ?, ?, 'idle', 'idle', '', '', 30, 0)", (editor, title, revision, shipped))
    ChartDrop().apply(connection)
    titles = [row["title"] for row in connection.all("SELECT title FROM docs WHERE title LIKE 'Workflow: %' ORDER BY id")]
    assert titles == ["Workflow: Remind to commit after twenty writes", "Workflow: Ask about an open question after ten quiet minutes"], "a shipped workflow re-drawn by an upgrade is the journal's, however many revisions it counts; one a user or an agent last wrote is kept"
    assert connection.one("SELECT name FROM sqlite_master WHERE name = 'charts'") is None, "the chart's tables are gone"


def test_the_timestamp_renames_migration_moves_the_phone_codes_and_the_wait_times_to_their_at_names(connection):
    """Migration 26: the pairing codes table becomes phone_codes with expires_at, and a wait stored on an agent's row keeps its started and reminded times under their _at names."""
    from journal.db.migrations.timestamp_renames import TimestampRenames
    connection.execute("ALTER TABLE phone_codes RENAME COLUMN expires_at TO expiry_time")
    connection.execute("ALTER TABLE phone_codes RENAME TO pairing_codes")
    wait = {"state": "awaiting", "data": {"focus": "ci", "start_time": 5.0, "reminder_time": 9.0}}
    connection.execute("INSERT INTO agents (environment_id, session, state, data, stack, created_at, creator) VALUES (1, 's', 'awaiting', ?, ?, '2026-10-21', 'system')", (json.dumps(wait["data"]), json.dumps([{"state": "idle", "data": {}}, wait])))
    TimestampRenames().apply(connection)
    assert "expires_at" in {row["name"] for row in connection.all("PRAGMA table_info(phone_codes)")}
    row = connection.one("SELECT data, stack FROM agents WHERE session = 's'")
    assert json.loads(row["data"]) == {"focus": "ci", "started_at": 5.0, "reminded_at": 9.0} and json.loads(row["stack"])[-1]["data"]["started_at"] == 5.0


def test_the_worker_reuse_counts_migration_reads_each_reuse_from_the_reports_before_it(connection):
    """Migration 30: an old worker row's reuse count comes from its report links, the last report followed by a send when it is out again; the reason it was retired starts empty."""
    from journal.db.migrations.worker_reuse_counts import WorkerReuseCounts
    for n, state in ((1, "reported"), (2, "dispatched"), (3, "dispatched")):
        connection.execute("INSERT INTO workers (environment_id, name, state, created_at, creator) VALUES (1, ?, ?, '2026-10-21', 'system')", (f"w{n}", state))
    for worker, reports in ((1, 3), (2, 2)):
        for message in range(reports):
            connection.execute("INSERT INTO links (source, target, kind, created_at, creator) VALUES (?, ?, 'reported', '2026-10-21', 'system')", (f"workers:{worker}", f"messages:{worker * 10 + message}"))
    connection.execute("UPDATE workers SET reuse_count = NULL, retire_reason = NULL")
    WorkerReuseCounts().apply(connection)
    counts = [(row["name"], row["reuse_count"]) for row in connection.all("SELECT name, reuse_count FROM workers ORDER BY id")]
    assert counts == [("w1", 2), ("w2", 2), ("w3", 0)], "three reports and back is two sends; two reports and out again is two; out on its first job is none"


def test_the_message_agents_migration_moves_the_session_into_its_column_and_puts_every_message_in_the_main_chat(connection):
    """Migration 34: a peer message's session leaves its data for the session column, an agent's own message takes its writer's session, a user's has none, and all of them are the main agent's."""
    from journal.db.migrations.message_agents import MessageAgents
    for creator, data in (("system", {"kind": "peer", "session": "s1", "peer": "other"}), ("agent:s2", {}), ("user:1", {}), ("system", {"session": ""})):
        connection.execute("INSERT INTO messages (environment_id, author, text, data, created_at, creator) VALUES (1, 'agent', 'x', ?, '2026-10-22', ?)", (json.dumps(data), creator))
    connection.execute("UPDATE messages SET session = NULL, agent_role = NULL")
    MessageAgents().apply(connection)
    rows = [(row["session"], row["agent_role"], json.loads(row["data"])) for row in connection.all("SELECT session, agent_role, data FROM messages ORDER BY id")]
    assert rows == [("s1", "main", {"kind": "peer", "peer": "other"}), ("s2", "main", {}), (None, "main", {}), (None, "main", {})]


def test_a_query_renders_every_read_shape_with_its_values_bound():
    tasks, entries = Query.build(Task), Query.build(Entry)
    assert tasks.filter(state=TaskState.OPEN, creator=None).order_descending("id").limit(5).select() == ("SELECT * FROM tasks WHERE state = ? AND creator IS NULL ORDER BY id DESC LIMIT ? OFFSET ?", ("open", 5, 0)), "a value is turned by its column, and None reads as null"
    assert tasks.filter_listed("id", (1, 2)).filter_unlisted("state", (TaskState.FINISHED,)).filter_present("block_reason").select() == ("SELECT * FROM tasks WHERE id IN (?, ?) AND state NOT IN (?) AND block_reason IS NOT NULL", (1, 2, TaskState.FINISHED.value))
    assert tasks.filter_greater("id", 1).filter_less("id", 9).filter_greater_equal("id", 2).filter_less_equal("id", 8).filter_unequal("title", "x").select()[0] == "SELECT * FROM tasks WHERE id > ? AND id < ? AND id >= ? AND id <= ? AND title IS NOT ?"
    assert tasks.filter_prefix("title", "a").filter_missing_prefix("creator", "user:").select() == ("SELECT * FROM tasks WHERE title >= ? AND title < ? AND (creator IS NULL OR creator < ? OR creator >= ?)", ("a", "a\uffff", "user:", "user:\uffff"))
    assert tasks.filter_containing("title", "50%_off").order("state").order_descending("id").offset(3).select() == ("SELECT * FROM tasks WHERE title LIKE ? ESCAPE '\\' ORDER BY state, id DESC LIMIT ? OFFSET ?", ("%50\\%\\_off%", -1, 3))
    assert entries.filter_json("data->session", "s").filter_listed("data->call->kind", ("a",)).maximum("data->time", 0) == ("SELECT COALESCE(MAX(json_extract(data, '$.time')), 0) AS value FROM entries WHERE json_extract(data, '$.session') = ? AND json_extract(data, '$.call.kind') IN (?)", ("s", "a"))
    assert tasks.filter_alternatives(tasks.filter(title="a"), tasks.filter(title="b").filter_null("block_reason")).count() == ("SELECT count(*) AS value FROM tasks WHERE (title = ? OR (title = ? AND block_reason IS NULL))", ("a", "b"))
    assert entries.filter(kind="ToolStarting").order_descending("id").limit(9).repeated("data->call->command", 2) == ("SELECT value FROM (SELECT json_extract(data, '$.call.command') AS value FROM entries WHERE kind = ? ORDER BY id DESC LIMIT ? OFFSET ?) WHERE value != '' GROUP BY value HAVING COUNT(*) >= ?", ("ToolStarting", 9, 0, 2)), "the values a page of rows holds at least so many times"
    assert tasks.filter_absent(Query.build(Link).filter(kind="in_plan").filter_ref("source", tasks)).count() == ("SELECT count(*) AS value FROM tasks WHERE NOT EXISTS (SELECT 1 FROM links WHERE kind = ? AND links.source = ? || tasks.id)", ("in_plan", "tasks:"))


def test_a_query_renders_its_writes_and_writes_a_condition_into_its_text():
    tasks = Query.build(Task)
    assert tasks.insert(title="a", state=TaskState.OPEN) == ("INSERT INTO tasks (title, state) VALUES (?, ?)", ("a", "open"))
    assert tasks.filter(id=3).update(title="b", creator=USER) == ("UPDATE tasks SET title = ?, creator = ? WHERE id = ?", ("b", USER.stamp, 3))
    assert tasks.filter(id=3).delete() == ("DELETE FROM tasks WHERE id = ?", (3,)) and tasks.delete() == ("DELETE FROM tasks", ())
    inlined = tasks.filter_listed("title", ("it's", "b")).inlined().filter(id=1)
    assert inlined.clause() == "title IN ('it''s', 'b') AND id = ?" and inlined.select()[1] == (1,), "an inlined condition holds its values in the text, as a partial index's terms must, and what follows is bound"


def test_a_query_fails_on_a_column_its_table_does_not_have():
    with pytest.raises(UnknownColumn):
        Query.build(Task).filter(titel="a")
    with pytest.raises(UnknownColumn):
        Query.build(Task).order("nope")
    with pytest.raises(UnknownColumn):
        Query.build(Entry).filter_json("data->it's", 1)


def test_a_line_said_before_lines_carried_the_tool_use_gains_it_and_its_moment(tmp_path):
    """A nudge entry written by an older journal, with no tool use, is given one at the migration, so a read of the last line of a kind never fails."""
    import json
    import sqlite3
    from journal.app import App
    from journal.config import Config
    first = App(Config(tmp_path, port=0))
    first.runtime().start()
    first.runtime().stop()
    db = sqlite3.connect(first.config.database)
    db.execute("INSERT INTO entries (environment_id, kind, actor, data, created_at, creator, updated_at, updater) VALUES (1, 'nudge', 'system', ?, '2026-10-01T10:00:00+00:00', 'system', '2026-10-01T10:00:00+00:00', 'system')", (json.dumps({"key": "shell.outputs_ended", "session": "s1", "line": "output 1 finished"}),))
    db.execute("DELETE FROM migrations WHERE number >= 37")
    db.commit()
    db.close()
    second = App(Config(tmp_path, port=0))
    second.runtime().start()
    second.runtime().stop()
    db = sqlite3.connect(second.config.database)
    data = json.loads(db.execute("SELECT data FROM entries WHERE kind = 'nudge' AND json_extract(data, '$.line') = 'output 1 finished'").fetchone()[0])
    assert data["tool_use"] == 0 and data["time"] > 0, data


def test_the_tasks_repository_answers_which_tasks_are_open_blocked_parked_and_unclosed(connection, bus, scope):
    from journal.models.plan import Plan
    from journal.models.plan_state import PlanState
    from journal.repositories.scoped_repository import ScopedRepository
    from journal.repositories.tasks import PLAN_LINK

    class PlanRows(ScopedRepository[Plan]):
        model = Plan

    tasks, links = tasks_of(connection, bus, scope), Links(connection, bus)
    with scope.environment(1):
        free = tasks.save(Task(environment_id=1, title="free"), actor=USER)
        drafted = tasks.save(Task(environment_id=1, title="in a draft plan"), actor=USER)
        blocked = tasks.save(Task(environment_id=1, title="blocked", state=TaskState.BLOCKED), actor=USER)
        parked = tasks.save(Task(environment_id=1, title="parked", state=TaskState.SUSPENDED), actor=USER)
        done = tasks.save(Task(environment_id=1, title="done", state=TaskState.FINISHED), actor=USER)
        draft = PlanRows(connection, bus, scope).save(Plan(environment_id=1, title="p", state=PlanState.DRAFT), USER)
        links.save(Link(source=Ref.build(drafted), target=Ref.build(draft), kind=PLAN_LINK), actor=USER)
        assert [task.id for task in tasks.open_tasks()] == [free.id], "a task of an unapproved plan is no open work"
        assert [task.id for task in tasks.blocked_tasks()] == [blocked.id]
        assert [task.id for task in tasks.suspended_tasks()] == [parked.id]
        assert done.id not in [task.id for task in tasks.unclosed_tasks()] and free.id in [task.id for task in tasks.unclosed_tasks()]
        assert tasks.unfinished_ids([free.id, done.id]) == [free.id]


def test_each_model_says_whether_it_is_shared_with_the_team_or_kept_on_one_machine():
    from journal.models.all_models import AllModels
    local = sorted(model.__name__ for model in AllModels.MODELS if not model.shared)
    assert local == sorted(["Entry", "Agent", "Timing", "Statistic", "CommandOutput", "DashboardRow", "Secret", "Phone", "PhoneCode", "MigratedRow", "Version3Migration", "JournalVersion", "ReleaseMessage", "OutgoingChange", "IdBlock", "PendingUpload", "Plugin", "McpServer"]), "the models kept on one machine are the ones NOTES.md names"
    assert all(model.shared for model in AllModels.MODELS if model.__name__ in ("Task", "Message", "Alias", "Worker", "Setting")), "everything else is shared"


def test_each_write_to_a_shared_row_is_queued_for_the_team_once_joined_and_waiting_writes_to_a_row_merge(connection, bus, scope, tmp_path):
    from journal.config import Config
    from journal.events.models.model_event import ModelEvent
    from journal.models.release_message import ReleaseMessage
    from journal.repositories.outgoing_changes import OutgoingChanges
    from journal.repositories.release_messages import ReleaseMessages
    from journal.sync.record_outgoing_change import RecordOutgoingChange
    from journal.sync.team_account import TEAM_FILE, TeamAccount
    from journal.sync.commit_signal import CommitSignal

    config = Config(tmp_path)
    changes, tasks = OutgoingChanges(connection, bus), tasks_of(connection, bus, scope)
    bus.listen(ModelEvent, RecordOutgoingChange(changes, TeamAccount(config), team_scopes(connection, bus, scope), CommitSignal()))
    with scope.environment(1):
        before = tasks.save(Task(environment_id=1, title="before joining"), actor=USER)
        assert changes.waiting() == [], "a journal in no team queues nothing"
        config.home.mkdir(parents=True, exist_ok=True)
        (config.home / TEAM_FILE).write_text("{}")
        task = tasks.save(Task(environment_id=1, title="first"), actor=USER)
        task = tasks.save(task.with_(title="second"), actor=AGENT)
        task = tasks.save(task.with_(brief="a brief"), actor=USER)
        [created] = changes.waiting()
        assert (created.row_table, created.row, created.action) == ("tasks", task.id, "created")
        assert (created.fields["title"], created.fields["brief"], created.writer) == ("second", "a brief", USER.stamp), "a creation and its updates are one creation"
        assert set(created.changed_at) == set(created.fields)
        before = tasks.save(before.with_(title="renamed"), actor=USER)
        before = tasks.save(before.with_(brief="a second brief"), actor=USER)
        update = changes.waiting()[1]
        assert update.action == "updated" and set(update.fields) == {"title", "brief", "updated_at", "updater"}, "two updates are one, with only the columns they changed"
        tasks.delete(task, USER)
        assert [change.row for change in changes.waiting()] == [before.id], "a row created and deleted before sending sends nothing"
        changes.save(changes.waiting()[0].with_(is_sending=True), USER)
        tasks.save(before.with_(title="again"), actor=USER)
        assert [change.fields["title"] for change in changes.waiting()] == ["again"], "a change being sent is never merged into"
        tasks.delete(before, USER)
        assert changes.waiting()[0].action == "deleted" and changes.waiting()[0].fields == {}
        ReleaseMessages(connection, bus).save(ReleaseMessage(version="9.9.9", text="local"), USER)
        assert [change.row_table for change in changes.waiting()] == ["tasks"], "a model kept on one machine is never queued"


def test_a_new_shared_row_takes_its_number_from_the_machines_blocks_once_joined_and_from_sqlite_before(connection, bus, scope, tmp_path):
    from journal.config import Config
    from journal.events.models.number_request import NumberRequest
    from journal.models.release_message import ReleaseMessage
    from journal.repositories.id_blocks import IdBlocks
    from journal.repositories.release_messages import ReleaseMessages
    from journal.support.rejection import Rejection
    from journal.sync.block_numbers import BlockNumbers
    from journal.sync.team_account import TEAM_FILE, TeamAccount

    config, blocks, tasks = Config(tmp_path), IdBlocks(connection, bus), tasks_of(connection, bus, scope)
    bus.listen(NumberRequest, BlockNumbers(blocks, TeamAccount(config)))
    with scope.environment(1):
        assert [tasks.save(Task(environment_id=1, title=title), actor=USER).id for title in "ab"] == [1, 2], "a journal in no team numbers as before"
        config.home.mkdir(parents=True, exist_ok=True)
        (config.home / TEAM_FILE).write_text("{}")
        blocks.add("tasks", 1001, 1003)
        blocks.add("tasks", 2001, 2010)
        assert [tasks.save(Task(environment_id=1, title=str(n)), actor=USER).id for n in range(4)] == [1001, 1002, 1003, 2001], "past a block's end the next block numbers"
        assert blocks.is_wanted("tasks") and blocks.is_wanted("messages"), "nine numbers left of a block of ten wants another, and a table with no block wants one"
        blocks.add("tasks", 3001, 3010)
        assert not blocks.is_wanted("tasks"), "a block and a fifth of one left is enough"
        assert ReleaseMessages(connection, bus).save(ReleaseMessage(version="9.9.9"), USER).id == 1, "a model kept on one machine is numbered by SQLite"
        for _ in range(19):
            tasks.save(Task(environment_id=1, title="more"), actor=USER)
        with pytest.raises(Rejection):
            tasks.save(Task(environment_id=1, title="one too many"), actor=USER)


def team_scopes(connection, bus, scope):
    from journal.features.registry import Registry
    from journal.features.standard import Standard
    from journal.repositories.setting_rows import SettingRows
    from journal.sync.setting_scopes import SettingScopes

    return SettingScopes(Registry(Standard.FEATURES, SettingRows(connection, bus, scope)))


def team_journal(tmp_path, name: str, signal=None):
    from journal.config import Config
    from journal.db.connection import Connection
    from journal.db.schema import Schema
    from journal.events.bus import Bus
    from journal.events.models.model_event import ModelEvent
    from journal.events.models.purged import Purged
    from journal.models.all_models import AllModels
    from journal.repositories.environments import Environments
    from journal.repositories.outgoing_changes import OutgoingChanges
    from journal.repositories.scope import Scope
    from journal.repositories.shared_tables import SharedTables
    from journal.sync.incoming_changes import IncomingChanges
    from journal.sync.record_outgoing_change import RecordOutgoingChange
    from journal.sync.record_purge import RecordPurge
    from journal.sync.team_account import TEAM_FILE, TeamAccount
    from journal.features.listeners.unlink_deleted import UnlinkDeleted
    from journal.events.models.deleted import Deleted
    from journal.events.models.number_request import NumberRequest
    from journal.repositories.id_blocks import IdBlocks
    from journal.sync.block_numbers import BlockNumbers
    from journal.sync.commit_signal import CommitSignal

    folder = tmp_path / name
    config = Config(folder)
    config.home.mkdir(parents=True)
    (config.home / TEAM_FILE).write_text("{}")
    connection = Connection(folder / "journal.db", Masks(SecretValues(config)))
    Schema(connection, AllModels.MODELS).create()
    bus = Bus()
    scope = Scope(Environments(connection, bus))
    outgoing = OutgoingChanges(connection, bus)
    signal = signal or CommitSignal()
    bus.listen(ModelEvent, RecordOutgoingChange(outgoing, TeamAccount(config), team_scopes(connection, bus, scope), signal))
    bus.listen(Purged, RecordPurge(outgoing, TeamAccount(config), signal))
    blocks = IdBlocks(connection, bus)
    base = (ord(name[0]) - ord("a")) * 100_000
    for model in AllModels.MODELS:
        if model.shared:
            blocks.add(model.table(), base + 1, base + 99_999)
    bus.listen(NumberRequest, BlockNumbers(blocks, TeamAccount(config)))
    bus.listen(Deleted, UnlinkDeleted(Links(connection, bus)))
    return bus, scope, tasks_of(connection, bus, scope), outgoing, IncomingChanges(SharedTables(connection, bus), outgoing, Links(connection, bus))


def team_changes(outgoing):
    from journal.sync.team_change import TeamChange

    changes = outgoing.waiting()
    for change in changes:
        outgoing.delete(change, USER)
    return [TeamChange(row_table=change.row_table, row=change.row, action=change.action, writer=change.writer, fields=change.fields or {}) for change in changes]


def test_two_journals_exchange_their_changes_and_a_pulled_write_runs_no_listener_of_a_local_write(tmp_path):
    from journal.events.listener import Listener
    from journal.events.models.created import Created
    from journal.events.rows.task_opened import TaskOpened
    from journal.sync.team_change import TeamChange

    class Heard(Listener):
        def __init__(self) -> None:
            self.events = []

        def handle(self, event) -> None:
            self.events.append(event)

    bus_a, scope_a, tasks_a, outgoing_a, _ = team_journal(tmp_path, "a")
    bus_b, scope_b, tasks_b, outgoing_b, incoming_b = team_journal(tmp_path, "b")
    created, opened = Heard(), Heard()
    bus_b.listen(Created, created)
    bus_b.listen(TaskOpened, opened)
    with scope_a.environment(1):
        kept = tasks_a.save(Task(environment_id=1, title="kept"), actor=USER)
        gone = tasks_a.save(Task(environment_id=1, title="gone"), actor=USER)
    incoming_b.apply(team_changes(outgoing_a))
    with scope_b.environment(1):
        assert [(task.id, task.title) for task in tasks_b.rows()] == [(kept.id, "kept"), (gone.id, "gone")]
        assert len(opened.events) == 2 and created.events == [], "a pulled creation opens the task and runs no listener of a local creation"
        tasks_b.save(tasks_b.find(kept.id).with_(title="b's title"), actor=AGENT)
    with scope_a.environment(1):
        tasks_a.save(kept.with_(title="a's title", brief="a's brief"), actor=USER)
        tasks_a.delete(gone, USER)
    with scope_b.environment(1):
        tasks_b.save(tasks_b.find(gone.id).with_(brief="b's brief"), actor=AGENT)
    applied_from = datetime.now(timezone.utc)
    incoming_b.apply(team_changes(outgoing_a))
    with scope_b.environment(1):
        [task] = tasks_b.rows()
        assert (task.title, task.brief) == ("b's title", "a's brief"), "a field this machine still has to send is kept as this machine has it"
        assert task.updated_at >= applied_from, "a pulled row is dated when it was applied here, so the viewer's next poll finds it however old the edit"
        assert [change.row for change in outgoing_b.waiting()] == [kept.id], "a pulled deletion drops this machine's waiting change to the row"
    incoming_b.apply([TeamChange(row_table="tasks", row=kept.id, action="updated", writer=USER.stamp, fields={"column_from_a_newer_journal": 1})])


def test_a_wiped_environment_and_a_deleted_rows_links_reach_the_other_journal(tmp_path):
    from journal.models.environment import Environment
    from journal.repositories.environments import Environments

    _, scope_a, tasks_a, outgoing_a, _ = team_journal(tmp_path, "a")
    _, scope_b, tasks_b, _, incoming_b = team_journal(tmp_path, "b")
    environments_a, links_a, links_b = scope_a.environments, Links(tasks_a.connection, tasks_a.bus), Links(tasks_b.connection, tasks_b.bus)
    environments_a.save(Environment(name="main"), USER)
    second = environments_a.save(Environment(name="second"), USER)
    with scope_a.environment(1):
        first = tasks_a.save(Task(environment_id=1, title="first"), actor=USER)
        other = tasks_a.save(Task(environment_id=1, title="other"), actor=USER)
        links_a.save(Link(source=Ref.build(first), target=Ref.build(other), kind="follows"), actor=USER)
    with scope_a.environment(second.id):
        tasks_a.save(Task(environment_id=second.id, title="in the second"), actor=USER)
    incoming_b.apply(team_changes(outgoing_a))
    assert len(tasks_b.global_matching(environment_id=1)) == 2 and len(tasks_b.global_matching(environment_id=second.id)) == 1 and len(links_b.rows()) == 1
    with scope_a.environment(1):
        tasks_a.delete(first, USER)
    environments_a.wipe(second, USER)
    incoming_b.apply(team_changes(outgoing_a))
    assert [task.title for task in tasks_b.global_matching(environment_id=1)] == ["other"] and tasks_b.global_matching(environment_id=second.id) == [] and links_b.rows() == [], "the deleted task's links and the wiped environment's rows are gone on the other journal too"
    assert [environment.name for environment in Environments(tasks_b.connection, tasks_b.bus).rows()] == [environment.name for environment in environments_a.rows()]


def test_a_shipped_template_is_written_once_for_the_team_by_the_machine_that_holds_the_upgrade(tmp_path):
    import json
    from journal.config import Config
    from journal.features.templates.seeds.builtin_templates import BuiltinTemplates
    from journal.features.templates.shipped import SHIPPED
    from journal.repositories.templates import Templates
    from journal.sync.team_account import TEAM_FILE, TeamAccount

    _, _, tasks_a, outgoing_a, _ = team_journal(tmp_path, "a")
    _, _, tasks_b, _, incoming_b = team_journal(tmp_path, "b")
    (tmp_path / "a" / ".journal" / TEAM_FILE).write_text(json.dumps({"device": "a", "upgrade": True}))
    templates_a, templates_b = Templates(tasks_a.connection, tasks_a.bus), Templates(tasks_b.connection, tasks_b.bus)
    BuiltinTemplates(templates_a, TeamAccount(Config(tmp_path / "a"))).run()
    BuiltinTemplates(templates_b, TeamAccount(Config(tmp_path / "b"))).run()
    assert templates_b.rows() == [], "a machine without the upgrade writes no shipped row of its own"
    incoming_b.apply(team_changes(outgoing_a))
    BuiltinTemplates(templates_b, TeamAccount(Config(tmp_path / "b"))).run()
    assert sorted(template.title for template in templates_b.rows()) == sorted(template.title for template in SHIPPED), "each shipped template once, as the machine with the upgrade wrote it"


def test_only_the_teams_settings_reach_the_other_journal_never_a_machines_or_a_persons(tmp_path):
    from journal.features.voices.feature import Voices
    from journal.features.workers.feature import Workers as WorkersFeature
    from journal.repositories.setting_rows import SettingRows

    _, scope_a, tasks_a, outgoing_a, _ = team_journal(tmp_path, "a")
    _, scope_b, tasks_b, _, incoming_b = team_journal(tmp_path, "b")
    settings_a, settings_b = SettingRows(tasks_a.connection, tasks_a.bus, scope_a), SettingRows(tasks_b.connection, tasks_b.bus, scope_b)
    settings_a.set(WorkersFeature.WORKER_LIMIT.key, 3, USER)
    settings_a.set(WorkersFeature.PREPARATION_COMMANDS.key, ["make env"], USER)
    settings_a.set(Voices.NAME.key, "Ada", USER)
    incoming_b.apply(team_changes(outgoing_a))
    assert settings_b.project_values() == {WorkersFeature.WORKER_LIMIT.key: 3}, "the team's setting arrives; the machine's commands and the person's name stay where they were set"


def test_two_journals_and_a_team_server_keep_a_task_in_step_and_a_change_made_while_it_is_down_arrives_later(tmp_path):
    import json
    import time
    from journal.config import Config
    from journal.repositories.outgoing_changes import OutgoingChanges
    from journal.sync.commit_signal import CommitSignal
    from journal.sync.sync_client import SyncClient
    from journal.sync.sync_status import SyncStatus
    from journal.sync.team_account import TEAM_FILE, TeamAccount
    from journal.sync.team_server_link import TeamServerLink
    from sync_server.account import ADMIN
    from sync_server.team_server import TeamServer
    from journal.repositories.environments import Environments
    from journal.db.schema import Schema
    from journal.models.all_models import AllModels
    from journal.repositories.setting_rows import SettingRows
    from journal.supervisor_link import SupervisorLink
    from journal.sync.team_chat_branch import TeamChatBranch
    from journal.support.typed_lines import TypedLines
    from sync_server.login_request import LoginRequest
    from journal.chat.cards import Cards
    from journal.repositories.messages import Messages
    from journal.repositories.reactions import Reactions
    from journal.repositories.shared_tables import SharedTables
    from journal.sync.rejected_edits import RejectedEdits
    from journal.repositories.id_blocks import IdBlocks
    from journal.repositories.pending_uploads import PendingUploads
    from journal.sync.attachments import Attachments
    from journal.sync.team_chat import TeamChat
    from journal.engine.agent_launcher import AgentLauncher

    team = TeamServer(tmp_path)
    team.accounts.create("ada@example.com", "Ada", "correct horse battery", ADMIN, 1.0)
    server = team.started("127.0.0.1", 0)
    port = server.server_address[1]

    def joined(name: str):
        signal = CommitSignal()
        _, scope, tasks, outgoing, incoming = team_journal(tmp_path, name, signal)
        answer = team.logins.answer(LoginRequest("ada@example.com", "correct horse battery", name), "127.0.0.1")
        account = TeamAccount(Config(tmp_path / name))
        account.write({"address": f"http://127.0.0.1:{port}", "token": answer.token, "device": answer.device_id})
        links = Links(tasks.connection, tasks.bus)
        messages = Messages(tasks.connection, tasks.bus, scope, Reactions(tasks.connection, tasks.bus, scope, links), links, EnvironmentOwners(links, Users(tasks.connection, tasks.bus), Environments(tasks.connection, tasks.bus)))
        rejected = RejectedEdits(SharedTables(tasks.connection, tasks.bus), outgoing, links, Cards(messages))
        uploads = PendingUploads(tasks.connection, tasks.bus)
        client = SyncClient(account, TeamServerLink(account, Schema(tasks.connection, AllModels.MODELS)), outgoing, incoming, rejected, signal, SyncStatus(account, outgoing), IdBlocks(tasks.connection, tasks.bus), SharedTables(tasks.connection, tasks.bus), uploads, Attachments(Config(tmp_path / name), uploads, account, TeamServerLink(account, Schema(tasks.connection, AllModels.MODELS))), TeamChat(account, TeamServerLink(account, Schema(tasks.connection, AllModels.MODELS)), AgentLauncher(Config(tmp_path / name)), SupervisorLink(Config(tmp_path / name), Environments(tasks.connection, tasks.bus), TypedLines(), SettingRows(tasks.connection, tasks.bus, scope)), Environments(tasks.connection, tasks.bus), TeamChatBranch(Config(tmp_path / name), account, Environments(tasks.connection, tasks.bus), Cards(messages), SyncStatus(account, outgoing)), Cards(messages)))
        client.start()
        return scope, tasks, client, messages

    def eventually(check, seconds: float) -> bool:
        deadline = time.monotonic() + seconds
        while time.monotonic() < deadline:
            if check():
                return True
            time.sleep(0.05)
        return False

    scope_a, tasks_a, client_a, _ = joined("a")
    scope_b, tasks_b, client_b, messages_b = joined("b")
    try:
        assert oct((tmp_path / "a" / ".journal" / TEAM_FILE).stat().st_mode & 0o777) == "0o600", "the token is readable by its owner alone"
        with scope_a.environment(1):
            task = tasks_a.save(Task(environment_id=1, title="in step"), actor=USER)
        assert eventually(lambda: [row.title for row in tasks_b.global_matching(environment_id=1)] == ["in step"], 1.0), "a task made on one journal is on the other within a second"
        with scope_b.environment(1):
            tasks_b.save(tasks_b.find(task.id).with_(title="renamed by b"), actor=USER)
        assert eventually(lambda: tasks_a.find(task.id).title == "renamed by b", 1.0)
        client_b.stop()
        with scope_b.environment(1):
            tasks_b.save(tasks_b.find(task.id).with_(title="b's older title"), actor=USER)
        time.sleep(0.01)
        with scope_a.environment(1):
            tasks_a.save(tasks_a.find(task.id).with_(title="a's later title"), actor=USER)
        assert eventually(lambda: team.log.row("tasks", task.id).fields["title"] == "a's later title", 1.0)
        client_b.start()
        assert eventually(lambda: tasks_b.find(task.id).title == "a's later title", 3.0) and tasks_a.find(task.id).title == "a's later title", "two edits of one title at once keep the later on both"
        with scope_b.environment(1):
            assert eventually(lambda: any("was kept over yours" in str(message) for message in messages_b.scoped()), 1.0), "the journal whose edit lost shows a card naming whose edit was kept"
        team.close(server)
        with scope_a.environment(1):
            tasks_a.save(tasks_a.find(task.id).with_(brief="written while the server was down"), actor=USER)
        time.sleep(0.5)
        assert client_a.status.line().startswith("Not connected") and tasks_b.find(task.id).brief == ""
        restarted = TeamServer(tmp_path)
        server = restarted.http("127.0.0.1", port)
        import threading
        threading.Thread(target=server.serve_forever, daemon=True).start()
        team = restarted
        assert eventually(lambda: tasks_b.find(task.id).brief == "written while the server was down", 8.0), "a change made while the server was down arrives once it is back"
    finally:
        client_a.stop()
        client_b.stop()
        team.close(server)
