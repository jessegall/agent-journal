import json
from datetime import datetime, timezone

from controllers.types import Agents, Messages, Nudges, Works
from engine.hooks import displayed, gate_file, handle
from features.base import held
from engine.sessions import Sessions
from features.format import VIEWER, formatted
from providers import DRIVERS, PROVIDERS
from resources.base import AGENT, USER
from tests.conftest import fresh, refused
from tests.kit import nudges, report


def test_a_read_message_is_named_back_until_the_agent_answers_it():
    record = fresh()
    Agents(record, actor=AGENT).by_session("claude-1")
    m = Messages(record, actor=USER).create("how is it going?")
    Messages(record, actor=AGENT).read(m.n)

    def holds():
        f = gate_file(record.root, record.env, "claude-1")
        return json.loads(f.read_text()) if f.is_file() else {}

    def text():
        return [n for n in nudges(record) if "before you write" in n]

    assert text() == [], "before the next tool use nothing is said"
    report(record, "working", "PreToolUse")
    assert text() == ["answer message 1 before you write anything"], \
        "the first tool use after reading names the message and says to answer it"
    assert holds().get("status", "") == "", "nothing is refused over it: it tells, it does not hold"
    for i in range(5):
        report(record, "working", "PreToolUse")
    assert len(text()) == 3, "said three times in all and then it lets the agent be"
    Messages(record, actor=AGENT).reply(m.n, "halfway: the build is green, wiring the last route")
    report(record, "working", "PreToolUse")
    assert holds().get("status", "") == "", "a reply settles it and lifts the hold"


def test_unread_messages_are_nudged_with_growing_urgency_until_the_inbox_is_read():
    record = fresh()

    def gate():
        f = gate_file(record.root, record.env, "claude-1")
        return json.loads(f.read_text()).get("messages.unread", "") if f.is_file() else ""

    Works(record, actor=AGENT).create("something open")

    def inbox():
        return [n for n in nudges(record) if "inbox" in n]

    def use(n):
        report(record, "working", "PreToolUse", uses=n)

    use(1)
    assert inbox() == [], "nothing unread: nothing said"
    Messages(record, actor=USER).create("look at the header")
    use(2)
    assert inbox() == ["there are new messages in your inbox"], \
        "the first tool use after a message arrives: told at once, without numbers"
    use(3)
    use(4)
    assert len(inbox()) == 1, "then every third use"
    use(5)
    assert len(inbox()) == 2, "the third: told again"
    for n in range(6, 15):
        use(n)
    assert (len(inbox()), gate()) == (5, ""), "fifteen uses in: five nudges, still no hold"
    use(15)
    use(16)
    use(17)
    assert gate() == "your inbox is unread: journal message unread, then journal message read <n> for each, before any other write", \
        "the sixth nudge: the gate holds until the inbox is read"
    Messages(record, actor=AGENT).read(1)
    use(18)
    assert (gate(), len(inbox())) == ("", 6), "read: released, and nothing more is said"
    Messages(record, actor=USER).create("another")
    use(19)
    assert (len(inbox()), gate()) == (7, ""), "a new message: told at once again, the count starting over"

    patient = fresh()
    patient.set_setting("messages", {"unread.patience": 0})
    Works(patient, actor=AGENT).create("open")
    Messages(patient, actor=USER).create("hi")
    report(patient, "working", "PreToolUse", uses=3)
    report(patient, "working", "PreToolUse", uses=6)
    assert (held(patient, "claude-1") != "") is True, "patience is a setting"

    assert all(n.data.get("private") for n in Nudges(record).all() if "inbox" in n.title) is True, \
        "the inbox nudge is private"
    assert all(n.data.get("session") == "claude-1" for n in Nudges(record).all() if "inbox" in n.title) is True, \
        "the inbox nudge is meant for its own session, and the engine speaks it"
    provider = PROVIDERS["claude"]()
    assert handle(provider, record.root, record.env, {"hook_event_name": "PostToolUse", "session_id": "claude-1", "tool_name": "Read"}) == {}, \
        "the hook only reports; it hands nothing back"


