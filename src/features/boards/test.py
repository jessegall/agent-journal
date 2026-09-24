import features
from controllers.types import Questions
from features.boards.controller import START_OVER, Boards
from features.sequences.shipped import ship
from features.tickets.controller import Tickets
from resources.base import AGENT, USER
from tests.conftest import fresh, refused
from tests.kit import nudges, report


def test_a_board_question_is_seen_only_on_its_board():
    features.load()
    record = fresh()
    board = Boards(record, actor=USER).create("Shared Journal")
    asked = Boards(record, actor=AGENT).ask(board.n, "You want to build a shareable journal?", options=[{"title": "Others work in it"}])
    questions = Questions(record, actor=USER)
    assert (asked.hidden, asked.refs) == (True, [board.ref]), "a board question is about its board and hidden"
    assert asked.n not in [r.n for r in questions._standing()], "the Questions list and the waiting count leave it out"
    assert [q.n for q in Tickets(record, actor=USER).board(board.n)["questions"]] == [asked.n], "the board's own data carries it for New work"


def test_a_request_opens_a_session_that_cancel_closes():
    features.load()
    record = fresh()
    ship(record)
    report(record, "working", "PreToolUse")
    boards = Boards(record, actor=USER)
    board = boards.create("Shared Journal")
    stale = Boards(record, actor=AGENT).ask(board.n, "An old question?", options=[{"title": "A"}])
    made = boards.request(board.n, "I want to share", idempotency="panel-1")
    assert Questions(record, actor=USER).load(stale.n).outcome == START_OVER, "a new request answers the questions it replaces with Start over"
    drafting = boards.load(board.n).drafting
    assert (made.refs, drafting["idempotency"], drafting["since"]) == ([board.ref], "panel-1", made.created), \
        "the request is a message about the board, and the board remembers the session so the panel can resume it"
    assert any(n.startswith("sequence ") and "Understand the request" in n for n in nudges(record)), \
        "the request starts the board card sequence at its first step"
    boards.cancel(board.n)
    assert boards.load(board.n).drafting == {}, "cancel ends the session"


def test_the_agent_says_how_many_drafts_are_coming():
    record = fresh()
    boards = Boards(record, actor=AGENT)
    board = boards.create("Shared Journal")
    assert boards.expect(board.n, "4").expected == 4, "the count shows as that many placeholders"
    assert "whole number" in refused(lambda: boards.expect(board.n, "a few")), "a count that is no number is refused in words"
    Boards(record, actor=USER).request(board.n, "Something else")
    assert boards.load(board.n).expected == 0, "a new request starts with no placeholders"
