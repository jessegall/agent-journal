from engine.time.clock import Clock
from dataclasses import replace
from datetime import datetime, timezone

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.change.change import Change
from core.base.change.event_log import EventLog
from core.base.command.context import Context
from core.base.database.core_tables_migration import CORE_MIGRATIONS
from core.base.database.database import Database
from core.base.database.schema import Schema
from engine.journal.journal_home import JournalHome
from engine.errors.missing_rows_error import MissingRowsError
from core.base.model.tables import Tables
from engine.time.timestamp import Timestamp
from tests.unit.core.base.command.test_commands import MakeItem
from tests.unit.core.base.model.test_lifecycle import ItemLifecycle
from tests.unit.core.base.model.test_model import Item

FIXED_TIME = Timestamp(datetime(2026, 10, 31, 9, tzinfo=timezone.utc))
CONTEXT = Context(Actor(7, ActorType.AGENT), FIXED_TIME, MakeItem(title="Dune"), environment_id=2, cause_id=11)


@pytest.fixture
def log(tmp_path):
    database = Database.opened(JournalHome(tmp_path))
    tables = Tables()
    Schema(database, tables, Clock()).migrate([CORE_MIGRATIONS])
    yield EventLog(database, tables)
    database.close()


def test_a_change_reads_back_with_who_what_why_and_when(log):
    stored = Item(id=4, version=1, title="Dune")
    event_id = log.write(Change(stored, stored.moved(ItemLifecycle.pause), CONTEXT), frozenset({"items.no-paused-items"}))
    event = log.event(event_id)
    assert (event.event, event.row_table, event.row_id, event.environment_id, event.actor_id) == ("item.pause", "items", 4, 2, 7)
    assert (event.command, event.cause_id, event.skipped_guards, event.timestamp) == ("MakeItem", 11, frozenset({"items.no-paused-items"}), FIXED_TIME)
    assert dict(event.data) == {"state": ("open", "paused")}


def test_a_new_row_logs_every_field_it_was_made_with(log):
    event = log.event(log.write(Change(None, Item(id=5, version=1, title="Dune"), CONTEXT), frozenset()))
    assert dict(event.data) == {"title": (None, "Dune"), "state": (None, "open")}


def test_row_values_are_the_row_as_the_log_keeps_it_with_no_bookkeeping():
    row = Item(id=4, version=2, title="Dune")
    values = EventLog.row_values(row)
    assert values["id"] == 4 and values["title"] == "Dune" and "version" not in values and "created_at" not in values


def test_events_are_read_past_an_id_in_id_order(log):
    first = log.write(Change(None, Item(id=5, version=1, title="Dune"), CONTEXT), frozenset())
    second = log.write(Change(None, Item(id=6, version=1, title="Emma"), replace(CONTEXT, cause_id=None)), frozenset())
    assert [event.id for event in log.events_after(0)] == [first, second]
    assert [event.id for event in log.events_after(first)] == [second]
    assert log.newest_id() == second


def test_an_event_that_is_not_there_is_refused_by_id(log):
    with pytest.raises(MissingRowsError, match="no event 99"):
        log.event(99)


def test_events_caused_by_one_event_exclude_other_changes_and_keep_their_order(log):
    row = Item(id=5, version=1, title="Dune")
    parent = log.write(Change(None, row, replace(CONTEXT, cause_id=None)), frozenset())
    first = log.write(Change(None, row, replace(CONTEXT, cause_id=parent)), frozenset())
    log.write(Change(None, row, replace(CONTEXT, cause_id=first)), frozenset())
    last = log.write(Change(None, row, replace(CONTEXT, cause_id=parent)), frozenset())
    assert [event.id for event in log.child_events(parent)] == [first, last]
