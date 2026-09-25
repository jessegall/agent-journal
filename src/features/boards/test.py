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
    assert any("waits for the board-filler" in n for n in nudges(record)) and not any(n.startswith("sequence ") for n in nudges(record)), \
        "the request is handed to the board-filler: the main agent is told to dispatch it, never handed the steps itself"
    exploring = next(s for s in Sequences(record, actor=SYSTEM).all() if s.title == "Exploring a request")
    filler = Sequences(record, actor=AGENT, agent="board-filler")
    filler.follow(exploring.n, about=made.ref)
    assert list(filler.load(exploring.n).runs.values())[0]["agent"] == "board-filler" and Sequences(record, actor=AGENT)._in_hand() is None, \
        "the filler's run is its own: the main agent never has it in hand"
    asked = Boards(record, actor=AGENT, agent="board-filler").ask(board.n, "Which goal?", options=[{"title": "A"}, {"title": "B"}])
    before = sum("board-filler" in n for n in nudges(record))
    Questions(record, actor=USER).complete(asked.n, how="A")
    assert sum("board-filler" in n for n in nudges(record)) == before + 1, "the user's answer asks the main agent to dispatch the filler again"
    Boards(record, actor=AGENT, agent="board-filler").stall(board.n, "the document would not open")
    assert boards.load(board.n).drafting["phase"] == "stalled", "the filler can say it cannot go on"
    boards.retry(board.n)
    assert (boards.load(board.n).drafting["phase"], sum("board-filler" in n for n in nudges(record))) == ("exploring", before + 2), \
        "Retry puts the board back where it stalled and asks for the filler again"
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
    assert "at least 6" in refused(lambda: boards.expect(board.n, "4")), "a board is filled with at least 6 cards"
    assert boards.expect(board.n, "4", fewer="the document holds four pieces").expected == 4, \
        "fewer is allowed with a reason, and the count shows as that many placeholders"
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
    assert any("waits for the board-filler" in n for n in nudges(record)), "drafting from the document is handed to the board-filler"
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
    briefs = [n.brief for n in Nudges(record).all() if "board-filler" in n.title]
    assert any(f"You fill board {board.n}" in brief for brief in briefs), "the dispatch names the board the filler fills"
    assert "on its board" in refused(lambda: Plans(record, actor=AGENT, agent="board-filler").create("Sharing")), \
        "the board-filler makes no plan of its own: its work goes on the board"
    assert "on its board" in refused(lambda: Questions(record, actor=AGENT, agent="board-filler").create("Which one?")), "no chat question either"
    assert Boards(record, actor=AGENT).ask(board.n, "Which one?", options=[{"title": "A"}]).hidden, "the board's own question goes through"


def test_the_agent_answers_in_the_new_work_panel_with_board_say():
    features.load()
    record = fresh()
    ship(record)
    report(record, "working", "PreToolUse")
    boards = Boards(record, actor=USER)
    board = boards.create("Shared Journal")
    made = boards.request(board.n, "I want to share")
    agent = Boards(record, actor=AGENT)
    agent.say(board.n, "Three tickets drafted. Pick the ones to keep.")
    assert [c.brief for c in Messages(record, actor=USER).comments(made.n)] == ["Three tickets drafted. Pick the ones to keep."], \
        "a board say line lands on the request, where the New work panel shows it"
    assert "short line" in refused(lambda: agent.say(board.n, "x" * 300)), "the panel takes one short line"


def test_added_cards_make_the_agent_offer_to_place_them():
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    board = Boards(record, actor=USER).create("Refactor To Go")
    Boards(record, actor=USER).update(board.n, goal="The tool runs in Go", done_when=["It builds", "Its tests pass"])
    tickets = Tickets(record, actor=AGENT)
    first, second = tickets.create("Port the core", board=board.n, covers=[1]), tickets.create("Port the CLI", board=board.n, covers=[1])
    Boards(record, actor=USER).added(board.n, f"{first.n}, {second.n}")
    told = next(n for n in Nudges(record).all() if n.title.startswith("the user added 2 cards to board"))
    assert '"action": "start"' in told.brief and "Its tests pass" in told.brief and "It builds" not in told.brief.split("miss")[-1], \
        "the agent offers Play for the added cards and names the clause no kept card covers"


