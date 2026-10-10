import pytest
import json
from datetime import datetime, timezone


from controllers.types import Comments, Messages, Nudges
from resources.base import AGENT, USER
from providers.payload import Chunk
from runner.chat_mirror import displayed
from engine.sessions import Sessions
from features.command_tags.reading import visible
from tests.kit import nudges, report
from tests.conftest import fresh


def watching(record, transcript):
    from controllers.types import Agents
    from runner.engine import Engine
    from providers import DRIVERS
    agents = Agents(record, actor="system")
    agents.update(agents.by_session("claude-1").n, provider="claude", transcript=str(transcript), status="working")
    engine = Engine(record, DRIVERS["claude"](record, "claude-99"))
    engine.agent.driver.last_report = lambda: agents.by_session("claude-1")
    engine.announce_written()
    return engine



def asked_and_read(record, text, **more):
    message = Messages(record, actor=USER).create(text, **more)
    Messages(record, actor=AGENT).read(message.n)
    return message

def test_every_message_reaches_the_chat_and_nothing_asks_for_a_tag(tmp_path):
    transcript = tmp_path / "s.jsonl"
    now = datetime.now(timezone.utc).isoformat()
    rows = [{"type": "user", "timestamp": now, "message": {"content": "go"}}]
    transcript.write_text(json.dumps(rows[0]) + "\n")
    record = fresh()
    engine = watching(record, transcript)
    asked = asked_and_read(record, "are you there?")
    chat = lambda: [m.brief for m in Messages(record, actor="system").all() if m.seen[:1] == ["agent"]]

    def text(text):
        rows.append({"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": text}]}})
        transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
        engine.announce_written()
        engine.announce_written()

    text("Checking the build next.")
    assert chat() == ["Checking the build next."], "a message without a tag is a plain message in the chat"
    text("[!info] an old habit")
    assert chat()[-1] == "an old habit", "a retired label tag is taken off and the message shown"
    text("[!internal] checking the build next")
    assert chat()[-1] == "checking the build next", "the retired internal tag is taken off like the others, and its words shown"
    text(f"[!reply:{asked.n}] yes, here")
    assert chat()[-1] == "checking the build next", "a reply is shown as the reply, not copied into the chat"
    assert [c.title for c in Comments(record, actor="system").linked_to(asked.ref)] == ["yes, here"], "the reply is posted"
    assert not [n for n in nudges(record) if "has no tag" in n], "nothing asks for a tag"
    import io
    from features.command_tags import handlers
    broken = type("Broken", (), {"run": lambda self, *given, **named: 1})()
    with pytest.MonkeyPatch.context() as patch:
        patch.setattr(handlers, "command_line", lambda: broken)
        text(f"[!reply:{asked.n}] this one cannot be written")
    assert chat()[-1] == "this one cannot be written", "a reply whose command failed, as on a full disk, is not swallowed: its words stay in the chat"
    assert visible("[!reply:n] plus the command tags") == "[!reply:n] plus the command tags", "only a real number or name makes a tag"


def test_the_same_tag_in_two_turns_runs_twice():
    import features
    from controllers.types import Agents, Todos
    from engine import chat

    record = fresh()
    report(record, "working", "PreToolUse")
    features.load()
    agent = Agents(record, actor="system").by_session("claude-1")
    chat.send(record, agent, '[!todo="Repeated work"] first')
    chat.send(record, agent, '[!todo="Repeated work"] first')
    assert [todo.title for todo in Todos(record, actor="system").all()] == ["Repeated work", "Repeated work"]


def test_a_new_message_says_how_to_answer_it_in_the_same_line():
    from engine.wording import counted
    record = fresh()
    assert counted({("message", "created"): {4465: None}}, record) == ["1 new message 4465 - answer by opening your turn with [!reply:4465]"], \
        "the tags feature adds to the messages line; no second line follows"
    from controllers.types import Agents, Messages
    from resources.base import AGENT, USER
    thanks, asked = asked_and_read(record, "Thank you, sir."), asked_and_read(record, "Thanks, but which branch?")
    assert counted({("message", "created"): {thanks.n: None}}, record) == \
        [f'1 new message {thanks.n} - message {thanks.n} says: "Thank you, sir."; message {thanks.n} only acknowledges: react to it with journal message react {thanks.n} "👍", no words needed'], \
        "a message that only acknowledges is answered with a reaction, and the line carries what it says"
    line = counted({("message", "created"): {asked.n: None}}, record)[0]
    assert ("[!reply:" in line, f'message {asked.n} says: "Thanks, but which branch?"' in line, AGENT in Messages(record, actor=AGENT).load(asked.n).seen) == (True, True, True), \
        "one that asks something still gets a reply, its whole text is in the line, and the agent need not read it first"
    assert counted({("message", "created"): {4465: None, 4466: None}}, record)[0].endswith("answer each by opening a turn with [!reply:<n>]")
    assert counted({("todo", "created"): {3: None}}, record) == ["1 new todo 3"], "a line nobody appends to is left as it is"
    record = fresh()
    Agents(record, actor=AGENT).by_session("claude-1")
    Messages(record, actor=AGENT).read(asked_and_read(record, "how is it going?").n)
    report(record, "idle", "Stop")
    assert any(n.brief.startswith("answer by opening your turn with [!reply:1]") for n in Nudges(record).all() if "before you write" in n.title), \
        "the line naming a read message still to answer says how to answer it, in its brief"
    from engine.wording import APPENDS, appended
    addition = lambda n, **_: f"work {n} can be ended from the board"
    APPENDS.add(None, addition, key="work_tracking.open")
    try:
        assert appended("work_tracking.open", {"n": 7}, "work 7 is still open") == "work 7 is still open - work 7 can be ended from the board", \
            "any registered line takes an addition by its feature and name"
    finally:
        APPENDS.remove(addition)

