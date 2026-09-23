import json
from datetime import datetime, timezone

from controllers.types import Agents, Messages, Nudges, Works
from engine.hooks import displayed, handle
from features.base import held
from engine.sessions import Sessions
from features.format import VIEWER, formatted
from providers import DRIVERS, PROVIDERS
from resources.base import AGENT, USER
from tests.conftest import fresh, holds, refused
from tests.kit import nudges, report


def test_a_read_message_is_named_back_until_the_agent_answers_it():
    record = fresh()
    Agents(record, actor=AGENT).by_session("claude-1")
    m = Messages(record, actor=USER).create("how is it going?")
    Messages(record, actor=AGENT).read(m.n)

    def text():
        return [n for n in nudges(record) if "before you write" in n]

    for i in range(9):
        report(record, "working", "PreToolUse")
    assert text() == [], "nothing is said while the message has waited fewer than ten tool uses"
    report(record, "working", "PreToolUse")
    assert text() == ["answer message 1 before you write anything"], \
        "the tenth tool use names the message and says to answer it"
    assert not holds(record).get("status"), "nothing is refused over it: it tells, it does not hold"
    from controllers.types import Nudges
    from engine.actors import settled
    from resources.base import Event
    line = [n for n in Nudges(record).all() if "before you write" in n.title][-1]
    queued = Event(id=0, type="nudge", n=line.n, action="created", actor="system", at=0.0, data={})
    assert settled(record, queued) is False, "while the message is open, the line still goes out"
    report(record, "idle", "Stop")
    assert len(text()) == 2, "an idle agent is told at once"
    for i in range(30):
        report(record, "working", "PreToolUse")
    assert len(text()) == 3, "said three times in all and then it lets the agent be"
    from controllers.types import Todos
    record.set_setting("features", {"messages.linking": False})
    filed = Todos(record, actor=AGENT).create("wire the last route")
    record.set_setting("features", {})
    Messages(record, actor=AGENT).reply(m.n, "halfway: the build is green, wiring the last route")
    report(record, "working", "PreToolUse")
    assert not holds(record).get("status"), "a reply settles it and lifts the hold"
    assert settled(record, queued) is True, "a line still queued about a message now answered is dropped, not sent late"
    assert f"todo:{filed.n}" in Messages(record).load(m.n).refs, "a to-do filed after reading the message and linked nowhere is linked to it when it is answered"


def test_unread_messages_are_nudged_with_growing_urgency_until_the_inbox_is_read():
    record = fresh()

    def gate():
        return holds(record).get("messages.unread", "")

    Works(record, actor=AGENT).create("something open")

    def inbox():
        return [n for n in nudges(record) if "inbox" in n]

    def use(n):
        report(record, "working", "PreToolUse", uses=n)

    use(1)
    assert inbox() == [], "nothing unread: nothing said"
    Messages(record, actor=USER).create("look at the header")
    use(2)
    assert inbox() == [], "one unread while the agent works: its own line already told it"
    for n in range(5):
        Messages(record, actor=USER).create(f"and this {n}")
    use(2)
    assert inbox() == ["there are new messages in your inbox"], \
        "more than five unread: told at once, without numbers"
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
    for n in range(1, 7):
        Messages(record, actor=AGENT).read(n)
    use(18)
    assert (gate(), len(inbox())) == ("", 6), "read: released, and nothing more is said"
    Messages(record, actor=USER).create("another")
    use(19)
    assert len(inbox()) == 6, "one new message while working: nothing said"
    report(record, "idle", "Stop", uses=19)
    assert (len(inbox()), gate()) == (7, ""), "once the agent is idle it is told"

    patient = fresh()
    patient.set_setting("messages", {"unread.patience": 0})
    Works(patient, actor=AGENT).create("open")
    for n in range(6):
        Messages(patient, actor=USER).create(f"hi {n}")
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
    displayed(record.root, {"session_id": "claude-1", "hook_event_name": "MessageDisplay", "message_id": "c", "index": 0, "final": False, "delta": "The summary "})
    handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "Stop", "session_id": "claude-1", "last_assistant_message": "The summary of the turn"})
    assert chat().count("The summary of the turn") == 1, "a message whose last pieces never came is sent whole when the turn stops"
    displayed(record.root, {"session_id": "claude-1", "hook_event_name": "MessageDisplay", "message_id": "c", "index": 1, "final": True, "delta": "of the turn"})
    assert chat().count("The summary of the turn") == 1 and "of the turn" not in chat(), "a piece arriving after that does not send it again"


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
    shown = formatted("run python3 journal.py --root .journal upgrade, or pass --why", record, VIEWER)
    assert shown.endswith(" --root .journal upgrade, or pass `--why`"), "a flag of another program and a .journal path stay plain text"


def test_a_reply_that_is_only_a_face_is_refused_and_points_at_react():
    asked = Messages(record := fresh(), actor="user").create("ship it?")
    assert "is a reaction: journal message react" in refused(lambda: Messages(record, actor="agent").reply(asked.n, "👍"))


