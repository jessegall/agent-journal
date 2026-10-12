import json
import threading
import time
from datetime import datetime, timezone

from controllers.types import Agents, Messages, Nudges, Works
from providers.payload import Chunk
from features.dev_faults.diagnostics import log_file
from runner.chat_mirror import FELL_BACK, displayed
from runner.hooks import handle
from engine.gates import held
from engine.sessions import Sessions
from framework.format import VIEWER, formatted
from providers import DRIVERS, PROVIDERS
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh, holds, refused
from tests.kit import nudges, report


def test_a_read_message_is_named_back_until_the_agent_answers_it():
    record = fresh()
    Agents(record, actor=AGENT).by_session("claude-1")
    m = Messages(record, actor=USER).create("how is it going?")
    Messages(record, actor=AGENT).read(m.n)

    def text():
        return [n for n in nudges(record) if "before you do anything else" in n]

    report(record, "working", "PreToolUse")
    from engine.gates import held
    assert held(record, "claude-1", writing=False), "a message read and not answered holds the very next tool use, reading as much as writing"
    for i in range(8):
        report(record, "working", "PreToolUse")
    assert text() == [], "nothing is said while the message has waited fewer than ten tool uses"
    report(record, "working", "PreToolUse")
    assert text() == ["answer message 1 before you do anything else"], \
        "the tenth tool use names the message and says to answer it"
    from controllers.types import Nudges
    from agents.actors import settled
    from resources.base import Event
    line = [n for n in Nudges(record).all() if "before you do anything else" in n.title][-1]
    queued = Event(id=0, type="nudge", n=line.n, action="created", actor="system", at=0.0, data={})
    assert settled(record, queued) is False, "while the message is open, the line still goes out"
    report(record, "idle", "Stop")
    assert len(text()) == 2, "an idle agent is told at once"
    for i in range(30):
        report(record, "working", "PreToolUse")
    assert len(text()) == 3, "said three times in all and then it lets the agent be"
    assert "tool calls are held" in holds(record).get("messages.answering", ""), "the hold stands while the message is unanswered, however long it waits"
    refusal = handle(PROVIDERS["claude"](), record.root, record.env,
                     {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_use_id": "use-1", "tool_name": "Bash",
                      "tool_input": {"command": f"journal message read {m.n} | head -5"}}).get("reason", "")
    assert "how is it going?" in refusal, \
        "a held line whose journal command the gate ran in the agent's place hands back what it printed, so asking what to answer is never a dead end"
    shot = record.root.parent / "shot.png"
    shot.write_bytes(bytes.fromhex("89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a4944415478019c6300010000050001"
                                   "0d0a2db40000000049454e44ae426082"))
    with_picture = Messages(record, actor=USER).create("what does this say?")
    Messages(record, actor=USER).attach(with_picture.n, str(shot))
    Messages(record, actor=AGENT).read(with_picture.n)
    assert "open the picture before you answer it" in refused(lambda: Messages(record, actor=AGENT).reply(with_picture.n, "it says the build is green")), \
        "a message carrying a picture nobody opened cannot be answered: a guess at what a screenshot shows is worse than no answer"
    shown = handle(PROVIDERS["claude"](), record.root, record.env,
                   {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_use_id": "use-2", "tool_name": "Read",
                    "tool_input": {"file_path": str(Messages(record).rows.row_folder(with_picture.n) / "shot.png")}}).get("reason", "")
    assert not shown, "and reading that picture is never held, since it is how the message gets answered"
    Messages(record, actor=AGENT).tag(with_picture.n, "shot.png", "a terminal showing the build passing")
    Messages(record, actor=AGENT).reply(with_picture.n, "it says the build is green")
    assert Messages(record).load(with_picture.n).completed, "once the picture is tagged the reply goes through"
    from controllers.types import Todos
    filed = Todos(record, actor=AGENT).create("wire the last route")
    Messages(record, actor=AGENT).process(m.n, "how is it going?", f"todo {filed.n}")
    report(record, "idle", "Stop")
    assert not Messages(record).load(m.n).completed, "a question filed as a to-do is not answered: it stays open until a written reply"
    Messages(record, actor=AGENT).reply(m.n, "halfway: the build is green, wiring the last route")
    report(record, "working", "PreToolUse")
    assert (holds(record).get("status"), holds(record).get("messages.answering")) == (None, None), "a reply settles it and lifts the hold"
    assert settled(record, queued) is True, "a line still queued about a message now answered is dropped, not sent late"
    assert f"todo:{filed.n}" in Messages(record).load(m.n).refs, "the to-do the agent processed the message into is linked to it"
    asked = Messages(record, actor=USER).create("one more ask")
    Messages(record, actor=AGENT).read(asked.n)
    unrelated = Todos(record, actor=AGENT).create("work for another message")
    Messages(record, actor=AGENT).reply(asked.n, "done")
    assert f"todo:{unrelated.n}" not in Messages(record).load(asked.n).refs, \
        "a row filed while a message is in hand is not linked to it: only processing links, never a guess"
    ask = Messages(record, actor="user").create("please wire up the footer too")
    Messages(record, actor=AGENT).read(ask.n)
    footer = Todos(record, actor=AGENT).create("wire up the footer")
    Messages(record, actor=AGENT).process(ask.n, "please wire up the footer too", f"todo {footer.n}")
    assert Messages(record).load(ask.n).completed, "a message processed into a row is handled at once, not when the agent next goes idle"
    by_agent = Messages(record, actor=AGENT).create("a line from the agent")
    assert "only a message you sent" in refused(lambda: Messages(record, actor=USER).delete(by_agent.n, "gone")), "a message the user did not write cannot be deleted, whoever asks"
    Messages(record, actor=USER).delete(ask.n, "gone")
    assert Messages(record).load(ask.n).deleted, "a message the user wrote can be deleted"
    report(record, "working", "PreToolUse")
    report(record, "idle", "Stop")
    assert Messages(record).load(ask.n).completed, "a message that asked for no answer is closed once the agent has filed what it asked for"


