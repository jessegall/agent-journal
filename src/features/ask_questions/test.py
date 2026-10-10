import features
import json

import pytest

from controllers.types import Messages, Nudges, Questions
from features.ask_questions.choices import offers_choices
from resources.base import AGENT, SYSTEM, USER, Refused
from tests.kit import idle, nudges
from tests.conftest import fresh, holds
from commands.http import dispatch


def test_offers_choices_recognizes_numbered_and_lettered_options_but_not_prose():
    assert offers_choices("Which do you want?\n1. the blue one\n2. the red one") is True, \
        "a numbered list with a question offers choices"
    assert offers_choices("Should I:\nA) merge now\nB) wait for CI") is True, "lettered options too"
    assert offers_choices("Done:\n- built\n- tested") is False, "a list that asks nothing is a list"
    assert offers_choices("Shall I merge it?") is False, "a question without options is fine"
    assert offers_choices("Wil je liever:\n1. één lange gids\n2. een pagina per onderwerp") is True, "options under a Dutch question are choices too"
    assert offers_choices("Done:\n- built the route\n- tested it\n\nQuestion 15 is still open: should the server answer first?") is False, \
        "a summary that points at an open question by number is not offering choices"
    assert offers_choices("Done:\n- the engine can see which step is running\n- the band is taller") is False, \
        "a statement that uses 'which' asks nothing"
    assert offers_choices("Two ways:\n1. blue\n2. red\nLet me know.") is True, \
        "a list and a phrase addressed to the user still offers choices"
    assert offers_choices("See question 3.\nWhich do you want?\n1. blue\n2. red") is True, "choices beside a named question still count"
    assert offers_choices("Questions 60-63 are yours in the viewer:\n- 60, where it lives?\n- 61, what Doing does?") is False, \
        "lines naming questions already asked, in the plural, do not count"
    assert offers_choices("I asked \"is there an agent?\" and:\n- one\n- two") is False, "a question inside quotes is not asked"
    assert offers_choices("**Did the hook fire?** I checked.\n\n- **Does it fire?** Yes, for every real message, and the server passed each one on to the chat, whole.\n"
                          "- **Why some went missing:** they were written into hidden thinking, never as messages at all.") is False, \
        "a summary answering questions in long points offers no choices"
    assert offers_choices("Status:\n- built the page\n- tested it\n\nDesign: https://claude.ai/design/p/abc?file=X") is False, "a question mark inside a link asks nothing"
    assert offers_choices("I found two ways.\n\n- keep it\n- drop it\n\nWhich do you prefer?") is True, "a closing question after the options still counts"


def test_choices_offered_in_prose_hold_writes_until_a_question_is_asked_properly():
    record = fresh()
    transcript = record.root / "runtime" / "t.jsonl"
    transcript.parent.mkdir(parents=True, exist_ok=True)

    def text(text):
        transcript.write_text(json.dumps({"type": "assistant", "message": {"role": "assistant", "content": [{"type": "text", "text": text}]}}) + "\n")

    text("[!reply] Which do you want?\n1. the blue one\n2. the red one")
    idle(record, provider="claude", transcript=str(transcript))
    assert ([n for n in nudges(record) if "choices in prose" in n], bool(holds(record).get("ask_questions.asking"))) == \
        (["your last message offers choices in prose"], True), "choices in prose: the agent is told once, and its writes are held"
    Questions(record, actor=AGENT).create("Which one?", options=[{"title": "the blue one", "description": "", "code": ""}, {"title": "the red one", "description": "", "code": ""}], pick=1)
    assert not holds(record).get("ask_questions.asking"), "a question asked properly lifts the hold"
    text("[!reply] Which do you want?\n1. the blue one\n2. the red one")
    idle(record, provider="claude", transcript=str(transcript))
    Messages(record, actor=USER).create("the blue one, thanks")
    assert not holds(record).get("ask_questions.asking"), "an answer by message lifts it too"


def test_a_picked_answer_is_held_for_a_configurable_duration():
    record = fresh("main")
    questions = features.FEATURES["ask_questions"]
    assert questions.values(record).hold == 3, "a picked answer is held for three seconds by default"
    assert (questions.describe()["fixed"], questions.enabled(record)) == (True, True), "the feature cannot be switched off"

    record.set_setting("ask_questions", {"hold": 8})
    assert questions.values(record).hold == 8, "a setting says how long instead"

    got = dispatch("GET", "/api/main/settings", record.root, {}, {})
    assert (got.code, got.body["ask_questions"]["hold"]) == (200, 8), "the viewer is handed the hold with the rest of the settings"
    saved = dispatch("POST", "/api/main/settings", record.root, {}, {"ask_questions": {"hold": 1}})
    assert (saved.code, saved.body["ask_questions"]["hold"]) == (200, 1), "and can set it"