def test_a_reaction_from_the_user_reaches_the_agent_as_what_it_is():
    from engine.actors import render
    from resources.base import Event
    asked = Messages(record := fresh(), actor="agent").create("ship it?")
    face = Messages(record, actor="user").react(asked.n, "👍")
    line, counted = render([Event(id=1, at=0.0, type="reaction", n=face.n, action="created", actor="user")], record)
    assert (line.startswith(f"the user put 👍 on message {asked.n} - act on it"), counted) == (True, {}), "a face and what to do with it, never a bare count"


def test_a_line_about_a_message_waits_for_the_driver_and_is_dropped_once_the_message_is_answered(monkeypatch):
    import time
    from engine.engine import Engine
    from providers import DRIVERS
    record = fresh()
    report(record, "working", "PreToolUse")
    engine = Engine(record, DRIVERS["claude"](record, "claude-1"))
    driver, delivered = engine.agent.driver, []
    monkeypatch.setattr(driver, "deliver", delivered.append)
    m = Messages(record, actor=USER).create("how is it going?")
    Messages(record, actor=AGENT).read(m.n)
    report(record, "working", "PreToolUse")
    driver.sent_at = time.time()
    engine.deliver()
    assert delivered == [], "the driver sent a line a moment ago: the next one waits with the engine"
    Messages(record, actor=AGENT).reply(m.n, "going well")
    driver.sent_at = 0
    driver.pump()
    engine.deliver()
    assert not any("before you write" in line for line in delivered), "answered in the meantime: the waiting line is dropped, not sent late"


def test_messages_between_agent_sessions_reach_the_chat_marked_with_the_other_session(tmp_path):
    from engine.engine import Engine
    record, transcript = fresh(), tmp_path / "s.jsonl"
    peer = {"type": "attachment", "timestamp": "2026-09-23T10:00:00Z", "attachment": {"type": "queued_command", "prompt": "<agent-message>the loop is fixed</agent-message>",
            "origin": {"kind": "peer", "from": "uds:/tmp/a.sock", "name": "other-project", "body": "the loop is fixed"}}}
    sent = {"type": "assistant", "timestamp": "2026-09-23T10:01:00Z",
            "message": {"content": [{"type": "tool_use", "id": "t1", "name": "SendMessage", "input": {"to": "uds:/tmp/a.sock", "message": "thanks, adopted"}}]}}
    transcript.write_text(json.dumps({"type": "user", "timestamp": "2026-09-23T09:00:00Z", "message": {"content": "go"}}) + "\n")
    report(record, "working", "PreToolUse", provider="claude", transcript=str(transcript))
    engine = Engine(record, DRIVERS["claude"](record, "claude-1"))
    engine.relay_peers()
    transcript.write_text(transcript.read_text() + json.dumps(peer) + "\n" + json.dumps(sent) + "\n")
    engine.relay_peers()
    rows = [(m.brief, m.data.get("peer"), m.data.get("sent_to")) for m in Messages(record, actor="system").all()]
    assert rows == [("the loop is fixed", "other-project", None), ("thanks, adopted", None, "other-project")], \
        "a message from another session is filed from it, and one sent to it is filed as sent to it, by name"
    codex = tmp_path / "c.jsonl"
    codex.write_text("".join(json.dumps({"type": "response_item", "timestamp": "2026-09-23T10:02:00Z", "payload": {"type": "message", "role": role,
                                                         "content": [{"type": kind, "text": text}]}}) + "\n"
                             for role, kind, text in (("user", "input_text", "go"), ("assistant", "output_text", "the response is complete"))))
    report(record, "working", "PreToolUse", session="codex-1", provider="codex", transcript=str(codex))
    Engine(record, DRIVERS["codex"](record, "codex-1")).relay_peers()
    assert all(hasattr(turn, "kind") for turn in PROVIDERS["codex"]().tail(codex)), "Codex's recent turns are parsed turns, as every provider's are"
    from engine.transcript import last_text
    assert last_text(record, Agents(record).by_session("codex-1")) == "the response is complete", "and its last words are read from them"


def test_an_event_carries_the_command_that_caused_it_so_a_read_is_not_an_update():
    record = fresh()
    n = Messages(record, actor=USER).create("hello").n
    agent = Messages(record, actor=AGENT)
    Messages(record, actor=USER).create("hello again")
    agent.read_all([n + 1])
    agent.action("read")(n)
    agent.action("react")(n, "👍")
    heard = [(e.type, e.action, e.data.get("by")) for e in record.events() if e.n == n or e.type == "reaction"]
    read = [e.data.get("by") for e in record.events() if e.type == "message" and e.action == "updated" and e.data.get("seen") == AGENT]
    assert read == ["read", "read"], f"a read from the viewer's read-all and from the command both say read: {read}"
    assert [by for t, _, by in heard if t == "reaction"] == [None], f"a row of another type saved inside the command is not stamped with it: {heard}"
