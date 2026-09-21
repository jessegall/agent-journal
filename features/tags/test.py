import json
from datetime import datetime, timezone


from controllers.types import Messages, Nudges
from features import FEATURES
from features.format import formatted
from features.tags.feature import visible
from tests.kit import idle, nudges
from tests.conftest import fresh


def test_an_untagged_last_message_is_told_once_per_idle_stretch(tmp_path):
    transcript = tmp_path / "s.jsonl"

    def said(*texts):
        rows = [{"type": "user", "message": {"content": "go"}}] + [{"type": "assistant", "message": {"content": [{"type": "text", "text": t}]}} for t in texts]
        transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")

    record = fresh()
    said_to_user = Messages(record, actor="agent").create("a reply", brief="[!reply] done, pushed")
    said("[!reply] done, pushed")
    idle(record, provider="claude", transcript=str(transcript))
    assert [n for n in nudges(record) if "tag" in n] == [], "a tagged last message: nothing said"
    said("[!reply] on it", "Done, pushed.")
    idle(record, provider="claude", transcript=str(transcript))
    assert [n for n in nudges(record) if "tag" in n] == ["your last message has no tag"], \
        "an untagged last message: told once, with the tags"
    idle(record, provider="claude", transcript=str(transcript))
    assert len([n for n in nudges(record) if "tag" in n]) == 2, "told once per idle stretch"
    said("**[!info]** a build is running")
    idle(record, provider="claude", transcript=str(transcript))
    assert len([n for n in nudges(record) if "tag" in n]) == 2, "a bold tag counts"
    said("[!invented] a made-up tag")
    idle(record, provider="claude", transcript=str(transcript))
    assert [n for n in nudges(record) if "tag" in n] == ["your last message has no tag"] * 3, \
        "an invented leading tag is rejected"
    said("[!reply][!invented] two leading tags")
    idle(record, provider="claude", transcript=str(transcript))
    assert [n for n in nudges(record) if "tag" in n] == ["your last message has no tag"] * 4, \
        "a registered prefix does not hide an invented tag"
    said("status [!reply] is ordinary text")
    idle(record, provider="claude", transcript=str(transcript))
    assert [n for n in nudges(record) if "tag" in n] == ["your last message has no tag"] * 5, \
        "an inline tag-like phrase is rejected"
    assert (visible("[!info] a build is running"), visible("**[!reply]** done"), visible("plain text")) == \
        ("a build is running", "done", "plain text"), "display text removes the registered tag"
    assert visible("status [!reply] is ordinary text") == "status [!reply] is ordinary text", \
        "display text preserves an inline tag-like phrase"
    assert visible("> [!reply] done\n> and a second line\n\nExactly.") == "> done\n> and a second line\n\nExactly.", \
        "display text keeps a quote marker and drops the tag behind it"
    assert [fn.__name__ for fn, _ in FEATURES["tags"].formatters()] == ["without_tags"], \
        "the tags feature is the one that strips them on the way out"
    assert (formatted("[!reply] done, pushed", record), Messages(record).load(said_to_user.n).brief) == \
        ("done, pushed", "[!reply] done, pushed"), "text sent to the viewer has no tag, while the record keeps it"


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
    from types import SimpleNamespace
    from controllers.types import Agents, Comments
    from engine.engine import Engine
    from providers import DRIVERS
    from resources.base import SYSTEM
    record = fresh()
    transcript = tmp_path / "s.jsonl"
    now = datetime.now(timezone.utc).isoformat()
    rows = [{"type": "user", "timestamp": now, "message": {"content": "go"}},
            {"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": "[!info] working"}]}}]
    transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
    agents = Agents(record, actor=SYSTEM)
    agents.update(agents.by_session("claude-1").n, provider="claude", transcript=str(transcript), status="working")
    message = Messages(record, actor="user").create("are you there?")
    engine = Engine(record, DRIVERS["claude"](record, "claude-99"))
    engine.agent.driver.last_report = lambda: SimpleNamespace(title="claude-1")
    engine.announce_written()
    rows.append({"type": "assistant", "timestamp": now, "message": {"content": [{"type": "text", "text": f"[!reply:{message.n}] yes, here"}]}})
    transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
    engine.announce_written()
    assert [c.title for c in Comments(record, actor=SYSTEM).linked_to(message.ref)] == ["yes, here"], \
        "written mid-turn, no hook fired: the reply is posted as soon as the engine sees it"