def test_a_question_tool_is_asked_in_the_journal_and_never_opens_in_the_terminal():
    from runner.hooks import handle
    from providers import PROVIDERS
    record = fresh()
    unpicked = {"questions": [{"question": "Which store: files or SQLite?", "options": [{"label": "Files", "description": "as today"}, {"label": "SQLite"}]}]}
    refused = handle(PROVIDERS["claude"](), record.root, record.env,
                     {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "AskUserQuestion", "tool_input": unpicked})
    assert (Questions(record, actor=AGENT).all(), "names no pick" in refused.get("reason", "")) == ([], True), \
        "a question with no option marked (Recommended) is turned back unasked, to name the agent's pick"
    asked = {"questions": [{"question": "Which store: files or SQLite?", "options": [{"label": "Files (Recommended)", "description": "as today"}, {"label": "SQLite"}]}]}
    result = handle(PROVIDERS["claude"](), record.root, record.env,
                    {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "AskUserQuestion", "tool_input": asked})
    question = Questions(record, actor=AGENT).all()[-1]
    assert (question.title, [o["title"] for o in question.data["options"]], question.data["pick"], question.seen[:1]) == \
        ("Which store - files or SQLite?", ["Files", "SQLite"], 1, [AGENT]), "the question, its options and the recommended one as the agent's pick"
    assert result.get("decision") == "block" and f"question {question.n}" in result.get("reason", ""), "the call is refused with the number"
    passed = handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "claude-1", "agent_id": "sub-1",
                                                                     "tool_name": "AskUserQuestion", "tool_input": {"questions": [{"question": "Keep the old parser?", "options": [{"label": "Yes"}, {"label": "No"}]}]}})
    assert (passed.get("decision"), Questions(record, actor=AGENT).all()[-1].title) == (None, "Which store - files or SQLite?"), \
        "a subagent gets no journal guard: its question tool is left to it"
    handle(PROVIDERS["codex"](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "codex-1", "tool_name": "request_user_input_async",
                                                           "tool_input": {"questions": [{"title": "Which port?", "options": ["8080 (Recommended)", "9090"]}]}})
    question = Questions(record, actor=AGENT).all()[-1]
    assert (question.title, [o["title"] for o in question.data["options"]]) == ("Which port?", ["8080", "9090"]), "Codex's async question with plain options is filed too"


def test_an_answered_question_leaves_the_notifications_panel_and_marks_the_chat_on_the_users_side():
    from controllers.types import Agents
    from tests.kit import report
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    asked = Questions(record, actor=AGENT).create("which one?", options=[{"title": "A"}, {"title": "B"}], pick=1)
    Questions(record, actor=USER).set(asked.n, "kept", "true")
    Questions(record, actor=USER).complete(asked.n, how="this one")
    assert Questions(record, actor=USER).load(asked.n).data.get("kept") is False, "the answer takes it off the panel it was kept on"
    mark = Agents(record, actor=USER).primary().data["cards"][-1]
    assert (mark["label"], mark.get("name"), mark["side"]) == (f"You answered question {asked.n}", None, USER), \
        "the user's answer shows in the chat as a mark on their side, naming the question without the answer"
    answered, = [n for n in Nudges(record, actor=SYSTEM).all() if n.title == f"question {asked.n} is answered - act on the answer"]
    assert ("this one" in answered.brief, "work.created" in answered.until) == (True, True), \
        "the agent is told to act on the answer, and told again until it starts, logs or ends work"
    from types import SimpleNamespace
    from features.ask_questions import handlers
    pressed = []
    with pytest.MonkeyPatch.context() as patch:
        patch.setattr(handlers, "driver_in", lambda *given: SimpleNamespace(answer_prompt=lambda option, text, options: pressed.append((option, text, options))))
        second = Questions(record, actor=AGENT).create("which now?", options=[{"title": "A"}, {"title": "B"}], pick=1)
        Questions(record, actor=USER).complete(second.n, how="B")
        third = Questions(record, actor=AGENT).create("what name?", free="name")
        Questions(record, actor=USER).complete(third.n, how="Rhea")
    assert pressed == [(2, "B", 2), (0, "Rhea", 0)], \
        "an answer is pressed into the question the agent stands at on its screen: the option's number, or the words in the free choice"
    from providers import DRIVERS
    assert (b"Entertoselect" in DRIVERS["claude"].ASKING, hasattr(DRIVERS["claude"], "answer_prompt")), \
        "Claude's own question prompt is seen on its screen, and every driver can answer one"