def test_unread_messages_are_nudged_with_growing_urgency_until_the_inbox_is_read():
    record = fresh()

    def gate():
        return holds(record).get("messages.unread", "")

    Works(record, actor=AGENT).create("something open")

    def inbox():
        return [n for n in nudges(record) if "inbox" in n]

    def use(n):
        report(record, "working", "PreToolUse", uses=n)

    from declaring.reach import Reach
    from framework.loaded import FEATURES
    Agents(record, actor=AGENT).create("s-gone", status="stopped")
    titles = [agent.title for agent in FEATURES["messages"].reached(record, Reach.BOTH)]
    assert "s-gone" not in titles, "a stopped agent hears nothing, so a message that arrives does not rewrite its counters: every old session made the first message after a start slow"
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
    from runner.engine import Engine
    from providers import DRIVERS
    record = fresh()
    engine = Engine(record, DRIVERS["claude"](record, "claude-99"))
    engine.agent.driver.last_report = lambda: SimpleNamespace(title="claude-1", asking={})
    since = record.event_log.last_id()
    Nudges(record).create("for this session", session="claude-1", private=True)
    Nudges(record).create("for another", session="claude-2", private=True)
    received = {e.data.get("title") or e.n: engine.elsewhere(e) for e in record.event_log.events(since)}
    assert list(received.values()) == [False, True], "the terminal is claude-99 but the session is claude-1: its own nudge is spoken"


