from datetime import datetime, timezone

from core.base.actor import Actor, ActorType
from core.base.change.change import Change
from core.base.command.context import Context
from core.base.timestamp import Timestamp
from tests.core.base.command.test_commands import ItemMake
from tests.core.base.model.test_lifecycle import ItemLifecycle, ItemState
from tests.core.base.model.test_model import Item

AT = Timestamp(datetime(2026, 10, 31, 9, tzinfo=timezone.utc))
CONTEXT = Context(Actor(7, ActorType.AGENT), AT, ItemMake(title="Dune"))
STORED = Item(id=4, version=1, title="Dune")


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
