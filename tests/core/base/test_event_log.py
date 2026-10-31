from dataclasses import replace
from datetime import datetime, timezone

import pytest

from core.base.actor import Actor, ActorType
from core.base.change.change import Change
from core.base.change.event_log import EventLog
from core.base.command.context import Context
from core.base.database.core_tables import CORE_MIGRATIONS
from core.base.database.database import Database
from core.base.database.schema import Schema
from core.base.journal_home import JournalHome
from core.base.missing_rows import MissingRows
from core.base.model.tables import Tables
from core.base.moment import Moment
from tests.core.base.test_commands import LoanMake
from tests.core.base.test_lifecycle import LoanLifecycle
from tests.core.base.test_model import Loan

AT = Moment(datetime(2026, 10, 31, 9, tzinfo=timezone.utc))
CONTEXT = Context(Actor(7, ActorType.AGENT), AT, LoanMake(title="Dune"), environment_id=2, cause_id=11)


@pytest.fixture
def log(tmp_path):
    database = Database.opened(JournalHome(tmp_path))
    tables = Tables()
    Schema(database, tables).migrate((CORE_MIGRATIONS,))
    yield EventLog(database, tables)
    database.close()


def test_a_change_reads_back_with_who_what_why_and_when(log):
    stored = Loan(id=4, version=1, title="Dune")
    event_id = log.write(Change(stored, stored.moved(LoanLifecycle.overdue), CONTEXT), frozenset({"loans.no-late-loans"}))
    event = log.event(event_id)
    assert (event.event, event.row_table, event.row_id, event.environment_id, event.actor_id) == ("loan.overdue", "loans", 4, 2, 7)
    assert (event.command, event.cause_id, event.skipped_guards, event.moment) == ("LoanMake", 11, frozenset({"loans.no-late-loans"}), AT)
    assert dict(event.data) == {"state": ("lent", "late")}


def test_a_new_row_logs_every_field_it_was_made_with(log):
    event = log.event(log.write(Change(None, Loan(id=5, version=1, title="Dune"), CONTEXT), frozenset()))
    assert dict(event.data) == {"title": (None, "Dune"), "state": (None, "lent")}


def test_events_are_read_past_an_id_in_id_order(log):
    first = log.write(Change(None, Loan(id=5, version=1, title="Dune"), CONTEXT), frozenset())
    second = log.write(Change(None, Loan(id=6, version=1, title="Emma"), replace(CONTEXT, cause_id=None)), frozenset())
    assert [event.id for event in log.events_past(0)] == [first, second]
    assert [event.id for event in log.events_past(first)] == [second]
    assert log.newest_id() == second


def test_an_event_that_is_not_there_is_refused_by_id(log):
    with pytest.raises(MissingRows, match="no event 99"):
        log.event(99)