def test_messages_shown_at_once_arrive_whole_and_claude_is_read_from_its_display_hook_only(tmp_path, monkeypatch):
    from runner import chat_mirror
    from runner.engine import Engine
    record, transcript, now = fresh(), tmp_path / "s.jsonl", datetime.now(timezone.utc).isoformat()
    monkeypatch.setattr(chat_mirror, "SETTLE", 0.5)
    transcript.write_text(json.dumps({"type": "user", "timestamp": now, "message": {"content": "go"}}) + "\n")
    report(record, "working", "PreToolUse", provider="claude", transcript=str(transcript))
    Sessions(record.root).bind("claude-1", record.env, provider="claude")
    for piece in ({"index": 0, "final": False, "delta": "first "}, {"message_id": "b", "index": 0, "final": True, "delta": "second"}, {"index": 1, "final": True, "delta": "whole"}):
        displayed(record.root, Chunk.from_json({"session_id": "claude-1", "hook_event_name": "MessageDisplay", "message_id": "a", **piece}))
    chat = lambda: [m.brief for m in Messages(record, actor="system").all() if m.seen[:1] == ["agent"]]
    assert chat() == ["second", "first whole"], "a message that finishes never drops the pieces of one still being shown"
    engine = Engine(record, DRIVERS["claude"](record, "claude-1"))
    engine.tick()
    transcript.write_text(transcript.read_text() + json.dumps({"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": "only in the transcript"}]}}) + "\n")
    engine.tick()
    assert "only in the transcript" not in chat(), "Claude's messages come from its display hook alone"
    displayed(record.root, Chunk.from_json({"session_id": "claude-1", "hook_event_name": "MessageDisplay", "message_id": "c", "index": 0, "final": False, "delta": "The summary "}))
    handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "Stop", "session_id": "claude-1", "last_assistant_message": "The summary of the turn"})
    assert chat().count("The summary of the turn") == 1, "a message whose last pieces never came is sent whole when the turn stops"
    displayed(record.root, Chunk.from_json({"session_id": "claude-1", "hook_event_name": "MessageDisplay", "message_id": "c", "index": 1, "final": True, "delta": "of the turn"}))
    assert chat().count("The summary of the turn") == 1 and "of the turn" not in chat(), "a piece arriving after that does not send it again"
    displayed(record.root, Chunk.from_json({"session_id": "claude-1", "hook_event_name": "MessageDisplay", "message_id": "d", "index": 0, "final": False, "delta": "Cut short "}))
    transcript.write_text(transcript.read_text() + json.dumps({"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": "Cut short by the next prompt"}]}}) + "\n")
    handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "UserPromptSubmit", "session_id": "claude-1", "prompt": "next"})
    assert chat().count("Cut short by the next prompt") == 1, "a message cut short when the next prompt starts without a stop is sent whole from the transcript"
    from runner.chat_mirror import FAULTS, DisplayedLedger, fingerprint, raise_held
    said = lambda: (any(FELL_BACK in line for line in nudges(record)), FELL_BACK in log_file(record.root).read_text())
    assert said() == (False, False), "the transcript fills the chat at once, but the fault is only held: the hook may be late, not lost"
    displayed(record.root, Chunk.from_json({"session_id": "claude-1", "message_id": "e", "index": 0, "final": True, "delta": "second"}))
    assert chat().count("second") == 2, "another turn with the same short answer is recorded separately"
    displayed(record.root, Chunk.from_json({"session_id": "claude-1", "message_id": "f", "index": 0, "final": True, "delta": "👍"}))
    assert ("👍" in chat(), any("your message was only 👍, so it was not posted" in line for line in nudges(record))) == (False, True), \
        "a message that is only a face is not posted, and the agent is told to react instead"
    before = len(chat())
    displayed(record.root, Chunk.from_json({"session_id": "claude-1", "message_id": "g", "index": 0, "final": True, "delta": "   "}))
    assert len(chat()) == before, "a message of nothing but spaces is not posted"
    from runner.chat_mirror import send_to_chat
    send_to_chat(record.root, "claude-1", "Parked it for now.", "transcript:1791545582.1:abc")
    displayed(record.root, Chunk.from_json({"session_id": "claude-1", "index": 0, "final": True, "delta": "Parked it for now."}))
    assert chat().count("Parked it for now.") == 1, "a turn the transcript carried first is not posted again when the display hook delivers the same words"
    transcript.write_text(transcript.read_text() + json.dumps({"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": "Done. " * 80}]}}) + "\n")
    handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "Stop", "session_id": "claude-1", "last_assistant_message": "Done. " * 80})
    assert any("paragraph" in line.lower() for line in nudges(record)), "a long answer in one block of sentences is told to be set in paragraphs"
    late = "Waiting on the measurement."
    transcript.write_text(transcript.read_text() + json.dumps({"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": late}]}}) + "\n")
    fell_back = log_file(record.root).read_text().count(FELL_BACK)
    monkeypatch.setattr(chat_mirror, "SETTLE", 30.0)
    threading.Timer(0.1, lambda: displayed(record.root, Chunk.from_json(
        {"session_id": "claude-1", "message_id": "h", "index": 0, "final": True, "delta": late}))).start()
    handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "Stop", "session_id": "claude-1", "last_assistant_message": late})
    assert (chat().count(late), log_file(record.root).read_text().count(FELL_BACK)) == (1, fell_back), \
        "the turn's last words are waited for: a display hook the stop raced past still delivers them, and the transcript is not blamed"
    monkeypatch.setattr(chat_mirror, "SETTLE", 0.5)
    ledger = DisplayedLedger(record.root, "claude-1")
    with ledger.changing() as kept:
        assert fingerprint(late) not in kept.get(FAULTS, {}), "and no fault is held for them: the stop waited until they came, however long the machine took, and a hook that never delivered would leave one here"
    with ledger.changing() as kept:
        assert fingerprint("Cut short by the next prompt") in kept[FAULTS], "the held fault is kept by the fingerprint of the words"
        kept[FAULTS] = {one: 0.0 for one in kept[FAULTS]}
    raise_held(record.root, "claude-1")
    assert said() == (True, True), "and once its window has run out with nothing arriving, the engine says in its log and to the agent that the transcript filled the chat for the hook"
    transcript.write_text(transcript.read_text() + json.dumps({"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": "Late but not lost"}]}}) + "\n")
    handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "Stop", "session_id": "claude-1", "last_assistant_message": "Late but not lost"})
    raised = log_file(record.root).read_text().count(FELL_BACK)
    displayed(record.root, Chunk.from_json({"session_id": "claude-1", "hook_event_name": "MessageDisplay", "message_id": "another-id", "index": 0, "final": True, "delta": "Late but not lost"}))
    with ledger.changing() as kept:
        assert kept.get(FAULTS, {}) == {}, "the words arriving under another message id withdraw the held fault, by their fingerprint"
    raise_held(record.root, "claude-1")
    assert (log_file(record.root).read_text().count(FELL_BACK), chat().count("Late but not lost")) == (raised, 1), "and nothing is said about it, nor shown twice"
    cut = lambda text: transcript.write_text(transcript.read_text() + "\n".join([
        json.dumps({"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": text}]}}),
        json.dumps({"type": "user", "timestamp": now, "message": {"content": [{"type": "text", "text": "[Request interrupted by user]"}]}})]) + "\n")
    monkeypatch.setattr(engine.agent.driver, "alive", lambda: True)
    report(record, "working", "PreToolUse", provider="claude", transcript=str(transcript))
    blamed = log_file(record.root).read_text().count(FELL_BACK)
    cut("Half a sentence of the turn that was cut off")
    engine.cut_off()
    engine.cut_off()
    assert chat().count("Half a sentence of the turn that was cut off") == 1, "a turn the person cut off reaches the chat when the engine sees it, once, without waiting for the next prompt"
    assert log_file(record.root).read_text().count(FELL_BACK) == blamed, "and the display hook is not blamed for it, since a turn the person cut off has no words for the hook to deliver"
    displayed(record.root, Chunk.from_json({"session_id": "claude-1", "hook_event_name": "MessageDisplay", "message_id": "kept", "index": 0, "final": True, "delta": "Delivered by the hook before the cut"}))
    report(record, "working", "PreToolUse", provider="claude", transcript=str(transcript))
    cut("Delivered by the hook before the cut")
    engine.cut_off()
    assert chat().count("Delivered by the hook before the cut") == 1, "and words the display hook already delivered are not sent again"


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
    from features.messages.prose import bare
    assert bare(f"Two steps:\n{asked.n}. first\n{filed.n}) second") == [], "the numbers of a numbered list are not row numbers"
    assert bare("Opened PR 161, then pull request 162 and issue 40 on GitHub") == [], "a pull request or an issue named by its number is no row of the journal"
    assert bare("The suite took 109 s, then 194 s and 23.8 s; the push got HTTP 408, a load average of 123 and the copy is 118 MB of 2 GB") == [], \
        "a measurement with its unit, an HTTP code and a load average are not row numbers"
    assert bare("the server crashed: it answered 500, the route returned 404 and the call came back with status 502 or an error 503") == [], \
        "a number right after a word that reports an HTTP status is a status, not a row"
    assert bare("answered 20230 and closed 777") == [20230, 777], "a row number after a handling verb is still named, whatever the verb"
    assert bare(f"down from 980 loose files to {asked.n}; it waited {filed.n} before") == [], "a small number with no handling verb before it is a count"
    assert bare("all 358 viewer unit tests pass, and 358 viewer unit tests ran") == [], "a number before a noun phrase ending in a plural, or after all, is a count"
    assert bare("a number under 250 is a count, and so is more than 300") == [], "a quantity word before a number makes it a count"
    assert formatted("a journal question with options; journal question ask", record, VIEWER) == "a journal question with options; `journal question ask`", "only a real command is code"
    formatted_text = formatted("run python3 journal.py --root .journal upgrade, or pass --why", record, VIEWER)
    assert formatted_text.endswith(" --root .journal upgrade, or pass `--why`"), "a flag of another program and a .journal path stay plain text"
    long = "see src/a.py and docs/b.md --flag " * 4000
    began = time.thread_time()
    formatted(long, record, VIEWER)
    assert time.thread_time() - began < 1.0, "a long text with many paths and flags formats in linear time"