def test_a_private_nudge_reaches_the_session_it_names_whichever_name_it_uses():
    from types import SimpleNamespace
    from engine.engine import Engine
    from providers import DRIVERS
    record = fresh()
    engine = Engine(record, DRIVERS["claude"](record, "claude-99"))
    engine.agent.driver.last_report = lambda: SimpleNamespace(title="claude-1")
    since = record.last_event()
    Nudges(record).create("for this session", session="claude-1", private=True)
    Nudges(record).create("for another", session="claude-2", private=True)
    received = {e.data.get("title") or e.n: engine.elsewhere(e) for e in record.events(since)}
    assert list(received.values()) == [False, True], "the terminal is claude-99 but the session is claude-1: its own nudge is spoken"


def test_messages_shown_at_once_arrive_whole_and_claude_is_read_from_its_display_hook_only(tmp_path):
    from engine.engine import Engine
    record, transcript, now = fresh(), tmp_path / "s.jsonl", datetime.now(timezone.utc).isoformat()
    transcript.write_text(json.dumps({"type": "user", "timestamp": now, "message": {"content": "go"}}) + "\n")
    report(record, "working", "PreToolUse", provider="claude", transcript=str(transcript))
    Sessions(record.root).bind("claude-1", record.env, provider="claude")
    for piece in ({"index": 0, "final": False, "delta": "first "}, {"message_id": "b", "index": 0, "final": True, "delta": "second"}, {"index": 1, "final": True, "delta": "whole"}):
        displayed(record.root, {"session_id": "claude-1", "hook_event_name": "MessageDisplay", "message_id": "a", **piece})
    chat = lambda: [m.brief for m in Messages(record, actor="system").all() if m.seen[:1] == ["agent"]]
    assert chat() == ["second", "first whole"], "a message that finishes never drops the pieces of one still being shown"
    engine = Engine(record, DRIVERS["claude"](record, "claude-1"))
    engine.tick()
    transcript.write_text(transcript.read_text() + json.dumps({"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": "only in the transcript"}]}}) + "\n")
    engine.tick()
    assert "only in the transcript" not in chat(), "Claude's messages come from its display hook alone"


def test_a_row_named_by_a_bare_number_is_named_back_with_its_type():
    from engine import chat
    record = fresh()
    report(record, "working", "PreToolUse")
    asked, filed = [Messages(record, actor="user").create(f"hi {i}") for i in range(2)][-1], Works(record, actor=AGENT).create("a job")
    chat.send(record, Agents(record, actor="system").by_session("claude-1"), f"Answered {asked.n}, parked {filed.n}, then work {filed.n}; the suite ({asked.n}) and \"finished {filed.n}\" pass")
    lines = [n for n in nudges(record) if "without saying what they are" in n]
    assert len(lines) == 1 and f"names {asked.n}, {filed.n} " in lines[0], "the bare numbers of real rows are named back, versions and counts are not"
    chat.send(record, Agents(record, actor="system").by_session("claude-1"), f"My reply to {asked.n} went through; parking {filed.n}, 2 revisions left, released 2.84.63")
    lines = [n for n in nudges(record) if "without saying what they are" in n]
    assert f"names {asked.n}, {filed.n} " in lines[-1], "any bare reference is named back, whatever word comes before it"
    from features.messages.handlers import bare
    assert bare(f"Two steps:\n{asked.n}. first\n{filed.n}) second") == [], "the numbers of a numbered list are not row numbers"
    assert bare(f"down from 980 loose files to {asked.n}; it waited {filed.n} before") == [], "a small number with no handling verb before it is a count"
    assert bare("a number under 250 is a count, and so is more than 300") == [], "a quantity word before a number makes it a count"
    assert formatted("a journal question with options; journal question ask", record, VIEWER) == "a journal question with options; `journal question ask`", "only a real command is code"
    assert formatted("run python3 journal.py --root .journal upgrade, or pass --why", record, VIEWER) == \
        "run python3 [[file journal.py|journal.py]] --root .journal upgrade, or pass `--why`", "a flag of another program and a .journal path stay plain text"


def test_a_reply_that_is_only_a_face_is_refused_and_points_at_react():
    asked = Messages(record := fresh(), actor="user").create("ship it?")
    assert "is a reaction: journal message react" in refused(lambda: Messages(record, actor="agent").reply(asked.n, "👍"))
