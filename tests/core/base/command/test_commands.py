from dataclasses import dataclass
from datetime import datetime, timezone

from core.base.actor import Actor, ActorType
from core.base.command.context import Context
from core.base.command.delete_command import DeleteCommand
from core.base.command.edit_command import EditCommand
from core.base.command.make_command import MakeCommand
from core.base.command.move_command import MoveCommand
from core.base.timestamp import Timestamp
from tests.core.base.model.test_lifecycle import ItemLifecycle
from tests.core.base.model.test_model import Item

AT = Timestamp(datetime(2026, 10, 31, 9, tzinfo=timezone.utc))


@dataclass(frozen=True)
class ItemPause(MoveCommand[Item]):
    move = ItemLifecycle.pause
    reason: str


@dataclass(frozen=True)
class ItemMake(MakeCommand[Item]):
    title: str


@dataclass(frozen=True)
class ItemEdit(EditCommand[Item]):
    title: str | None = None


@dataclass(frozen=True)
class ItemDelete(DeleteCommand):
    deleted_model = Item


def test_a_command_names_the_model_it_works_on():
    assert (ItemPause.model(), ItemMake.model(), ItemEdit.model(), ItemDelete.model()) == (Item, Item, Item, Item)


def test_a_move_command_hands_on_only_its_own_fields():
    assert ItemPause(row_id=4, reason="a week paused").move_fields() == {"reason": "a week paused"}


def test_an_edit_hands_on_only_the_fields_given():
    assert ItemEdit(row_id=4).changed_fields() == {}
    assert ItemEdit(row_id=4, title="Dune Messiah").changed_fields() == {"title": "Dune Messiah"}


def test_a_nested_context_keeps_who_when_and_the_skipped_guards_and_names_its_own_command():
    outer = Context(Actor(7, ActorType.AGENT), AT, ItemMake(title="Dune"), frozenset({"messages.one-reply-per-message"}), cause_id=12)
    inner = outer.nested(ItemPause(row_id=4, reason="paused"))
    assert (inner.actor, inner.timestamp, inner.skipped_guards, inner.cause_id) == (outer.actor, outer.timestamp, outer.skipped_guards, 12)
    assert inner.command == ItemPause(row_id=4, reason="paused")