def test_a_reply_that_is_only_a_face_is_refused_and_points_at_react():
    asked = Messages(record := fresh(), actor="user").create("ship it?")
    assert "is a reaction: journal message react" in refused(lambda: Messages(record, actor="agent").reply(asked.n, "👍"))
    assert "read message" in refused(lambda: Messages(record, actor="agent").reply(asked.n, "On it.")), "a message the agent has not read is never answered"
    Messages(record, actor="agent").read(asked.n)
    first = Messages(record, actor="agent").reply(asked.n, "On it.")
    assert first, "once read, it is answered"
    assert "already answered this" in refused(lambda: Messages(record, actor="agent").reply(asked.n, "And one more thing.")), \
        "a message gets one answer from the agent; more goes into that answer"
    from tests.kit import report
    report(record, "working", "PreToolUse")
    fresh_one = Messages(record, actor="user").create("and this one")
    answered = Messages(record, actor="agent").reply(f"{asked.n},{fresh_one.n}", "Both.")
    assert (answered.refs, "agent" in Messages(record, actor="agent").load(fresh_one.n).seen) == ([f"message:{fresh_one.n}"], True), \
        "a reply naming several messages reads the ones not yet read and answers every one it can, leaving out the one already answered"
    assert any("not answered" in n.title and "already answered" in n.brief for n in Nudges(record, actor="system").rows.every()), "and tells the agent which it could not answer and why"


