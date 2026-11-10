from datetime import datetime, timezone

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.event.change import Change
from engine.event.created import Created
from engine.event.deleted import Deleted
from engine.event.moved import Moved
from engine.command.context import Context
from engine.time.timestamp import Timestamp
from engine.row.metadata import Metadata
from tests.unit.engine.command.test_commands import MakeItem
from tests.unit.engine.model.test_lifecycle import ItemLifecycle, ItemState
from tests.unit.engine.model.test_model import Item

FIXED_TIME = Timestamp(datetime(2026, 10, 31, 9, tzinfo=timezone.utc))
CONTEXT = Context(Actor(7, ActorType.AGENT), FIXED_TIME, MakeItem(title="Dune"))
STORED = Item(id=4, version=1, title="Dune")


def test_a_typed_event_gives_back_the_change_it_came_from():
    moved = STORED.moved(ItemLifecycle.pause)
    assert Change.event_change(Created(STORED), CONTEXT).event == "item.create"
    assert Change.event_change(Moved(moved, STORED, ItemLifecycle.pause), CONTEXT).event == "item.pause"
    assert Change.event_change(Deleted(STORED), CONTEXT) == Change(STORED, None, CONTEXT)


def test_a_new_row_is_a_create():
    assert Change(None, Item(title="Dune"), CONTEXT).event == "item.create"


def test_a_deletion_is_a_delete():
    assert Change(STORED, None, CONTEXT).event == "item.delete"


def test_a_move_is_named_for_the_move():
    assert Change(STORED, STORED.moved(ItemLifecycle.pause), CONTEXT).event == "item.pause"


def test_changed_fields_without_a_move_are_an_update_and_metadata_is_not_one_of_them():
    change = Change(STORED, STORED.changed(title="Dune Messiah"), CONTEXT)
    assert (change.event, change.fields) == ("item.update", ["title"])


def test_a_save_that_changes_nothing_is_empty():
    assert Change(STORED, STORED, CONTEXT).is_empty
    assert not Change(None, Item(title="Dune"), CONTEXT).is_empty


def test_a_move_from_the_state_the_row_is_in_is_still_that_move():
    paused = Item(id=4, version=1, title="Dune", state=ItemState.PAUSED)
    change = Change(paused, paused.moved(ItemLifecycle.pause), CONTEXT)
    assert (change.event, change.is_empty) == ("item.pause", False)


def test_metadata_stays_separate_from_model_fields_and_does_not_make_an_edit():
    metadata = Metadata({"items": {"review": 7}})
    change = Change(STORED, STORED.changed(metadata=metadata), CONTEXT)
    assert (change.fields, change.stored_fields, change.is_empty) == ([], ["metadata"], True)


def test_metadata_changed_with_a_move_keeps_the_move_event():
    metadata = Metadata({"items": {"review": 7}})
    change = Change(STORED, STORED.moved(ItemLifecycle.pause, metadata=metadata), CONTEXT)
    assert (change.event, change.fields, change.stored_fields) == ("item.pause", ["state"], ["state", "metadata"])