def test_the_last_message_is_read_only_once_claude_has_written_it(tmp_path):
    from providers import PROVIDERS
    transcript = tmp_path / "s.jsonl"
    rows = [{"type": "user", "message": {"content": [{"type": "tool_result", "content": "ok"}]}},
            {"type": "assistant", "message": {"content": [{"type": "thinking", "thinking": ""}]}},
            {"type": "permission-mode", "permissionMode": "auto"}]
    transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
    assert PROVIDERS["claude"]().settling(transcript) is True, "only the thinking is written: the message is still coming"
    rows.append({"type": "assistant", "message": {"content": [{"type": "text", "text": "[!reply:3] done"}]}})
    transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
    assert PROVIDERS["claude"]().settling(transcript) is False, "the message is written: it can be read"


def test_a_tagged_message_runs_the_moment_the_engine_sees_it_written(tmp_path):
    from resources.base import SYSTEM
    record = fresh()
    transcript = tmp_path / "s.jsonl"
    now = datetime.now(timezone.utc).isoformat()
    rows = [{"type": "user", "timestamp": now, "message": {"content": "go"}},
            {"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": "[!info] working"}]}}]
    transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
    message = asked_and_read(record, "are you there?")
    engine = watching(record, transcript)
    rows.append({"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": f"[!reply:{message.n}] yes, here"}]}})
    transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
    engine.announce_written()
    assert [c.title for c in Comments(record, actor=SYSTEM).linked_to(message.ref)] == ["yes, here"], \
        "written mid-turn, no hook fired: the reply is posted as soon as the engine sees it"
    rows.append({"type": "assistant", "timestamp": now, "message": {"content": [{"type": "tool_use", "id": "toolu_1", "name": "Bash", "input": {"command": "ls"}}]}})
    transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
    engine.announce_written()
    assert [c.title for c in Comments(record, actor=SYSTEM).linked_to(message.ref)] == ["yes, here"], \
        "a reply followed by tool calls in the same turn is posted once, as the reply, when the engine sees it"
    later = asked_and_read(record, "still there?")
    rows.append({"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": f"[!reply:{later.n}] said while it restarted"}]}})
    transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
    watching(record, transcript)
    assert [c.title for c in Comments(record, actor=SYSTEM).linked_to(later.ref)] == ["said while it restarted"], \
        "a restarted engine announces what was said while it was down"


def test_the_final_message_the_stop_hook_carries_runs_its_tags_before_the_transcript_has_it(tmp_path):
    from runner.hooks import handle
    from providers import PROVIDERS
    from resources.base import SYSTEM
    record = fresh()
    transcript = tmp_path / "s.jsonl"
    now = datetime.now(timezone.utc).isoformat()
    rows = [{"type": "user", "timestamp": now, "message": {"content": "go"}}]
    transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
    engine = watching(record, transcript)
    message = asked_and_read(record, "done yet?")
    stop = {"hook_event_name": "Stop", "session_id": "claude-1", "last_assistant_message": f"[!reply:{message.n}] done"}
    for _ in range(2):
        handle(PROVIDERS["claude"](), record.root, record.env, stop)
        engine.announce_written()
    assert [c.title for c in Comments(record, actor=SYSTEM).linked_to(message.ref)] == ["done"], "posted once, from the hook's own text"
    assert not [n for n in nudges(record) if "did not run" in n], "the engine's pass over the Stop text sends it through the ledger the hook used, so its reply tag does not run a second time"
    rows.append({"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": f"[!reply:{message.n}] done"}]}})
    transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
    engine.announce_written()
    assert [c.title for c in Comments(record, actor=SYSTEM).linked_to(message.ref)] == ["done"] and not [n for n in nudges(record) if "did not run" in n], \
        "when the transcript has the turn later, its tag does not run again and nothing says it did not run"


