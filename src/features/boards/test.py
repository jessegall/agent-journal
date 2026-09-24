import features
from controllers.types import CONTROLLERS, Messages, Questions
from features.boards.controller import START_OVER, Boards
from features.plans.controller import Plans
from features.sequences.controller import Sequences
from features.sequences.shipped import ship
from features.tickets.controller import Tickets
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh, refused
from tests.kit import Nudges, nudges, report


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
    more = boards.follow_up(board.n, "Also by mail")
    assert boards.load(board.n).drafting["asked"] == [made.ref, more.ref], "a follow-up joins the request, so a cancel covers it too"
    drafter = Tickets(record, actor=AGENT)
    kept, stray = (drafter.create(t, abstract=t, board=board.n, draft=True) for t in ("Share a link", "Invite by mail"))
    planner = Boards(record, actor=AGENT)
    planner.group(board.n, "First release", f"{kept.n}, #{stray.n}")
    planner.pick(board.n, str(stray.n))
    drafting = boards.load(board.n).drafting
    assert (drafting["groups"], drafting["picks"]["tickets"]) == ({"First release": [kept.n, stray.n]}, [stray.n]), \
        "the agent names groups of drafts and picks drafts for the user"
    assert "name drafts" in refused(lambda: planner.pick(board.n, "999")), "only drafts on the board are picked"
    Tickets(record, actor=USER).confirm(kept.n)
    boards.cancel(board.n)
    assert "since" not in boards.load(board.n).drafting, "cancel ends the session"
    assert [t.n for t in drafter._standing() if t.board == board.n] == [kept.n], "cancel deletes the drafts nobody added"
    assert not any(made.ref in key for s in Sequences(record, actor=USER).all(last=0) for key in s.runs), "cancel gives up the running sequence"
    assert "stop drafting" in refused(lambda: drafter.create("Late", abstract="Late", board=board.n, draft=True)), "a draft after cancel is refused"


def test_the_agent_says_how_many_drafts_are_coming():
    record = fresh()
    boards = Boards(record, actor=AGENT)
    board = boards.create("Shared Journal")
    assert boards.expect(board.n, "4").expected == 4, "the count shows as that many placeholders"
    assert "whole number" in refused(lambda: boards.expect(board.n, "a few")), "a count that is no number is refused in words"
    Boards(record, actor=USER).request(board.n, "Something else")
    assert boards.load(board.n).expected == 0, "a new request starts with no placeholders"


def test_a_board_is_built_from_a_document_and_removed_whole(tmp_path):
    features.load()
    record = fresh()
    ship(record)
    report(record, "working", "PreToolUse")
    boards = Boards(record, actor=USER)
    board = boards.create("roadmap", stages=[])
    assert "no document" in refused(lambda: boards.build(board.n)), "a board is built only from a document it holds"
    document = tmp_path / "roadmap.md"
    document.write_text("# Q4\n")
    boards.attach(board.n, str(document))
    building = boards.build(board.n, steer="five stages at most").building
    assert (building["document"], building["steer"], building["name_it"]) == ("roadmap.md", "five stages at most", True), \
        "the board remembers the document and the note, and that the agent names it"
    assert any(n.startswith("sequence ") and "Read the document" in n for n in nudges(record)), "the build starts its sequence"
    agent = Boards(record, actor=AGENT)
    agent.stage(board.n, "Shipped", "done")
    agent.log(board.n, "Made the stages from section 1")
    Tickets(record, actor=AGENT).create("CSV export", abstract="CSV export", board=board.n, stage="Shipped")
    assert agent.built(board.n, "1 stage, 1 ticket").building["log"][0]["text"] == "Made the stages from section 1"
    assert "not being built" in refused(lambda: agent.log(board.n, "Late")), "a finished build takes no more lines"
    boards.discard(board.n)
    assert not [t for t in Tickets(record, actor=USER)._standing() if t.board == board.n], "removing the board removes its tickets"
    assert not any(board.ref in key for s in Sequences(record, actor=USER).all(last=0) for key in s.runs), "and gives up the build"


def test_a_document_handed_to_new_work_starts_drafting_from_it(tmp_path):
    features.load()
    record = fresh()
    ship(record)
    report(record, "working", "PreToolUse")
    boards = Boards(record, actor=USER)
    board = boards.create("Product")
    assert "no file" in refused(lambda: boards.hand(board.n, "spec.md")), "only a document the board holds is handed over"
    spec = tmp_path / "spec.md"
    spec.write_text("# Invites\n")
    boards.attach(board.n, str(spec))
    made = boards.hand(board.n, "spec.md", "Only the first release", idempotency="panel-2")
    assert (made.data["document"], made.brief, boards.load(board.n).drafting["asked"]) == ("spec.md", "Only the first release", [made.ref]), \
        "the request carries its document and opens a drafting session the panel can cancel"
    assert any(n.startswith("sequence ") and "Read the document" in n for n in nudges(record)), "it starts drafting from the document"
    agent = Boards(record, actor=AGENT)
    agent.outline(board.n, "Background|Who can invite")
    agent.progress(board.n, "Who can invite", "read", drafts="2")
    assert [(part["title"], part["state"], part["drafts"]) for part in boards.load(board.n).drafting["outline"]] == \
        [("Background", "", 0), ("Who can invite", "read", 2)], "the panel lists the sections and how far the reading got"
    assert "no section" in refused(lambda: agent.progress(board.n, "Pricing", "now")), "only a section of the outline is marked"


def test_a_board_request_names_its_board_and_keeps_the_work_on_it():
    features.load()
    record = fresh()
    ship(record)
    report(record, "working", "PreToolUse")
    boards = Boards(record, actor=USER)
    Boards(record, actor=USER).create("Old board")
    board = boards.create("Shared Journal")
    boards.request(board.n, "I want to share")
    steps = [n.brief for n in Nudges(record).all() if n.title.startswith("sequence ")]
    assert any(f"journal board show {board.n}" in step and "<board n>" not in step for step in steps), "the step names the board it is about"
    assert "on its board" in refused(lambda: Plans(record, actor=AGENT).create("Sharing")), "no plan of its own while the board sequence runs"
    assert "on its board" in refused(lambda: Questions(record, actor=AGENT).create("Which one?")), "no chat question either"
    assert Boards(record, actor=AGENT).ask(board.n, "Which one?", options=[{"title": "A"}]).hidden, "the board's own question goes through"



def test_the_agent_s_text_stays_out_of_the_chat_while_a_board_sequence_runs():
    from engine import chat
    features.load()
    record = fresh()
    ship(record)
    report(record, "working", "PreToolUse")
    row = CONTROLLERS["agent"](record, actor=SYSTEM).by_session("claude-1")
    said = lambda: [m.brief for m in Messages(record, actor=SYSTEM).all() if m.seen[:1] == ["agent"]]
    chat.send(record, row, "Before the board")
    board = Boards(record, actor=USER).create("Shared Journal")
    Boards(record, actor=USER).request(board.n, "I want to share")
    chat.send(record, row, "Reading the board before I ask")
    assert said() == ["Before the board"], "while a board sequence runs, the agent's text stays in its panel, out of the chat"
