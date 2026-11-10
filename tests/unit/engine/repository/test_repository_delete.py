import pytest

from engine.change.event_log import EventLog
from engine.change.event_pattern import EventPattern
from engine.container.container import Container
from core.base.database.database import Database
from core.base.database.statement import Statement
from engine.listener.deletion_listener import DeletionListener
from engine.model.model import Model
from engine.dotted_path.dotted_path import DottedPath
from core.base.registry.listener_entry import ListenerEntry
from core.base.registry.listener_timing import ListenerTiming
from core.base.registry.registry import Registry
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from tests.unit.core.base.sample_container import context, empty_registry, sample_container
from tests.unit.engine.command.test_commands import MakeItem
from tests.unit.engine.model.test_model import Item
from engine.change.deleted import Deleted
from engine.command.context import Context

NOTES = "CREATE TABLE item_notes (id INTEGER PRIMARY KEY, item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE RESTRICT) STRICT"


class ClearItemNotes(DeletionListener[Deleted[Item]]):
    """Removes an item's notes before the item is deleted."""

    name = "notes.clear"

    def __init__(self, database: Database) -> None:
        self.database = database

    def handle(self, event: Deleted[Item], context: Context) -> None:
        self.database.update(Statement("DELETE FROM item_notes WHERE item_id = ?", [event.row.id]))


def with_note(container: Container) -> Item:
    database = container.get(Database)
    database.update(Statement(NOTES))
    item = container.get(Repository).save(Item(title="Dune"), context(MakeItem(title="Dune")))
    database.insert(Statement("INSERT INTO item_notes (item_id) VALUES (?)", [item.id]))
    return item


def test_a_deletion_listener_clears_what_points_at_the_row_first(tmp_path):
    registry = Registry("abc", {}, {}, {}, (), (ListenerEntry(ClearItemNotes.name, EventPattern(ClearItemNotes.event), ListenerTiming.DELETION,
                                                               DottedPath.class_path(ClearItemNotes), 1),))
    container = sample_container(tmp_path, registry)
    item = with_note(container)
    with container.get(Database).transaction():
        container.get(Repository).delete(item, context(MakeItem(title="Dune")))
    assert container.get(Database).rows(Statement("SELECT count(*) FROM item_notes"))[0][0] == 0
    assert container.get(EventLog).event(container.get(EventLog).newest_id()).event == "item.delete"


def test_a_row_still_pointed_at_is_refused_naming_the_table_that_points(tmp_path):
    container = sample_container(tmp_path, empty_registry())
    item = with_note(container)
    with pytest.raises(Refusal, match="this item is still referred to by item_notes"):
        container.get(Repository).delete(item, context(MakeItem(title="Dune")))
