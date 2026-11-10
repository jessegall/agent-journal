from dataclasses import replace

import pytest

from engine.change.event_log import EventLog
from engine.change.event_pattern import EventPattern
from engine.container.container import Container
from core.base.database.database import Database
from core.base.database.statement import Statement
from engine.guard.guard_refusal import GuardRefusal
from core.base.model.model import Model
from engine.dotted_path.dotted_path import DottedPath
from core.base.registry.guard_entry import GuardEntry
from core.base.registry.listener_entry import ListenerEntry
from core.base.registry.listener_timing import ListenerTiming
from core.base.registry.registry import Registry
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.repository.stale_row_error import StaleRowError
from engine.row.metadata import Metadata
from engine.query.queries import Queries
from engine.guard.guard import Guard
from core.base.listener.save_listener import SaveListener
from tests.unit.core.base.sample_container import context, empty_registry, sample_container
from tests.unit.engine.command.test_commands import MakeItem
from tests.unit.core.base.model.test_lifecycle import ItemLifecycle
from tests.unit.core.base.model.test_model import Item
from engine.change.updated import Updated
from engine.command.context import Context
from engine.change.changed import Changed

EVENT_COUNTS: list[str] = []


class ForbiddenTitleGuard(Guard[Updated[Item]]):
    """No item is titled Dune Messiah."""

    name = "items.no-dune-messiah"

    def check(self, event: Updated[Item], context: Context) -> None:
        EVENT_COUNTS.append("guard")
        raise Refusal("Dune Messiah is out of print")


class EventCounter(SaveListener[Changed[Item]]):
    """Records how many events the log holds when it runs."""

    name = "items.count-events"

    def __init__(self, database: Database) -> None:
        self.database = database

    def handle(self, event: Changed[Item], context: Context) -> None:
        EVENT_COUNTS.append(f"events {self.database.rows(Statement('SELECT count(*) FROM events'))[0][0]}")


@pytest.fixture
def container(tmp_path):
    EVENT_COUNTS.clear()
    registry = Registry("abc", {}, {}, {}, [GuardEntry(ForbiddenTitleGuard.name, EventPattern(ForbiddenTitleGuard.event), DottedPath.class_path(ForbiddenTitleGuard), 1, "")],
                        [ListenerEntry(EventCounter.name, EventPattern(EventCounter.event), ListenerTiming.SAVE, DottedPath.class_path(EventCounter), 1)])
    return sample_container(tmp_path, registry)


def save(container: Container, item: Item) -> Item:
    return container.get(Repository).save(item, context(MakeItem(title=item.title)))


def test_a_new_row_gets_an_id_a_first_version_and_both_timestamps(container: Container):
    saved = save(container, Item(title="Dune"))
    assert (saved.id, saved.version, saved.created_at is not None) == (1, 1, True)


def test_only_the_changed_fields_are_written_and_the_version_rises(container: Container):
    saved = save(container, Item(title="Dune"))
    moved = save(container, saved.moved(ItemLifecycle.pause))
    assert (moved.version, moved.state.value) == (2, "paused")
    assert container.get(EventLog).event(2).data == {"state": ("open", "paused")}


def test_a_copy_read_before_another_change_is_refused(container: Container):
    saved = save(container, Item(title="Dune"))
    save(container, saved.moved(ItemLifecycle.pause))
    with pytest.raises(StaleRowError, match="item 1 changed since it was read"):
        save(container, saved.moved(ItemLifecycle.close))


def test_a_save_that_changes_nothing_writes_and_logs_nothing(container: Container):
    saved = save(container, Item(title="Dune"))
    assert save(container, saved) == saved
    assert container.get(EventLog).newest_id() == 1


def test_a_move_keeps_its_metadata_in_the_database(container: Container):
    saved = save(container, Item(title="Dune"))
    metadata = Metadata({"items": {"review": 7}})
    moved = save(container, saved.moved(ItemLifecycle.pause, metadata=metadata))
    assert container.get(Queries).query(Item).find(moved.id).metadata == metadata
    assert container.get(EventLog).event(2).event == "item.pause"


def test_a_metadata_only_change_stays_ignored_without_an_event(container: Container):
    saved = save(container, Item(title="Dune"))
    metadata = Metadata({"items": {"review": 7}})
    updated = save(container, saved.changed(metadata=metadata))
    stored = container.get(Queries).query(Item).find(updated.id)
    assert (stored.version, stored.metadata) == (1, saved.metadata)
    assert container.get(EventLog).newest_id() == 1


def test_save_metadata_keeps_a_metadata_only_change_with_an_update_event(tmp_path):
    container = sample_container(tmp_path, empty_registry())
    saved = save(container, Item(title="Dune"))
    metadata = Metadata({"items": {"review": 7}})
    updated = container.get(Repository).save_metadata(saved, metadata, context(MakeItem(title="Dune")))
    stored = container.get(Queries).query(Item).find(updated.id)
    assert (stored.version, stored.metadata) == (2, metadata)
    assert container.get(EventLog).event(2).event == "item.update"


def test_guards_are_asked_before_anything_is_written(container: Container):
    saved = save(container, Item(title="Dune"))
    with pytest.raises(GuardRefusal, match="out of print"):
        save(container, saved.changed(title="Dune Messiah"))
    assert container.get(Database).rows(Statement("SELECT title FROM items"))[0][0] == "Dune"


def test_the_change_is_logged_before_a_save_listener_runs(container: Container):
    save(container, Item(title="Dune"))
    assert EVENT_COUNTS == ["events 1"]


def test_a_constraint_failure_becomes_a_refusal(container: Container):
    save(container, Item(title="Dune"))
    with pytest.raises(Refusal, match="an item with that title exists already"):
        save(container, Item(title="Dune"))


def test_a_deleted_row_is_gone_and_logged(tmp_path):
    container = sample_container(tmp_path, empty_registry())
    saved = container.get(Repository).save(Item(title="Dune"), context(MakeItem(title="Dune")))
    with pytest.raises(StaleRowError):
        container.get(Repository).delete(replace(saved, version=5), context(MakeItem(title="Dune")))
    container.get(Repository).delete(saved, context(MakeItem(title="Dune")))
    assert container.get(Database).rows(Statement("SELECT count(*) FROM items"))[0][0] == 0
    assert container.get(EventLog).event(2).event == "item.delete"
