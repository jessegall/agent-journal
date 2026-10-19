from journal.config import Config
from journal.db.masks import Masks
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
from journal.support.refused import Refused
from journal.models.actor import Actor
from journal.models.link import Link
from journal.models.ref import Ref
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.links import Links
from journal.repositories.not_found import NotFound
from journal.repositories.checks import Checks
from journal.repositories.questions import Questions
from journal.repositories.tasks import Tasks
from journal.repositories.unscoped import Unscoped

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
        raise Refused("not today")


def test_a_saved_task_gets_an_id_and_the_actor_stamp(connection, bus, scope):
    tasks = tasks_of(connection, bus, scope)
    task = tasks.save(Task(environment_id=1, title="write the release notes"), by=USER)
    assert task.id == 1
    assert task.created_by == USER and task.updated_by == USER
    assert task.created_at is not None
    assert tasks.find(1) == task


def test_every_model_event_is_heard_in_order_with_its_actor(connection, bus, scope):
    heard = Heard()
    bus.listen(ModelEvent, heard)
    tasks = tasks_of(connection, bus, scope)
    task = tasks.save(Task(environment_id=1, title="t"), by=USER)
    tasks.save(task.with_(state=TaskState.STARTED), by=AGENT)
    tasks.delete(task, by=USER)
    kinds = [type(e).__name__ for e in heard.events]
    assert kinds == ["Saving", "Creating", "Created", "Saved", "Saving", "Updating", "Updated", "Saved", "Deleting", "Deleted"]
    assert heard.events[5].by == AGENT and heard.events[5].model.state == TaskState.STARTED
    with pytest.raises(NotFound):
        tasks.find(task.id)


def test_a_refusing_listener_stops_the_write(connection, bus, scope):
    bus.listen(Creating, SayNo())
    tasks = tasks_of(connection, bus, scope)
    with pytest.raises(Refused):
        tasks.save(Task(environment_id=1, title="t"), by=USER)
    with scope.of(1):
        assert tasks.all() == []


def test_links_join_any_two_rows_and_leave_with_a_deleted_row(connection, bus, scope):
    tasks, links = tasks_of(connection, bus, scope), Links(connection, bus)
    bus.listen(Deleted, UnlinkDeleted(links))
    a = tasks.save(Task(environment_id=1, title="a"), by=USER)
    b = tasks.save(Task(environment_id=1, title="b"), by=USER)
    links.save(Link(source=Ref.to(a), target=Ref.to(b), kind="blocks"), by=AGENT)
    assert links.targets(a, "blocks") == [Ref.to(b)]
    assert links.every_source(b) == [Ref.to(a)]
    assert len(links.between(a, b)) == 1
    tasks.delete(b, by=USER)
    assert links.of(a) == []


def test_where_reads_typed_values_back(connection, bus, scope):
    tasks = tasks_of(connection, bus, scope)
    tasks.save(Task(environment_id=1, title="open"), by=USER)
    started = tasks.save(Task(environment_id=1, title="started", state=TaskState.STARTED), by=USER)
    with scope.of(1):
        assert tasks.in_state(TaskState.STARTED) == [started]
    with scope.of(2):
        assert tasks.in_() == [] and tasks.where(title="open") == [] and tasks.search(["open"]) == [] and tasks.counted_in() == 0, "every read is the scope's, whatever it asks"
    with pytest.raises(Unscoped):
        tasks.where(title="open")
    assert [t.title for t in tasks.across_environments(title="open")] == ["open"], "a read across environments says so by its name"


def test_writes_from_many_threads_all_land(connection, bus, scope):
    tasks = tasks_of(connection, bus, scope)

    def write(n):
        tasks.save(Task(environment_id=1, title=f"t{n}"), by=USER)

    threads = [threading.Thread(target=write, args=(n,)) for n in range(20)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    with scope.of(1):
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
        db.execute("CREATE TABLE messages (id INTEGER PRIMARY KEY AUTOINCREMENT, environment_id INTEGER, author TEXT, text TEXT, created_at TEXT, updated_at TEXT, created_by TEXT, updated_by TEXT)")
        db.execute("INSERT INTO messages (environment_id, author, text, created_at, updated_at, created_by, updated_by) VALUES (1, 'user', 'old', '2026-01-01T00:00:00+00:00', '2026-01-01T00:00:00+00:00', 'user:1', 'user:1')")
    Schema(old, AllModels.MODELS).create()
    bus = Bus()
    scope = Scope(Environments(old, bus))
    message = Messages(old, bus, scope, Reactions(old, bus, scope, Links(old, bus)), Links(old, bus)).find(1)
    assert message.files == () and message.acknowledgement is False and message.idempotency == "" and message.read_at is None


def test_a_title_is_one_line_of_eighty_characters_without_a_colon_and_an_old_one_is_left_alone(connection, bus, scope):
    from journal.models.actor import Actor
    from journal.models.task import Task
    from journal.support.refused import Refused
    from journal.repositories.tasks import Tasks
    tasks = tasks_of(connection, bus, scope)
    with pytest.raises(Refused, match="at most 80 characters"):
        tasks.save(Task(environment_id=1, title="x" * 81), Actor.system())
    with pytest.raises(Refused, match="no colon"):
        tasks.save(Task(environment_id=1, title="Titles: the rule"), Actor.system())
    short = tasks.save(Task(environment_id=1, title="The title rule", brief="x" * 500), Actor.system())
    assert tasks.save(short.with_(brief="changed"), Actor.system()).brief == "changed", "a row saved again with the title it had is left alone"