def test_a_question_keeps_who_answered_and_the_agent_must_say_why():
    from tests.conftest import refused
    record = fresh()
    ours = Questions(record, actor=AGENT).create("Which one?", options=[{"title": "Finish plan 1, keep to-do 20", "description": "", "code": ""}, {"title": "blue", "description": "", "code": ""}], pick=2)
    assert "say why" in refused(lambda: Questions(record, actor=AGENT).complete(ours.n, how="blue")), "the agent may not answer silently"
    answered = Questions(record, actor=AGENT).complete(ours.n, how="blue", reason="the user said blue earlier")
    assert (answered.data["answered_by"], answered.data["reason"], answered.data["chosen"]) == (AGENT, "the user said blue earlier", 2), \
        "who answered, why, and which option by its number"
    assert Questions(record, actor=USER).set(ours.n, "outcome", "something else").data["chosen"] == 0, "an answer in other words chose no option"
    assert Questions(record, actor=USER).set(ours.n, "outcome", "Finish plan 1, keep to-do 20").data["chosen"] == 1, \
        "a title that names rows is still matched, before the chips are added for the viewer"
    theirs = Questions(record, actor=AGENT).create("Ship it?")
    assert Questions(record, actor=USER).complete(theirs.n, how="yes").data["answered_by"] == USER, "the user needs no reason"


def test_a_question_that_lists_its_options_again_in_its_text_is_refused():
    features.load()
    record = fresh()
    options = [{"title": "Release now", "text": "Push and tag."}, {"title": "Fix first", "text": "Work the fault first."}]
    asked = Questions(record, actor=AGENT)
    with pytest.raises(Refused):
        asked.create("Release now or later", brief="Two ways:\nA: release it now\nB: fix the fault first", options=options)
    with pytest.raises(Refused):
        asked.create("Release now or later", brief="The fault is open.\n- Release now: push and tag\n- Fix first: work the fault", options=options)
    with pytest.raises(Refused):
        asked.create("Release now or later", brief="The dashboard fault is still open; Release now ships it anyway.", options=options)
    assert asked.create("Release now or later", brief="The dashboard fault is still open; Release now ships it anyway.", options=options, pick=2).n, \
        "a question whose text gives the context, leaves the options to their buttons and names the agent's pick is asked"


def test_a_row_waits_on_one_question_and_the_user_can_dismiss_it():
    from controllers.types import Todos
    from tests.conftest import refused
    record = fresh()
    row = Todos(record, actor=AGENT).create("Release it")
    assert "answers you can list" in refused(lambda: Todos(record, actor=AGENT).ask(row.n, "Release now or hold?")), \
        "a question whose answers can be listed is refused without its options"
    first = Todos(record, actor=AGENT).ask(row.n, "Release now or hold?", options=[{"title": "Release now"}, {"title": "Hold"}], pick=2)
    assert f"question {first.n}" in refused(lambda: Questions(record, actor=AGENT).create("Release now?", about=row.ref)), \
        "a second question on the same row is refused and names the one it waits on"
    dismissed = Questions(record, actor=USER).dismiss(first.n, why="already released")
    assert (bool(dismissed.completed), dismissed.data["dismissed"], dismissed.data["reason"]) == (True, True, "already released"), \
        "a dismissal closes the question with the user's reason"
    assert "not asked again" in dismissed.outcome, "the agent hears it is not to act on it or ask again"
    asking = Questions(record, actor=AGENT)
    assert ("answers you can list" in refused(lambda: asking.create("Has the client agreed to the data access?")),
            "answers you can list" in refused(lambda: asking.create("Which package does the client have?"))) == (True, True), \
        "a yes or no and a which are asked with their options"
    assert asking.create("What is the client's billing address?").n and asking.create("Which administrations does the client keep?", free="description").n, \
        "a free question is asked open, and one that only looks listable says it is free"
    assert Todos(record, actor=AGENT).ask(row.n, "Tag it as 5.2?").n, "once it is closed the row may ask again"
    open_one = Questions(record, actor=AGENT).create("Which port should the viewer use?", options=[{"title": "8421"}, {"title": "8422"}], pick=1)
    assert f"question {open_one.n} already asks this" in refused(lambda: Questions(record, actor=AGENT).create("Which port should the viewer use?", options=[{"title": "8421"}, {"title": "8422"}], pick=1)), \
        "the same question, still open, is never asked twice"
    from runner.hooks import handle
    from providers import PROVIDERS

    def shell(command):
        return handle(PROVIDERS["claude"](), record.root, record.env,
                      {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "Bash", "tool_input": {"command": command}}).get("reason", "")

    asking = 'journal question ask "Ship it?" --set options=\'["Yes","No"]\' --set pick=1'
    codex = lambda command: handle(PROVIDERS["codex"](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "codex-1", "tool_name": "exec_command",
                                                                                    "tool_input": {"cmd": command}}).get("reason", "")
    assert "command of its own" in codex(f"journal todo create x && {asking}"), "a Codex agent asks a question on its own too"
    assert ("command of its own" in shell(f"journal todo create x; {asking}"), "command of its own" in shell(f"{asking} | grep x"), "command of its own" in shell(asking)) == \
        (True, True, False), "a question is asked on its own, never chained or piped with other commands"
    mention = "journal todo create x --brief 'later: journal question ask now' && journal todo list"
    assert "command of its own" not in shell(mention), "a question command quoted inside an argument is only text, not a question"


