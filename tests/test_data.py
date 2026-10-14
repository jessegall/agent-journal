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
from journal.features.listener import Listener
from journal.features.listeners.unlink_deleted import UnlinkDeleted
from journal.features.refused import Refused
from journal.models.actor import Actor
from journal.models.link import Link
from journal.models.ref import Ref
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.links import Links
from journal.repositories.not_found import NotFound
from journal.repositories.tasks import Tasks

USER = Actor.user(1)
AGENT = Actor.agent("abc")


class Heard(Listener[ModelEvent]):
    def __init__(self):
        self.events = []

    def handle(self, event):
        self.events.append(event)


class SayNo(Listener[Creating]):
    def handle(self, event):
        raise Refused("not today")


def test_a_saved_task_gets_an_id_and_the_actor_stamp(connection, bus):
    tasks = Tasks(connection, bus)
    task = tasks.save(Task(environment_id=1, title="write the release notes"), by=USER)
    assert task.id == 1
    assert task.created_by == USER and task.updated_by == USER
    assert task.created_at is not None
    assert tasks.find(1) == task


def test_every_model_event_is_heard_in_order_with_its_actor(connection, bus):
    heard = Heard()
    bus.listen(ModelEvent, heard)
    tasks = Tasks(connection, bus)
    task = tasks.save(Task(environment_id=1, title="t"), by=USER)
    tasks.save(task.with_(state=TaskState.STARTED), by=AGENT)
    tasks.delete(task, by=USER)
    kinds = [type(e).__name__ for e in heard.events]
    assert kinds == ["Saving", "Creating", "Created", "Saved", "Saving", "Updating", "Updated", "Saved", "Deleting", "Deleted"]
    assert heard.events[5].by == AGENT and heard.events[5].model.state == TaskState.STARTED
    with pytest.raises(NotFound):
        tasks.find(task.id)


def test_a_refusing_listener_stops_the_write(connection, bus):
    bus.listen(Creating, SayNo())
    tasks = Tasks(connection, bus)
    with pytest.raises(Refused):
        tasks.save(Task(environment_id=1, title="t"), by=USER)
    assert tasks.all() == []


def test_links_join_any_two_rows_and_leave_with_a_deleted_row(connection, bus):
    tasks, links = Tasks(connection, bus), Links(connection, bus)
    bus.listen(Deleted, UnlinkDeleted(links))
    a = tasks.save(Task(environment_id=1, title="a"), by=USER)
    b = tasks.save(Task(environment_id=1, title="b"), by=USER)
    links.save(Link(source=Ref.to(a), target=Ref.to(b), kind="blocks"), by=AGENT)
    assert links.targets(a, "blocks") == [Ref.to(b)]
    assert links.sources(b) == [Ref.to(a)]
    assert len(links.between(a, b)) == 1
    tasks.delete(b, by=USER)
    assert links.of(a) == []


def test_where_reads_typed_values_back(connection, bus):
    tasks = Tasks(connection, bus)
    tasks.save(Task(environment_id=1, title="open"), by=USER)
    started = tasks.save(Task(environment_id=1, title="started", state=TaskState.STARTED), by=USER)
    assert tasks.in_state(1, TaskState.STARTED) == [started]
    assert tasks.in_(2) == []


def test_writes_from_many_threads_all_land(connection, bus):
    tasks = Tasks(connection, bus)

    def write(n):
        tasks.save(Task(environment_id=1, title=f"t{n}"), by=USER)

    threads = [threading.Thread(target=write, args=(n,)) for n in range(20)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    assert len(tasks.all()) == 20
