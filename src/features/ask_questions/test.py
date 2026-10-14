import features
import json

from controllers.types import Messages, Nudges, Questions
from resources.base import AGENT, SYSTEM, USER
from tests.kit import idle, nudges
from tests.conftest import fresh, holds
from commands.http import dispatch


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
    assert result.get("decision") == "block" and "asked in the journal" in result.get("reason", ""), "the call is refused and says the question is asked"
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
    from features.ask_questions.answers import answers_added
    assert answers_added([asked.n], record) == 'the user answered "which one?": wrote "this one"', "the line an agent is sent for a closed question carries what the user did to it"
    asking = Questions(record, actor=AGENT).create("which colour?", options=[{"title": "red"}, {"title": "blue"}], pick=1)
    Questions(record, actor=USER).complete(asking.n, how="red")
    back = Questions(record, actor=AGENT).create("which size?", options=[{"title": "S"}, {"title": "L"}], pick=1)
    Questions(record, actor=USER).complete(back.n, how="Is it already done, right?")
    mine = Questions(record, actor=AGENT).create("which font?", options=[{"title": "serif"}, {"title": "sans"}], pick=1)
    Questions(record, actor=AGENT).complete(mine.n, how="sans", reason="the user said sans earlier")
    assert (answers_added([asking.n], record), answers_added([back.n], record).endswith("so reply to the user"), answers_added([mine.n], record)) == \
        ('the user answered "which colour?": picked "red"', True, ""), \
        "a picked option is named by its title, free text that asks something back says a reply is owed, and an answer the agent gave itself adds nothing"
    from providers import DRIVERS
    assert (b"Entertoselect" in DRIVERS["claude"].ASKING, hasattr(DRIVERS["claude"], "answer_prompt")) == (True, True), \
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


def test_a_row_can_carry_a_field_named_context():

    record = fresh()
    options = [{"title": "the blue one", "description": "", "code": ""}, {"title": "the red one", "description": "", "code": ""}]
    question = Questions(record, actor=AGENT).create("Which one?", options=options, pick=1, context="42")
    assert question.data["context"] == "42", "an action interceptor does not take the row's field for its own context"
