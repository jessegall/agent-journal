
from controllers.types import Agents, Nudges, Facts, Reminders
from engine import chat
from engine.hooks import handle
from features import load
from providers import PROVIDERS
from resources.base import AGENT, SYSTEM, USER
from tests.kit import nudges, report
from tests.conftest import fresh


def test_standing_pins_are_repeated_at_the_first_tenth_and_superseding_or_promoting_strikes_the_old():
    record = fresh()
    pins = Facts(record, actor=AGENT)
    pins.create("the hook payload carries the parent's session id", keywords="word", brief="measured on 2026-09-01")
    pins.create("tests run bounded", keywords="word")
    report(record, "working", "PostToolUse", context=10)
    assert (nudges(record), Nudges(record).load(1).brief) == \
        (["2 facts standing, read them"], "1. the hook payload carries the parent's session id; 2. tests run bounded"), \
        "said at the first tenth"
    report(record, "working", "PostToolUse", context=14)
    assert len(nudges(record)) == 1, "not again inside the same tenth"

    newer = pins.create("the hook payload carries the parent session id; only agent_id tells it apart", keywords="word", supersedes=1)
    assert (pins.load(1).outcome, newer.refs) == ("superseded by fact 3", ["fact:1"]), \
        "superseded: the old is struck, saying by which, and the new links it"
    rule = pins.promote(2)
    assert (rule.type, rule.title, pins.load(2).outcome) == ("rule", "tests run bounded", "promoted to rule 1"), \
        "promoted: a rule with the pin's words, the pin struck"
    Reminders(record, actor=USER).create("run the suites first", until="the suites are green on CI")
    assert Reminders(record).load(1).data["until"] == "the suites are green on CI", "a reminder keeps its until"


def test_a_keyword_matches_as_a_whole_word_only_where_its_row_says():
    load()
    record = fresh()
    report(record, "working", "PreToolUse")
    facts = Facts(record, actor=USER)
    ran, wrote = (facts.create(title, keywords="said", keywords_in=scope) for title, scope in (("in commands", "commands"), ("in text", "text")))
    hook = lambda **tool: handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "claude-1", **tool})
    hook(tool_name="Bash", tool_input={"command": "grep -rn unsaid ."})
    assert not [n for n in Nudges(record).all() if n.title.startswith("fact ")], "a keyword inside another word does not match"
    hook(tool_name="Bash", tool_input={"command": "grep -rn said ."})
    hook(tool_name="Edit", tool_input={"file_path": "said.py", "new_string": "x = 1"})
    chat.send(record, Agents(record, actor=SYSTEM).by_session("claude-1"), "I said so")
    whispered = [n.title.split(" — ")[0] for n in Nudges(record).all() if n.title.startswith("fact ")]
    assert whispered == [f"fact {ran.n}", f"fact {wrote.n}"], "a whole word in a command, then in chat; not inside 'unsaid', not in a file path"
    shown = [(w["ref"], w["title"]) for w in Agents(record, actor=SYSTEM).by_session("claude-1").data.get("whispers") or []]
    assert shown == [(ran.ref, "in commands"), (wrote.ref, "in text")], f"each reminder is kept on the agent for the chat to show: {shown}"


def test_dismissing_a_fact_from_the_rail_is_not_told_to_the_agent_but_editing_it_is():
    from engine.engine import Engine
    from providers import DRIVERS
    load()
    record = fresh()
    report(record, "working", "PostToolUse")
    engine = Engine(record, DRIVERS["claude"](record, "claude-1"))
    n = Facts(record, actor=AGENT).create("the server reloads itself", keywords="server").n
    engine.deliver()
    told, notify = [], engine.agent.notify
    engine.agent.notify = lambda event: (told.append(event.data.get("fields")), notify(event))
    user = Facts(record, actor=USER)
    user.set(n, "kept", "false")
    user.read(n)
    engine.deliver()
    assert told == [], f"a dismissal only shapes the user's own rail: {told}"
    user.update(n, brief="it re-execs on a .py change")
    engine.deliver()
    assert told == [["brief"]], f"a real edit by the user still reaches the agent: {told}"
