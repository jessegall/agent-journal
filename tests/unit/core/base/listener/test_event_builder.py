from types import MappingProxyType

from core.base.change.created import Created
from core.base.change.event_type import EventType
from core.base.change.journal_booting import JournalBooting
from core.base.change.logged_event import LoggedEvent
from core.base.change.moved import Moved
from core.base.change.touched import Touched
from core.base.listener.event_builder import EventBuilder
from core.base.timestamp import Timestamp
from tests.unit.core.base.model.test_model import Item

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


class ItemTable:
    types = {"title": str}


class ItemTables:
    def table(self, model: type) -> ItemTable:
        return ItemTable()


def logged(event: str, data: dict[str, tuple[object, object]]) -> LoggedEvent:
    return LoggedEvent(id=1, event=event, row_table="items", row_id=7, actor_id=1, environment_id=1, command="", timestamp=STAMP, data=MappingProxyType(data), cause_id=None, skipped_guards=())


def item() -> Item:
    return Item(id=7, title="New title")


def test_a_created_event_holds_the_row():
    event = EventBuilder(ItemRows(item()), ItemTables()).built(EventType(Created, Item), logged("item.create", {}))
    assert event == Created(item())


def test_a_row_that_is_gone_gives_no_event():
    assert EventBuilder(ItemRows(None), ItemTables()).built(EventType(Created, Item), logged("item.create", {})) is None


def test_a_moved_event_puts_the_old_values_back_and_finds_the_move():
    event = EventBuilder(ItemRows(item()), ItemTables()).built(EventType(Moved, Item), logged("item.close", {"title": ("Old title", "New title")}))
    assert event.old_row.title == "Old title" and event.row.title == "New title" and event.move.name == "close"


def test_touched_and_system_events_load_no_row():
    builder = EventBuilder(ItemRows(None), ItemTables())
    assert builder.built(EventType(Touched, Item), logged("item.update", {})) == Touched()
    assert builder.built(EventType(JournalBooting, None), logged("journal.booting", {})) == JournalBooting()