def test_a_reaction_from_the_user_reaches_the_agent_as_what_it_is():
    from agents.actors import render
    from resources.base import Event
    asked = Messages(record := fresh(), actor="agent").create("ship it?")
    face = Messages(record, actor="user").react(asked.n, "👍")
    line, counted = render([Event(id=1, at=0.0, type="reaction", n=face.n, action="created", actor="user")], record)
    assert (line.startswith(f"the user put 👍 on message {asked.n}. Act on it"), counted) == (True, {}), "a face and what to do with it, never a bare count"


def test_a_line_about_a_message_waits_for_the_driver_and_is_dropped_once_the_message_is_answered(monkeypatch):
    import time
    from runner.engine import Engine
    from providers import DRIVERS
    record = fresh()
    report(record, "working", "PreToolUse")
    engine = Engine(record, DRIVERS["claude"](record, "claude-1"))
    driver, delivered = engine.agent.driver, []
    monkeypatch.setattr(driver, "_deliver", lambda line, by: delivered.append(line))
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
    assert not any("before you do anything else" in line for line in delivered), "answered in the meantime: the waiting line is dropped, not sent late"
    later = Messages(record, actor=USER).create("and the docs?")
    engine.agent.pending = [e for e in record.event_log.events() if (e.type, e.n, e.action) == ("message", later.n, "created")]
    monkeypatch.setattr(driver, "ready", lambda: True)
    monkeypatch.setattr(driver, "send", lambda line, groups=None, yielding="", now=False, by="journal": True)
    engine.agent.flush()
    assert Messages(record, actor=SYSTEM).load(later.n).data.get("delivered"), "a message told to the agent is stamped with the moment it was told"
    whisper = Nudges(record, actor=SYSTEM).create("answer message", rows=[later.ref])
    Messages(record, actor=AGENT).read(later.n)
    Messages(record, actor=AGENT).reply(later.n, "on it")
    engine.agent.pending = [e for e in record.event_log.events() if (e.type, e.n, e.action) == ("nudge", whisper.n, "created")]
    engine.agent.flush()
    assert engine.agent.pending == [], "a line about rows that are all finished is dropped before it is sent"


