from engine.record import Record
from features.boards.controller import Boards
from features.tickets.controller import Tickets
from resources.base import AGENT, USER
from tests.conftest import fresh


def test_a_ticket_belongs_to_the_project_and_one_source_event_stays_one_ticket():
    record = fresh()
    Boards(record, actor=USER).create("Bugs", stages=["New", "Doing", "Done"])
    made = Tickets(record, actor=USER).create("Checkout fails on empty cart", brief="the pay button errors", board=1)
    elsewhere = Tickets(Record(record.root, "other"), actor=AGENT)
    assert (elsewhere.load(made.n).title, made.source, made.board, made.stage) == ("Checkout fails on empty cart", USER, 1, "New"), \
        "a ticket is the whole project's, and says who made it"
    first = elsewhere.create("TypeError in checkout", brief="first seen", source="sentry", source_id="evt-1")
    again = elsewhere.create("TypeError in checkout", brief="seen 40 times", source="sentry", source_id="evt-1")
    other = elsewhere.create("TypeError in checkout", source="sentry", source_id="evt-2")
    assert (again.n, again.brief, other.n != first.n) == (first.n, "seen 40 times", True), \
        "the same event from the same source updates its ticket; another event makes another"


def test_a_board_holds_its_tickets_in_its_own_stages_and_marks_what_they_mean():
    from resources.base import Refused
    from tests.conftest import refused
    record = fresh()
    boards, tickets = Boards(record, actor=USER), Tickets(record, actor=USER)
    board = boards.create("Features", stages=["Ideas", "Building"])
    boards.stage(board.n, "Shipped", "done")
    boards.mark(board.n, "Building", "start")
    assert (boards.load(board.n).stages, boards.load(board.n).meanings) == (["Ideas", "Building", "Shipped"], {"Shipped": "done", "Building": "start"}), \
        "stages are free, and a stage is marked with what it means"
    assert "not" in refused(lambda: boards.mark(board.n, "Ideas", "someday")), "a stage means start, review or done, nothing else"
    ticket = tickets.create("Dark mode", board=board.n)
    assert (ticket.stage, tickets.move(ticket.n, "Shipped").stage) == ("Ideas", "Shipped"), "a ticket starts in its board's first stage and moves between them"
    assert "has no stage" in refused(lambda: tickets.move(ticket.n, "Nowhere")), "a stage the board does not have is refused"
