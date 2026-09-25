import features
import json

import pytest

from controllers.types import Messages, Questions
from features.ask_questions.choices import offers_choices
from resources.base import AGENT, USER, Refused
from tests.kit import idle, nudges
from tests.conftest import fresh, holds
from commands.http import dispatch


def test_offers_choices_recognizes_numbered_and_lettered_options_but_not_prose():
    assert offers_choices("Which do you want?\n1. the blue one\n2. the red one") is True, \
        "a numbered list with a question offers choices"
    assert offers_choices("Should I:\nA) merge now\nB) wait for CI") is True, "lettered options too"
    assert offers_choices("Done:\n- built\n- tested") is False, "a list that asks nothing is a list"
    assert offers_choices("Shall I merge it?") is False, "a question without options is fine"
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
    from engine.hooks import handle
    from providers import PROVIDERS
    record = fresh()
    asked = {"questions": [{"question": "Which store: files or SQLite?", "options": [{"label": "Files", "description": "as today"}, {"label": "SQLite"}]}]}
    result = handle(PROVIDERS["claude"](), record.root, record.env,
                    {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "AskUserQuestion", "tool_input": asked})
    question = Questions(record, actor=AGENT).all()[-1]
    assert (question.title, [o["title"] for o in question.data["options"]], question.seen[:1]) == \
        ("Which store - files or SQLite?", ["Files", "SQLite"], [AGENT]), "the question and its options are filed as the agent's"
    assert result.get("decision") == "block" and f"question {question.n}" in result.get("reason", ""), "the call is refused with the number"
    handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "claude-1", "agent_id": "sub-1",
                                                            "tool_name": "AskUserQuestion", "tool_input": {"questions": [{"question": "Keep the old parser?", "options": [{"label": "Yes"}, {"label": "No"}]}]}})
    assert Questions(record, actor=AGENT).all()[-1].title == "Keep the old parser?", "a subagent's question tool is filed in the journal too, where its parent and the orchestrator see it"


def test_an_answered_question_leaves_the_notifications_panel_and_marks_the_chat_on_the_users_side():
    from controllers.types import Agents
    from tests.kit import report
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    asked = Questions(record, actor=AGENT).create("which one?")
    Questions(record, actor=USER).set(asked.n, "kept", "true")
    Questions(record, actor=USER).complete(asked.n, how="this one")
    assert Questions(record, actor=USER).load(asked.n).data.get("kept") is False, "the answer takes it off the panel it was kept on"
    mark = Agents(record, actor=USER).primary().data["cards"][-1]
    assert (mark["label"], mark.get("name"), mark["side"]) == (f"You answered question {asked.n}", None, USER), \
        "the user's answer shows in the chat as a mark on their side, naming the question without the answer"


def test_a_question_keeps_who_answered_and_the_agent_must_say_why():
    from tests.conftest import refused
    record = fresh()
    ours = Questions(record, actor=AGENT).create("Which one?", options=[{"title": "Finish plan 1, keep to-do 20", "description": "", "code": ""}, {"title": "blue", "description": "", "code": ""}])
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
    assert asked.create("Release now or later", brief="The dashboard fault is still open; Release now ships it anyway.", options=options).n, \
        "a question whose text gives the context and leaves the options to their buttons is asked"