def test_the_agent_scores_its_understanding_and_drafting_starts_at_four():
    features.load()
    record = fresh()
    ship(record)
    report(record, "working", "PreToolUse")
    boards, agent = Boards(record, actor=USER), Boards(record, actor=AGENT)
    board = boards.create("Shared Journal")
    boards.request(board.n, "I want to share")
    assert "1 to 5" in refused(lambda: agent.score(board.n, "7")), "a score is 1 to 5"
    agent.score(board.n, "2", reading="You want people signed in before they can edit")
    drafting = boards.load(board.n).drafting
    assert (drafting["phase"], drafting["score"], drafting["turns"]) == ("exploring", 2, 1), "the score and the turn are kept on the board"
    assert drafting["reading"] == "You want people signed in before they can edit", "the agent's one-line reading is kept for the panel"
    agent.score(board.n, "3", goal="Only signed-in people edit", done="A visitor can read|Editing asks to sign in")
    kept = boards.load(board.n)
    assert (kept.goal, kept.done_when) == ("Only signed-in people edit", ["A visitor can read", "Editing asks to sign in"]), \
        "the goal and its numbered clauses are kept on the board, not in the drafting state"
    boards.update(board.n, started=1.0)
    agent.score(board.n, "3", done="Sessions expire after a day")
    assert boards.load(board.n).done_when[-1] == "Sessions expire after a day" and len(boards.load(board.n).done_when) == 3, \
        "a request on a started board adds clauses instead of replacing the goal"
    from engine.hooks import handle
    from features.boards.agent_types import written
    from providers import PROVIDERS
    (record.root.parent / ".claude").mkdir(exist_ok=True)
    record.set_setting("boards", {"filler_model": "haiku"})
    files = {f.stem: f.read_text() for f in written(record.root.parent, record) if f.suffix == ".md"}
    assert set(files) == {"board-filler", "ticket-reviewer", "plan-reviewer", "goal-verifier"} and "model: haiku" in files["board-filler"], \
        "the four agent types are written for Claude, the filler with the model Settings chose"
    call = lambda command: {"session_id": "claude-1", "agent_id": "sub-1", "agent_type": "board-filler", "tool_name": "Bash",
                            "tool_input": {"command": command}, "hook_event_name": "PreToolUse"}
    said = lambda command: str(handle(PROVIDERS["claude"](), record.root, record.env, call(command)).get("reason") or "")
    assert "board-filler may only" in said("git status") and "board-filler may only" not in said(f"journal board show {board.n}"), \
        "the board-filler is refused anything but the board-filling journal commands"
    exploring = next(s for s in Sequences(record, actor=SYSTEM).all() if s.title == "Exploring a request")
    assert [run["step"] for run in exploring.runs.values()] == [4] and exploring.sections[3]["title"] == "Say what done means (score 3)", \
        "the score moves the filler's run to the step for it"
    agent.score(board.n, "4")
    at = [run["step"] for run in Sequences(record, actor=SYSTEM).load(exploring.n).runs.values()]
    assert boards.load(board.n).drafting["phase"] == "exploring" and at == [5], \
        "at four it may choose the first slice first"
    agent.score(board.n, "5")
    assert boards.load(board.n).drafting["phase"] == "drafting", "at five it moves on"
    drafting = next(s for s in Sequences(record, actor=SYSTEM).all() if s.title == "Drafting the board's cards")
    assert [run["step"] for run in drafting.runs.values()] == [1], "and the drafting sequence starts, for the board-filler to follow"
    assert "past exploring" in refused(lambda: agent.score(board.n, "3")), "no more scores once drafting"
    agent.expect(board.n, "2", fewer="a two-card test")
    Tickets(record, actor=AGENT).create("Share a link", abstract="Share a link", board=board.n, draft=True)
    assert "draft the rest" in refused(lambda: agent.say(board.n, "Done.")), "it cannot finish with fewer cards than it guessed"
    boards.request(board.n, "Something vague")
    for _ in range(5):
        agent.score(board.n, "1")
    drafting = boards.load(board.n).drafting
    assert (drafting["phase"], drafting["score"], drafting["turns"]) == ("lost", 0, 5), "five turns below four: it gives up and the score resets"


def test_starting_a_board_starts_its_orchestration(monkeypatch):
    from features.sequences.shipped import ship
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    ship(record)
    board = Boards(record, actor=USER).create("Rewrite", stages=["Doing", "Done"])
    Boards(record, actor=USER).start(board.n)
    assert any("Orchestrating a board, step 1 of 5 - Tell the user" in line for line in nudges(record)), nudges(record)
    assert Boards(record, actor=USER).load(board.n).started, "the board remembers when Play was pressed"
    Boards(record, actor=USER).pause(board.n)
    assert any("Pausing a board, step 1 of 1" in line for line in nudges(record)), "pausing hands the orchestrator the pause"
    Boards(record, actor=USER).resume(board.n)
    assert any("Resuming a board, step 1 of 1" in line for line in nudges(record)), "resuming hands it the restart of the halted tickets"
    monkeypatch.setattr(Tickets, "tell", lambda self, n, note: self.load(int(n)))
    tickets = Tickets(record, actor=AGENT)
    first, second = tickets.create("Port the core", board=board.n), tickets.create("Port the CLI", board=board.n)
    tickets.send_back(first.n, "the tests fail")
    assert not any("Escalating a ticket" in line for line in nudges(record)), "one return is not yet escalated"
    tickets.send_back(first.n, "the tests still fail")
    assert any("Escalating a ticket, step 1 of 3" in line for line in nudges(record)), "a ticket sent back twice is escalated to the user"
    tickets.complete(first.n, how="merged", yes=True)
    assert not Boards(record, actor=USER).load(board.n).finished, "the board runs on while a ticket is open"
    tickets.complete(second.n, how="merged", yes=True)
    assert Boards(record, actor=USER).load(board.n).finished and any("Closing a board, step 1 of 3" in line for line in nudges(record)), \
        "the last ticket closing finishes the board and starts closing it"
