import json
from datetime import datetime, timezone


from controllers.types import Messages, Nudges
from tests.kit import nudges
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


def test_every_message_without_a_tag_is_named_once(tmp_path):
    transcript = tmp_path / "s.jsonl"
    now = datetime.now(timezone.utc).isoformat()
    rows = [{"type": "user", "timestamp": now, "message": {"content": "go"}}]
    transcript.write_text(json.dumps(rows[0]) + "\n")

    def said(*texts):
        rows.extend({"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": text}]}} for text in texts)
        transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
        engine.announce_written()
        told = [n for n in nudges(record) if "has no tag" in n]
        Nudges(record, actor="agent").read_all([n.n for n in Nudges(record).all()])
        return told

    record = fresh()
    engine = watching(record, transcript)
    assert said("[!reply] done, pushed") == [], "a tagged message: nothing said"
    assert said("Checking the build next.") == ["your last message has no tag"], "an untagged message: named at once"
    assert len(said("**[!info]** a build is running")) == 1, "a bold tag counts"
    assert len(said("[!invented] a made-up tag")) == 2, "an invented leading tag is rejected"
    assert len(said("[!reply][!invented] two leading tags")) == 3, "a registered prefix does not hide an invented tag"
    assert len(said("status [!reply] is ordinary text")) == 4, "an inline tag-like phrase is rejected"
    assert len(said()) == 4, "each message is named once, in the terminal"
    assert len(said("no tag here", "nor here")) == 5, "one reminder waits at a time: a second is not added before the first is delivered"

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
    from controllers.types import Comments
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


def test_the_final_message_the_stop_hook_carries_runs_its_tags_before_the_transcript_has_it(tmp_path):
    from controllers.types import Comments
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


def test_the_chosen_level_copies_tagged_messages_into_the_chat(tmp_path):
    transcript = tmp_path / "s.jsonl"
    now = datetime.now(timezone.utc).isoformat()
    rows = [{"type": "user", "timestamp": now, "message": {"content": "go"}}]
    transcript.write_text(json.dumps(rows[0]) + "\n")
    record = fresh()
    engine = watching(record, transcript)
    chat = lambda: [(m.brief, m.data.get("tag")) for m in Messages(record, actor="system").all() if m.seen[:1] == ["agent"]]

    def said(text):
        rows.append({"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": text}]}})
        transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
        engine.announce_written()
        engine.announce_written()

    said("[!info] the build is green")
    assert chat() == [], "replies only: an info message stays in the terminal"
    said("[!reply] answered in the thread")
    assert chat() == [("answered in the thread", "reply")], "a reply without a number reaches the chat at every level"
    record.set_setting("tags", {"verbosity": "info"})
    said("[!info] the build is still green")
    assert chat() == [("answered in the thread", "reply"), ("the build is still green", "info")], "with info shown: copied into the chat once, its tag kept as data"
