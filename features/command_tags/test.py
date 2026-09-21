import json
from datetime import datetime, timezone


from controllers.types import Comments, Messages, Nudges
from engine.hooks import displayed
from engine.sessions import Sessions
from features.command_tags.reading import visible
from tests.kit import nudges, report
from tests.conftest import fresh


def watching(record, transcript):
    from types import SimpleNamespace
    from controllers.types import Agents
    from engine.engine import Engine
    from providers import DRIVERS
    agents = Agents(record, actor="system")
    agents.update(agents.by_session("claude-1").n, provider="claude", transcript=str(transcript), status="working")
    engine = Engine(record, DRIVERS["claude"](record, "claude-99"))
    engine.agent.driver.last_report = lambda: SimpleNamespace(title="claude-1")
    engine.announce_written()
    return engine


def test_every_message_reaches_the_chat_and_nothing_asks_for_a_tag(tmp_path):
    transcript = tmp_path / "s.jsonl"
    now = datetime.now(timezone.utc).isoformat()
    rows = [{"type": "user", "timestamp": now, "message": {"content": "go"}}]
    transcript.write_text(json.dumps(rows[0]) + "\n")
    record = fresh()
    engine = watching(record, transcript)
    asked = Messages(record, actor="user").create("are you there?")
    chat = lambda: [m.brief for m in Messages(record, actor="system").all() if m.seen[:1] == ["agent"]]

    def said(text):
        rows.append({"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": text}]}})
        transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
        engine.announce_written()
        engine.announce_written()

    said("Checking the build next.")
    assert chat() == ["Checking the build next."], "a message without a tag is a plain message in the chat"
    said("[!info] an old habit")
    assert chat()[-1] == "an old habit", "a retired label tag is taken off and the message shown"
    said(f"[!reply:{asked.n}] yes, here")
    assert chat()[-1] == "an old habit", "a reply is shown as the reply, not copied into the chat"
    assert [c.title for c in Comments(record, actor="system").linked_to(asked.ref)] == ["yes, here"], "the reply is posted"
    assert not [n for n in nudges(record) if "has no tag" in n], "nothing asks for a tag"
    assert visible("[!reply:n] plus the command tags") == "[!reply:n] plus the command tags", "only a real number or name makes a tag"


def test_replying_by_command_is_answered_with_the_tag_that_does_it():
    from engine.hooks import handle
    from providers import PROVIDERS
    record = fresh()
    hook = {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "Bash"}
    handle(PROVIDERS["claude"](), record.root, record.env, {**hook, "tool_input": {"command": 'journal message reply 12 "on it"'}})
    assert [n.brief.split(" and ")[0] for n in Nudges(record).all() if "reply tag" in n.title] == ["open your turn with [!reply:12]"], \
        "the reply command is answered with the tag"
    handle(PROVIDERS["claude"](), record.root, record.env, {**hook, "tool_input": {"command": 'journal message reply 13 "see" --file a.txt'}})
    assert not [n for n in Nudges(record).all() if "13 with the reply tag" in n.title], "a reply carrying a file is what the command is for"
    record.set_setting("features", {"command_tags.replying": False})
    handle(PROVIDERS["claude"](), record.root, record.env, {**hook, "tool_input": {"command": 'journal message reply 14 "ok"'}})
    assert not [n for n in Nudges(record).all() if "14 with the reply tag" in n.title], "with its behaviour off, the part is not called"


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
    message = Messages(record, actor="user").create("are you there?")
    engine = watching(record, transcript)
    rows.append({"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": f"[!reply:{message.n}] yes, here"}]}})
    transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
    engine.announce_written()
    assert [c.title for c in Comments(record, actor=SYSTEM).linked_to(message.ref)] == ["yes, here"], \
        "written mid-turn, no hook fired: the reply is posted as soon as the engine sees it"
    later = Messages(record, actor="user").create("still there?")
    rows.append({"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": f"[!reply:{later.n}] said while it restarted"}]}})
    transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
    watching(record, transcript)
    assert [c.title for c in Comments(record, actor=SYSTEM).linked_to(later.ref)] == ["said while it restarted"], \
        "a restarted engine announces what was said while it was down"


def test_the_final_message_the_stop_hook_carries_runs_its_tags_before_the_transcript_has_it(tmp_path):
    from engine.hooks import handle
    from providers import PROVIDERS
    from resources.base import SYSTEM
    record = fresh()
    engine = watching(record, tmp_path / "none.jsonl")
    message = Messages(record, actor="user").create("done yet?")
    stop = {"hook_event_name": "Stop", "session_id": "claude-1", "last_assistant_message": f"[!reply:{message.n}] done"}
    for _ in range(2):
        handle(PROVIDERS["claude"](), record.root, record.env, stop)
        engine.announce_written()
    assert [c.title for c in Comments(record, actor=SYSTEM).linked_to(message.ref)] == ["done"], "posted once, from the hook's own text"


def test_a_reply_shown_on_screen_is_posted_even_when_the_transcript_never_gets_it():
    record = fresh()
    report(record, "working", "PreToolUse")
    Sessions(record.root).bind("claude-1", record.env, provider="claude")
    message = Messages(record, actor="user").create("still there?")
    base = {"session_id": "claude-1", "hook_event_name": "MessageDisplay", "message_id": "m1"}
    displayed(record.root, {**base, "index": 0, "final": False, "delta": f"[!reply:{message.n}] shown in two "})
    displayed(record.root, {**base, "index": 1, "final": True, "delta": "pieces"})
    displayed(record.root, {**base, "message_id": "m2", "index": 0, "final": True, "delta": f"[!reply:{message.n}] shown in two pieces"})
    assert [c.title for c in Comments(record, actor="system").linked_to(message.ref)] == ["shown in two pieces"], "joined, posted once"


def test_a_tag_passes_its_named_arguments_to_the_command_in_any_order(tmp_path):
    from engine.hooks import handle
    from providers import PROVIDERS
    from controllers.types import Facts, Rules
    record = fresh()
    engine = watching(record, tmp_path / "none.jsonl")
    said = '[!fact="the port is 8423", keywords=("port", "8423")]\nthe server says so'
    handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "Stop", "session_id": "claude-1", "last_assistant_message": said})
    engine.announce_written()
    fact = Facts(record, actor="system").all()[-1]
    assert (fact.title, fact.brief, fact.data["keywords"]) == ("the port is 8423", "the server says so", ["port", "8423"]), "keywords ride on the tag"
    for said in ('[!rule="stay on main"]\nthe user said so', '[!rule="stay on main", keywords=("git switch")]\nthe user said so'):
        handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "Stop", "session_id": "claude-1", "last_assistant_message": said})
        engine.announce_written()
    assert [n for n in Nudges(record).all() if 'keywords="' in n.brief and "--set" not in n.brief], "a refusal is said in the tag's own spelling"
    assert Rules(record, actor="system").all()[-1].data["keywords"] == ["git switch"], "a rule is filed by its tag"