def test_a_reply_shown_on_screen_is_posted_even_when_the_transcript_never_gets_it():
    from runner.hooks import handle
    from providers import PROVIDERS
    record = fresh()
    report(record, "working", "PreToolUse")
    Sessions(record.root).bind("claude-1", record.env, provider="claude")
    message = asked_and_read(record, "still there?")
    base = {"session_id": "claude-1", "hook_event_name": "MessageDisplay", "message_id": "m1"}
    displayed(record.root, Chunk.from_json({**base, "index": 0, "final": False, "delta": f"[!reply:{message.n}] shown in two "}))
    displayed(record.root, Chunk.from_json({**base, "index": 1, "final": True, "delta": "pieces"}))
    displayed(record.root, Chunk.from_json({**base, "message_id": "m2", "index": 0, "final": True, "delta": f"[!reply:{message.n}] shown in two pieces"}))
    assert [c.title for c in Comments(record, actor="system").linked_to(message.ref)] == ["shown in two pieces"], "joined, posted once"
    orphaned = asked_and_read(record, "what if the first piece is missing?")
    displayed(record.root, Chunk.from_json({**base, "message_id": "m3", "index": 1, "final": True, "delta": "the body without its tag"}))
    assert not [m for m in Messages(record, actor="system").all() if m.title == "the body without its tag"], "a stream without its first piece is not posted"
    handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "Stop", "session_id": "claude-1", "last_assistant_message": f"[!reply:{orphaned.n}]\nthe body without its tag"})
    assert [c.title for c in Comments(record, actor="system").linked_to(orphaned.ref)] == ["the body without its tag"], "the complete Stop text posts the reply once"


def test_a_tag_passes_its_named_arguments_to_the_command_in_any_order(tmp_path):
    from runner.hooks import handle
    from providers import PROVIDERS
    from controllers.types import Facts, Rules
    record = fresh()
    engine = watching(record, tmp_path / "none.jsonl")
    text = '[!fact="the port is 8423", keywords=("port", "8423")]\nthe server says so'
    handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "Stop", "session_id": "claude-1", "last_assistant_message": text})
    engine.announce_written()
    fact = Facts(record, actor="system").all()[-1]
    assert (fact.title, fact.brief, fact.data["keywords"]) == ("the port is 8423", "the server says so", ["port", "8423"]), "keywords ride on the tag"
    for text in ('[!rule="stay on main"]\nthe user said so', '[!rule="stay on main", keywords=("git switch")]\nthe user said so'):
        handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "Stop", "session_id": "claude-1", "last_assistant_message": text})
        engine.announce_written()
    assert [n for n in Nudges(record).all() if 'keywords="' in n.brief and "--set" not in n.brief], "a refusal is said in the tag's own spelling"
    assert Rules(record, actor="system").all()[-1].data["keywords"] == ["git switch"], "a rule is filed by its tag"
    from controllers.types import Works
    work = Works(record, actor="agent").create("ship it")
    text = '[!await on=("b36lq7m0o", "helper:2")] the suite and Rhea'
    handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "Stop", "session_id": "claude-1", "last_assistant_message": text})
    engine.announce_written()
    waited = Works(record, actor="system").load(work.n)
    assert (waited.awaiting, waited.awaiting_on) == ("the suite and Rhea", "b36lq7m0o,helper:2"), "the await tag names what the wait is on"


def test_one_reply_answers_several_messages():
    from engine import chat
    import features
    from controllers.types import Agents
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    first, second = (asked_and_read(record, text, brief=text) for text in ("Remove the plan.", "And write the document."))
    chat.send(record, Agents(record, actor="system").by_session("claude-1"), f"[!reply:{first.n},{second.n}]\nYes, the plan goes and the document follows.")
    made = Comments(record, actor="system").all()
    assert len(made) == 1 and {first.ref, second.ref} <= set(made[0].refs), "one reply answers both messages"
    assert "> Remove the plan." in made[0].brief and "> And write the document." in made[0].brief, "and quotes both"


def test_a_command_a_tag_stands_for_shows_its_tag_once_in_a_while():
    from controllers.types import Agents
    from engine.ran import announce
    record = fresh()
    report(record, "working", "PreToolUse", session="claude-tags")
    agent = Agents(record).by_session("claude-tags")
    run = "jour" + "nal"
    announce(record, agent.n, "Bash", f"{run} todo done 4", "done")
    assert not any("tag does this" in line for line in nudges(record)), "a command no tag stands for shows nothing"
    announce(record, agent.n, "Bash", f'{run} message reply 3 "on it"', "replied")
    announce(record, agent.n, "Bash", f'{run} work log "moved"', "logged")
    shown = [line for line in nudges(record) if "tag does this" in line]
    assert len(shown) == 1 and "reply tag" in shown[0], shown
