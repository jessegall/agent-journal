from engine.record import Record
from features.tickets.controller import Tickets
from resources.base import AGENT, USER
from tests.conftest import fresh


def test_a_ticket_belongs_to_the_project_and_one_source_event_stays_one_ticket():
    record = fresh()
    made = Tickets(record, actor=USER).create("Checkout fails on empty cart", brief="the pay button errors", board=1, stage="New")
    elsewhere = Tickets(Record(record.root, "other"), actor=AGENT)
    assert (elsewhere.load(made.n).title, made.source, made.board, made.stage) == ("Checkout fails on empty cart", USER, 1, "New"), \
        "a ticket is the whole project's, and says who made it"
    first = elsewhere.create("TypeError in checkout", brief="first seen", source="sentry", source_id="evt-1")
    again = elsewhere.create("TypeError in checkout", brief="seen 40 times", source="sentry", source_id="evt-1")
    other = elsewhere.create("TypeError in checkout", source="sentry", source_id="evt-2")
    assert (again.n, again.brief, other.n != first.n) == (first.n, "seen 40 times", True), \
        "the same event from the same source updates its ticket; another event makes another"
