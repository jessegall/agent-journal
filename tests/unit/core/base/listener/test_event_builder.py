from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from types import MappingProxyType

import pytest

from engine.actor.actor import Actor
from core.base.change.change import Change
from core.base.change.changed import Changed
from core.base.change.created import Created
from core.base.change.deleted import Deleted
from core.base.change.event_type import EventType
from core.base.change.journal_booting import JournalBooting
from core.base.change.logged_event import LoggedEvent
from core.base.change.moved import Moved
from core.base.change.touched import Touched
from core.base.listener.event_builder import EventBuilder
from core.base.listener.commit_listener import CommitListener
from core.base.command.context import Context
from core.base.model.added_state import AddedState
from core.base.model.move import Move
from core.base.model.state_addition import StateAddition
from core.base.model.state_book import StateBook
from core.base.model.tables import Tables
from core.base.timestamp import Timestamp
from tests.unit.core.base.model.test_model import Item
from tests.unit.core.base.model.test_lifecycle import ItemState
from tests.unit.core.base.command.test_commands import MakeItem
from tests.unit.core.base.change.test_event_log import log

STAMP = Timestamp.parsed("2026-11-01T09:00:00+00:00")


class ItemRows:
    """Answers a query for one saved item, or for nothing."""

    def __init__(self, row: Item | None) -> None:
        self.row = row

    def find(self, model: type, row_id: int) -> Item | None:
        return self.row


class HiddenTitleItem(Item):
    hidden_fields = frozenset(["title"])


@dataclass(frozen=True, kw_only=True)
class OptionalTitleItem(Item):
    title: str | None = None

    def change_name(self, old_row: "OptionalTitleItem | None") -> str:
        return "prompt"


class OptionalItemChanges(CommitListener[Changed[OptionalTitleItem]]):
    name = "items.optional-changes"


def logged(event: str, data: Mapping[str, Sequence[object]]) -> LoggedEvent:
    return LoggedEvent(id=1, event=event, row_table="items", row_id=7, actor_id=1, environment_id=1, command="", timestamp=STAMP,
                       data=MappingProxyType({name: (values[0], values[1]) for name, values in data.items()}), cause_id=None, skipped_guards=())


def item() -> Item:
    return Item(id=7, title="New title")


def test_a_created_event_holds_the_row():
    event = EventBuilder(ItemRows(item()), Tables(), StateBook()).built(EventType(Created, Item), logged("item.create", {}))
    assert event == Created(item())


def test_a_row_that_is_gone_gives_no_event():
    assert EventBuilder(ItemRows(None), Tables(), StateBook()).built(EventType(Created, Item), logged("item.create", {})) is None


@pytest.mark.parametrize("declared", [Deleted, Changed])
def test_a_deleted_event_restores_public_fields_without_the_row(declared):
    event = EventBuilder(ItemRows(None), Tables(), StateBook()).built(
        EventType(declared, Item), logged("item.delete", {"title": ("Old title", None), "state": ("reviewing", None)}))
    assert isinstance(event, Deleted)
    assert event.row.id == 7 and event.row.title == "Old title"
    assert event.row.state == AddedState("reviewing")


def test_a_deleted_hidden_row_is_not_restored_from_a_mask():
    event = EventBuilder(ItemRows(None), Tables(), StateBook()).built(
        EventType(Deleted, HiddenTitleItem), logged("item.delete", {"title": ("hidden", "hidden")}))
    assert event is None


def test_a_moved_event_puts_the_old_values_back_and_finds_the_move():
    event = EventBuilder(ItemRows(item()), Tables(), StateBook()).built(EventType(Moved, Item), logged("item.close", {"title": ("Old title", "New title")}))
    assert event.old_row.title == "Old title" and event.row.title == "New title" and event.move.name == "close"


def test_touched_and_system_events_load_no_row():
    builder = EventBuilder(ItemRows(None), Tables(), StateBook())
    assert builder.built(EventType(Touched, Item), logged("item.update", {})) == Touched()
    assert builder.built(EventType(JournalBooting, None), logged("journal.booting", {})) == JournalBooting()


def test_an_old_added_state_is_restored_as_an_added_state():
    row = Item(id=7, title="New title", state=ItemState.CLOSED)
    event = EventBuilder(ItemRows(row), Tables(), StateBook()).built(EventType(Moved, Item), logged("item.close", {"state": ("reviewing", "closed")}))
    assert event.old_row.state == AddedState("reviewing")


def test_the_word_hidden_is_restored_in_a_visible_text_column():
    event = EventBuilder(ItemRows(item()), Tables(), StateBook()).built(EventType(Moved, Item), logged("item.close", {"title": ("hidden", "New title")}))
    assert event.old_row.title == "hidden"


def test_a_hidden_column_does_not_restore_the_mask_as_its_old_value():
    row = HiddenTitleItem(id=7, title="Secret title")
    event = EventBuilder(ItemRows(row), Tables(), StateBook()).built(EventType(Moved, HiddenTitleItem), logged("item.close", {"title": ("hidden", "hidden")}))
    assert event.old_row.title == "Secret title"


def test_an_added_move_is_read_from_the_state_book():
    reviewing = AddedState("reviewing")
    move = Move("review", [ItemState.OPEN], reviewing)
    addition = StateAddition(Item, reviewing, "Under review", ItemState.OPEN, ItemState.OPEN, [move])
    row = Item(id=7, title="New title", state=reviewing)
    event = EventBuilder(ItemRows(row), Tables(), StateBook([addition])).built(EventType(Moved, Item), logged("item.review", {"state": ("open", "reviewing")}))
    assert event.move is move


@pytest.mark.parametrize("old_row", [None, OptionalTitleItem(id=7)], ids=["named-creation", "nullable-field-update"])
def test_a_named_event_has_the_same_kind_as_the_saved_change(old_row, log):
    row = OptionalTitleItem(id=7, title="New title")
    change = Change(old_row, row, Context(Actor.core(), STAMP, MakeItem(title="New title")))
    event = logged(change.event, log.data(change))

    built = EventBuilder(ItemRows(row), Tables(), StateBook()).built(EventType(Changed, OptionalTitleItem), event)

    assert built == change.typed_event(OptionalItemChanges)
