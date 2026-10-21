from journal.config import Config
from journal.support.masks import Masks
from journal.support.secret_values import SecretValues
"""Phase one: a task is created, linked, updated and deleted in a real database, and every model event is heard with its actor."""

import threading

import pytest

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
from journal.models.link import Link
from journal.models.support.ref import Ref
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.links import Links
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
    message = Messages(old, bus, scope, Reactions(old, bus, scope, Links(old, bus)), Links(old, bus)).find(1)
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
    from journal.support.export_name import ExportName
    assert RowCard.build(report).as_data() == {"row": "reports:33", "heading": "Report 33: What the dock showed", "summary": "One line about it", "dock": {"buttons": [{"label": "Open", "act": "open"}, {"label": "Close", "act": "close"}], "folds": True}, "file": f"What the dock showed.{ExportName.extension()}"}
    assert RowCard.build(task).file == "", "a task is not downloaded as a document"


def test_the_time_keys_migration_renames_at_in_the_column_and_the_stored_json(connection):
    """Migration 20: the edits column at becomes time, and the at key inside an entry's data, a check's progress and a dump's question and answers becomes time; a record without them is left as it is."""
    import json
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
    for found in pkgutil.walk_packages(journal.__path__, "journal."):
        module = importlib.import_module(found.name)
        for name, cls in inspect.getmembers(module, inspect.isclass):
            if cls.__module__ != found.name or not dataclasses.is_dataclass(cls):
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
    import json
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