def test_a_question_is_dismissed_when_its_row_closes_and_asked_about_after_a_day():
    from controllers.types import Todos
    from tests.kit import report, tick
    record = fresh()
    report(record, "idle", "Stop")
    todos, questions = Todos(record, actor=AGENT), Questions(record, actor=AGENT)
    row = todos.create("the pricing")
    asked = questions.create("Which price, 5 or 7?", about=row.ref, options=[{"title": "5"}, {"title": "7"}], pick=1)
    other = questions.create("Which font for the menu?", options=[{"title": "Serif"}, {"title": "Sans"}], pick=1)
    todos.complete(row.n, how="the price came from the supplier's list")
    assert (questions.load(asked.n).completed > 0, questions.load(asked.n).data.get("dismissed"), questions.load(other.n).completed) == (True, True, 0.0), \
        "closing the row a question is about dismisses it, and leaves the others"
    gone = todos.create("the colour")
    about_gone = questions.create("Which colour?", about=gone.ref, options=[{"title": "Blue"}, {"title": "Red"}], pick=1)
    todos.delete(gone.n, "not needed")
    assert questions.load(about_gone.n).data.get("dismissed") is True, "deleting the row a question is about dismisses it too"
    old = questions.load(other.n)
    old.created = 1.0
    questions.save(old, "updated")
    tick(record)
    assert [n for n in nudges(record) if "waited a day" in n] == [f"question {other.n}, Which font for the menu?, has waited a day for an answer"], \
        "a question open for a day is put to the agent, to dismiss if the work settled it"


def test_a_row_can_carry_a_field_named_context_and_old_answered_and_board_questions_are_tidied_by_upgrades():
    from migrations.m0016_answered_questions_leave_the_panel import run as leave_panel
    from migrations.m0027_board_questions_hidden import run as hide_board_questions

    record = fresh()
    options = [{"title": "the blue one", "description": "", "code": ""}, {"title": "the red one", "description": "", "code": ""}]
    question = Questions(record, actor=AGENT).create("Which one?", options=options, pick=1, context="42")
    assert question.data["context"] == "42", "an action interceptor does not take the row's field for its own context"
    answered = Questions(record, actor=AGENT).create("Answered once?", options=options, pick=1)
    Questions(record, actor=USER).complete(answered.n, how="yes")
    Questions(record, actor=AGENT).stamp(answered.n, kept=True)
    assert leave_panel(record.root) == "1 answered questions taken off the notifications panel", "an answered question still kept on the panel is taken off"
    assert leave_panel(record.root) == "0 answered questions taken off the notifications panel", "one already taken off is left alone"
    about_board = Questions(record, actor=AGENT).create("Which stage?", about="board:1", options=[{"title": "Plan"}, {"title": "Build"}], pick=1)
    assert hide_board_questions(record.root) == [about_board.ref], "a question about a board is hidden from the general list"
    assert hide_board_questions(record.root) == [], "a hidden question is not hidden twice"