def test_messages_between_agent_sessions_reach_the_chat_marked_with_the_other_session(tmp_path):
    from runner.engine import Engine
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
    later = {**peer, "timestamp": "2026-09-23T10:05:00Z"}
    transcript.write_text(transcript.read_text() + json.dumps(later) + "\n")
    engine.relay_peers()
    assert [m.brief for m in Messages(record, actor="system").all()].count("the loop is fixed") == 1, \
        "the same message delivered a second time is filed once: a peer's message is known by who sent it and what it says, never by when it arrived"
    from_session = next(m for m in Messages(record, actor="system").all() if m.data.get("peer"))
    assert (from_session.data.get("from_session"), from_session.ref in Agents(record).by_session("claude-1").delivered) == ("uds:/tmp/a.sock", True), \
        "it names the session it came from and counts as handed to the agent in its turn, so an answer to it is never held back"
    codex = tmp_path / "c.jsonl"
    codex.write_text("".join(json.dumps({"type": "response_item", "timestamp": "2026-09-23T10:02:00Z", "payload": {"type": "message", "role": role,
                                                         "content": [{"type": kind, "text": text}]}}) + "\n"
                             for role, kind, text in (("user", "input_text", "go"), ("assistant", "output_text", "the response is complete"))))
    report(record, "working", "PreToolUse", session="codex-1", provider="codex", transcript=str(codex))
    Engine(record, DRIVERS["codex"](record, "codex-1")).relay_peers()
    assert all(hasattr(turn, "kind") for turn in PROVIDERS["codex"]().last_turns(codex)), "Codex's recent turns are parsed turns, as every provider's are"
    from providers.turns import last_text
    assert last_text(Agents(record).by_session("codex-1")) == "the response is complete", "and its last words are read from them"
    from engine import chat
    for session in ("claude-1", "codex-1"):
        chat.send(record, Agents(record).by_session(session), f"answer from {session}", turn="transcript:1")
    assert [m.brief for m in Messages(record, actor="system").all() if m.brief.startswith("answer from")] == ["answer from claude-1", "answer from codex-1"], \
        "two sessions' answers on the same transcript line are both kept"
    codex.write_text(codex.read_text() + json.dumps({"type": "response_item", "timestamp": datetime.now(timezone.utc).isoformat(),
                                                     "payload": {"type": "message", "role": "assistant", "content": [{"type": "output_text", "text": "what the Codex agent said"}]}}) + "\n")
    from runner import chat_mirror
    Sessions(record.root).bind("codex-1", record.env, provider="codex")
    chat_mirror.unfinished(record.root, "codex-1", Agents(record).by_session("codex-1"))
    said = [m.brief for m in Messages(record, actor="system").all() if m.seen[:1] == ["agent"]]
    log = log_file(record.root)
    assert ("what the Codex agent said" in said, log.exists() and FELL_BACK in log.read_text()) == (True, False), \
        "a Codex agent's words reach the chat as the agent's own, and a provider that shows nothing as it is displayed is read from its transcript by design, never reported as a hook that failed"


def test_an_event_carries_the_command_that_caused_it_so_a_read_is_not_an_update():
    record = fresh()
    n = Messages(record, actor=USER).create("hello").n
    agent = Messages(record, actor=AGENT)
    Messages(record, actor=USER).create("hello again")
    agent.read_all([n + 1])
    agent.action("read")(n)
    agent.action("react")(n, "👍")
    reaction_events = [(e.type, e.action, e.data.get("by")) for e in record.event_log.events() if e.n == n or e.type == "reaction"]
    read = [e.data.get("by") for e in record.event_log.events() if e.type == "message" and e.action == "updated" and e.data.get("seen") == AGENT]
    assert read == ["read", "read"], f"a read from the viewer's read-all and from the command both say read: {read}"
    assert [by for t, _, by in reaction_events if t == "reaction"] == [None], f"a row of another type saved inside the command is not stamped with it: {reaction_events}"
    closing = Messages(record, actor=SYSTEM)
    held_open = closing.create("closed twice")
    assert (closing._closed_once(held_open.n, "first").completed > 0, closing._closed_once(held_open.n, "second"), closing.load(held_open.n).outcome) == (True, None, "first"), \
        "a message two handlers or threads both close is closed once, and the second asking is no failure"
