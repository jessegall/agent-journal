from types import MappingProxyType

from core.base.change.created import Created
from core.base.change.event_type import EventType
from core.base.change.journal_booting import JournalBooting
from core.base.change.logged_event import LoggedEvent
from core.base.change.moved import Moved
from core.base.change.touched import Touched
from core.base.listener.event_builder import EventBuilder
from core.base.model.added_state import AddedState
from core.base.model.move import Move
from core.base.model.state_addition import StateAddition
from core.base.model.state_book import StateBook
from core.base.model.tables import Tables
from core.base.timestamp import Timestamp
from tests.unit.core.base.model.test_model import Item
from tests.unit.core.base.model.test_lifecycle import ItemState

STAMP = Timestamp.parsed("2026-11-01T09:00:00+00:00")


class ItemRows:
    """Answers a query for one saved item, or for nothing."""

    def __init__(self, row: Item | None) -> None:
        self.row = row

    def query(self, model: type) -> "ItemRows":
        return self

    def filter(self, **values: object) -> "ItemRows":
        return self

    def first(self) -> Item | None:
        return self.row


class HiddenTitleItem(Item):
    hidden_fields = frozenset(["title"])


def logged(event: str, data: dict[str, tuple[object, object]]) -> LoggedEvent:
    return LoggedEvent(id=1, event=event, row_table="items", row_id=7, actor_id=1, environment_id=1, command="", timestamp=STAMP, data=MappingProxyType(data), cause_id=None, skipped_guards=())


def item() -> Item:
    return Item(id=7, title="New title")


def test_a_created_event_holds_the_row():
    event = EventBuilder(ItemRows(item()), Tables(), StateBook()).built(EventType(Created, Item), logged("item.create", {}))
    assert event == Created(item())


def test_a_row_that_is_gone_gives_no_event():
    assert EventBuilder(ItemRows(None), Tables(), StateBook()).built(EventType(Created, Item), logged("item.create", {})) is None


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
