import pytest

import features
from controllers.types import Agents
from features.parts import AgentContext
from providers.payload import BashCall
from resources.base import SYSTEM
from tests.conftest import fresh


def test_a_search_of_the_history_is_marked_in_the_chat_and_other_commands_are_not(tmp_path, monkeypatch):
    from features import FEATURES
    from features.history_searches.handlers import MarkHistorySearches
    features.load()
    record = fresh()
    agent = Agents(record, actor=SYSTEM).by_session("claude-1")
    run = lambda command: MarkHistorySearches().intercept(AgentContext.of(FEATURES["history_searches"], record, agent),
                                                          BashCall("Bash", {"command": command}, {}, command=command))
    for command in ('cd x && journal search "phone link" 2>&1 | head -5', "journal --env main conversation --back=1", "journal user | tail",
                    "journal todo all", "grep journal search.py", 'journal search --page 2 "second page"'):
        assert run(command) == "", "a mark never holds the call"
    marks = [card["label"] for card in Agents(record, actor=SYSTEM).load(agent.n).data.get("cards") or []]
    assert marks == ['Searched the conversation for "phone link"', "Read the conversation history", "Searched your messages",
                     'Searched the conversation for "second page"'], marks
    run("journal message search assign | head")
    last = (Agents(record, actor=SYSTEM).load(agent.n).data.get("cards") or [])[-1]
    assert last["label"] == 'Searched messages for "assign"', "searching one kind of row names that kind and what was searched for"
    import json
    from commands.cli import captured
    from providers import transcript_cache
    from providers.claude import Claude
    monkeypatch.setattr(transcript_cache.CACHE, "folder", tmp_path / "folds")
    transcript = tmp_path / "s.jsonl"
    transcript.write_text(json.dumps({"type": "user", "uuid": "u1", "timestamp": "2026-10-08T10:00:00Z", "message": {"role": "user", "content": "find the needle please"}}) + "\n")
    Agents(record, actor=SYSTEM).update(agent.n, provider="claude", transcript=str(transcript))
    reads, original = [], Claude.whole_turns
    monkeypatch.setattr(Claude, "whole_turns", lambda self, path, why: reads.append(path) or original(self, path, why))
    asked = ["--env", record.env, "search", "needle"]
    first, second = captured(asked, record.root), captured(asked, record.root)
    assert (first[1], "needle" in first[0], first == second, len(reads)) == (0, True, True, 1), \
        f"a search is run by the server, which keeps the transcripts it has read, so the second search reads nothing again"
    with transcript.open("a") as grown:
        grown.write(json.dumps({"type": "user", "uuid": "u2", "timestamp": "2026-10-08T10:01:00Z", "message": {"role": "user", "content": "and a second haystack"}}) + "\n")
    later = captured(["--env", record.env, "search", "haystack"], record.root)
    assert ("haystack" in later[0], len(reads), "needle" in captured(asked, record.root)[0]) == (True, 1, True), \
        "a transcript that has grown is read from where it ended, never whole again, and the turns read before are still found"
    from providers import search_folds
    from providers.turns import TURNS
    TURNS.clear()
    assert (captured(["--env", record.env, "search", "haystack"], record.root)[0].count("haystack") >= 1, len(reads)) == (True, 1), \
        "a restart reads the conversation back from the folds kept on disk, not from the file again"
    assert search_folds.restored(transcript, transcript.stat().st_size) is not None, "the folds are kept beside the transcript's size and position"


def test_a_search_mark_keeps_what_the_search_found_and_what_was_read_from_it_until_the_next_search_or_answer():
    from engine import bus, ran
    from engine.chat import SENT
    from features import FEATURES
    from features.history_searches.handlers import MarkHistorySearches
    from resources.base import AGENT
    features.load()
    record = fresh()
    agents = Agents(record, actor=SYSTEM)
    agent = agents.by_session("claude-1")
    search = lambda command, output: (
        MarkHistorySearches().intercept(AgentContext.of(FEATURES["history_searches"], record, agent), BashCall("Bash", {"command": command}, {}, command=command)),
        ran.announce(record, agent.n, "Bash", command, output))
    search('journal search "phone link"', "todo 12 phone link\nfact 3 tunnel")
    ran.announce(record, agent.n, "Bash", "journal todo show 12", "Title: phone link")
    ran.announce(record, agent.n, "Read", "reading a.py /x/a.py", "print(1)")
    ran.announce(record, agent.n, "Bash", "ls", "a.py")
    search('journal search "tunnel"', "fact 3 tunnel")
    ran.announce(record, agent.n, "Bash", "journal fact show 3", "The tunnel needs TLS")
    bus.announce(record, "agent", agent.n, SENT, AGENT, {"text": "done", "turn": "1"})
    ran.announce(record, agent.n, "Bash", "journal todo show 13", "after the answer")
    first, second = agents.load(agent.n).data["cards"]
    assert (first["found"], first["reads"]) == ("todo 12 phone link\nfact 3 tunnel", [{"label": "Opened todo 12", "text": "Title: phone link"}, {"label": "Read /x/a.py", "text": "print(1)"}])
    assert (second["found"], second["reads"]) == ("fact 3 tunnel", [{"label": "Opened fact 3", "text": "The tunnel needs TLS"}]), "a read after the answer belongs to no search"


def test_a_transcript_rewritten_in_place_is_read_again_not_served_from_the_cache(tmp_path):
    import json
    from providers import PROVIDERS
    from providers.transcript_cache import shape_mark
    claude = PROVIDERS["claude"]()
    entry = lambda text: json.dumps({"type": "user", "timestamp": "2026-10-05T10:00:00Z", "message": {"content": text}}) + "\n"
    transcript = tmp_path / "s-1.jsonl"
    transcript.write_text(entry("the first words") + entry("and more of them"))
    first = [turn.text for turn in claude.turns(transcript)]
    transcript.write_text(entry("a new start"))
    assert [turn.text for turn in claude.turns(transcript)] == ["a new start"] != first, "a transcript that shrank is read from its start again"
    transcript.write_text(entry("the first word!") + entry("and more of them"))
    assert [turn.text for turn in claude.turns(transcript)][0] == "the first word!", "one replaced at a size it had before is read again too"
    import time
    from providers import transcript_cache
    from providers.transcript_cache import TranscriptCache
    extend = lambda turns, read, count: turns + [line.decode() for line in read]
    asked, original = [], transcript_cache.lines_from
    transcript_cache.lines_from = lambda path, offset: asked.append(original(path, offset)) or asked[-1]
    try:
        first = TranscriptCache(tmp_path / "kept")
        turns = first.transcript(transcript, extend)
        stored = first.file(("transcript", str(transcript), shape_mark()))
        waited = time.monotonic() + 2
        while not stored.exists() and time.monotonic() < waited:
            time.sleep(0.01)
        asked.clear()
        assert (TranscriptCache(tmp_path / "kept").transcript(transcript, extend), [len(read.lines) for read in asked]) == (turns, [0]), \
            "a release that leaves a transcript untouched reads none of its lines again, whatever provider code it changed"
        stored.write_bytes(b"not a pickle")
        assert (first.stored(("transcript", str(transcript), shape_mark())), stored.exists()) == (None, False), "a kept state that fails to load is dropped, not served"
    finally:
        transcript_cache.lines_from = original
    blocked = tmp_path / "a-file-not-a-folder"
    blocked.write_text("")
    cache = TranscriptCache(blocked)
    assert (cache.write(("a",), 1, "state"), cache.recent(tmp_path / "gone.jsonl", lambda raw: raw), cache.before(tmp_path / "gone.jsonl", 10, 5)) == (None, [], b""), \
        "a cache that cannot be written, and a transcript that is gone, leave nothing and fail nothing"
    lines = lambda turns, read, count: turns + [line.decode() for line in read]
    busy = cache.lock(("transcript", str(transcript), shape_mark()))
    busy.acquire()
    try:
        assert cache.transcript(transcript, lines) == [entry("the first word!").strip(), entry("and more of them").strip()], \
            "a transcript another request is reading answers with its newest lines instead of waiting"
        cache.turns_behind(transcript, ("transcript", str(transcript), shape_mark()), lines)
        assert not cache.behind, "a read already going on is not queued a second time"
    finally:
        busy.release()
    assert (cache.turns_up(tmp_path / "gone.jsonl", ("gone",), lines), cache.fold_up(("gone",), tmp_path / "gone.jsonl", None, lambda: "empty", None)) == ([], "empty"), \
        "a transcript gone before its read leaves no turns and its fold as it started"

    class Broke(Exception):
        pass
    cache.behind.append(lambda: (_ for _ in ()).throw(Broke()))
    cache.catching_up = True
    with pytest.raises(Broke):
        cache.catch_up()
    assert not cache.catching_up, "a read that fails behind lets the next one start its own catching up"


def test_the_conversation_a_summary_replaced_and_your_own_words_are_read_back(capsys):
    import json
    from datetime import datetime, timezone
    from commands.cli import run
    from tests.kit import report
    features.load()
    record = fresh()
    stamp = datetime.now(timezone.utc).isoformat()
    rows = [{"type": "user", "timestamp": stamp, "message": {"content": "make the tunnel restart itself"}},
            {"type": "assistant", "timestamp": stamp, "message": {"content": [{"type": "text", "text": "On it, the watchdog first."}]}},
            {"type": "user", "timestamp": stamp, "isCompactSummary": True, "message": {"content": "summary of the tunnel work"}},
            {"type": "user", "timestamp": stamp, "message": {"content": "now the phone dialog"}}]
    transcript = record.root.parent / "claude-1.jsonl"
    transcript.write_text("".join(json.dumps(row) + "\n" for row in rows))
    report(record, "working", "PreToolUse", provider="claude", transcript=str(transcript))
    read = lambda *words: (run(["--root", str(record.root), "--env", record.env, "--session", "claude-1", *words]), capsys.readouterr().out)[1]
    back = read("conversation", "--back", "1")
    assert "make the tunnel restart itself" in back and "On it, the watchdog first." in back and "now the phone dialog" not in back, \
        "the conversation a summary replaced is read back, and nothing after it"
    own = read("user")
    assert "make the tunnel restart itself" in own and "now the phone dialog" in own and "watchdog" not in own, "your own words are read back, and only yours"
    assert "make the tunnel restart itself" in read("search", "restart itself"), "a search finds words in any conversation of the environment"


def test_an_agents_transcript_and_the_links_in_it_are_read_for_it_and_for_its_subagents():
    import json
    from datetime import datetime, timezone
    from commands.http import dispatch
    features.load()
    record = fresh()
    stamp = datetime.now(timezone.utc).isoformat()
    def written(path, text):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps({"type": "assistant", "timestamp": stamp, "message": {"content": [{"type": "text", "text": text}]}}) + "\n")
    main = record.root.parent / "claude-1.jsonl"
    written(main, "Pull request https://github.com/jessegall/agent-journal/pull/12 is open")
    written(main.with_suffix("") / "subagents" / "agent-abc.jsonl", "Design at https://claude.ai/design/p/xyz")
    row = Agents(record, actor=SYSTEM).create("claude-1", provider="claude", transcript=str(main), subagent_rows=[{"id": "t1", "session": "abc"}])
    bare = Agents(record, actor=SYSTEM).create("claude-2")
    at = lambda n, *tail: dispatch("GET", f"/api/{record.env}/agent/{n}/{'/'.join(tail)}", record.root, {}, {})
    assert at(row.n, "links").body == {"links": ["https://github.com/jessegall/agent-journal/pull/12"]}, "the links the agent gave are listed"
    assert at(row.n, "subagent", "abc", "links").body == {"links": ["https://claude.ai/design/p/xyz"]}, "a subagent's links come from its own transcript"
    assert [t["text"] for t in at(row.n, "transcript").body["turns"]] == ["Pull request https://github.com/jessegall/agent-journal/pull/12 is open"], \
        "the transcript's turns are read back"
    assert [t["text"] for t in at(row.n, "subagent", "abc", "transcript").body["turns"]] == ["Design at https://claude.ai/design/p/xyz"], "so are a subagent's"
    assert (at(bare.n, "links").body, at(bare.n, "transcript").body["turns"]) == ({"links": []}, []), "an agent with no transcript has no turns and no links"
    assert at(row.n, "subagent", "gone", "transcript").code == 404, "a subagent that never ran is not found"


def test_the_turns_an_agent_spoke_are_read_from_its_transcript_a_whole_line_at_a_time(tmp_path):
    import json
    import features
    from datetime import datetime, timezone
    from controllers.types import Agents
    import pytest
    from providers.jsonl import Read, ReadFromStart, lines_after, lines_from, parsed
    from features.history_searches.handlers import searches
    assert searches("journal 'search never closed") == [], "a command line that cannot be split is no search"
    from providers.claude import Claude
    from providers.turns import last_text, last_turn, read_transcripts, turns
    from resources.base import SYSTEM
    from tests.conftest import fresh
    features.load()
    record = fresh()
    assert (parsed("not json", dict), parsed("[1]", lambda raw: raw["a"]), parsed('{"a": 2}', lambda raw: raw["a"])) == (None, None, 2), "a line that is no row of the shape is passed over"
    path = tmp_path / "t.jsonl"
    path.write_bytes(b'{"a": 1}\n{"b"')
    assert lines_from(path, 0) == Read([b'{"a": 1}'], 0, 9), "only whole lines are read, and the offset stops before the half-written one"
    assert lines_after(tmp_path / "missing.jsonl", 4) == Read([], 4, 4), "a file that is gone reads nothing and keeps its place"
    with pytest.raises(ReadFromStart):
        lines_after(path, 0)
    stamp = datetime.now(timezone.utc).isoformat()
    transcript = tmp_path / "claude-1.jsonl"
    transcript.write_text(json.dumps({"type": "assistant", "timestamp": stamp, "message": {"content": [{"type": "text", "text": "All done."}]}}) + "\n")
    agents = Agents(record, actor=SYSTEM)
    row = agents.create("claude-1", provider="claude", transcript=str(transcript), status="idle", at=1.0)
    agent = agents.load(row.n)
    assert [t.text for t in turns(agent)] == ["All done."], "the turns the agent spoke are read from its transcript"
    assert (last_text(agent), last_turn(agent).text) == ("All done.", "All done."), "the last of them is the agent's last word"
    nobody = agents.load(agents.create("claude-2").n)
    assert (turns(nobody), last_turn(nobody), last_text(nobody)) == ([], None, ""), "an agent with no transcript has no turns and no last word"
    agents.update(row.n, transcript=str(tmp_path / "gone.jsonl"))
    assert turns(agents.load(row.n)) == [], "a transcript that was removed has no turns"
    pick = [{"question": "Pick one?", "options": [{"label": "A"}, {"label": "B"}]}, {"question": "Why?"}]
    assistant_line = lambda *blocks, **more: {"type": "assistant", "timestamp": stamp, "message": {"content": list(blocks)}, **more}
    user_line = lambda content, **more: {"type": "user", "timestamp": stamp, "message": {"content": content}, **more}
    conversation = tmp_path / "claude-3.jsonl"
    conversation.write_text("".join(json.dumps(line) + "\n" for line in (
        assistant_line({"type": "tool_use", "id": "q1", "name": "AskUserQuestion", "input": {"questions": pick}}),
        user_line([{"type": "tool_result", "tool_use_id": "q1", "content": "A"}]),
        user_line("hi from a peer", origin={"kind": "peer", "from": "uds:abc", "name": "nina", "body": "the peer's own words"}),
        assistant_line({"type": "tool_use", "id": "s1", "name": "SendMessage", "input": {"to": "nina", "message": "hello nina"}}),
        user_line("first try", parentUuid="p1"), user_line("second try", parentUuid="p1"),
        {"type": "assistant", "isSidechain": True, "timestamp": stamp, "message": {"content": [{"type": "text", "text": "hidden"}]}},
        {"type": "progress", "timestamp": stamp})))
    seen = Claude().turns(conversation)
    assert "asked: Pick one?  [A / B]\nasked: Why?" in seen[0].text, "a question the agent put to you is read as words, with the choices it offered"
    assert (seen[1].kind, seen[1].who) == ("human", "user"), "what answers that question is your answer, not a tool's result"
    assert (seen[2].peer.name, seen[2].text) == ("nina", "the peer's own words"), "a line another session sent is read with who sent it, in the sender's words"
    assert (seen[3].kind, seen[3].peer.address, seen[3].text) == ("peer", "nina", "hello nina"), "a message the agent sent to a peer is read as sent"
    assert [t.kind for t in seen[4:]] == ["superseded", "human"], "a line typed again under the same parent replaces the first try"
    assert len(seen) == 6, "a subagent's own rows and rows that say nothing are left out"
    listed = tmp_path / "claude-4.jsonl"
    listed.write_text(json.dumps(user_line([{"type": "tool_result", "tool_use_id": "z", "content": [{"type": "text", "text": "a result in parts"}, "stray", {"type": "text", "text": "and more"}]}])) + "\n")
    assert [turn.text for turn in Claude().turns(listed)] == ["a result in parts\nand more"], "a tool's result given in parts is read as one text"
    quiet = tmp_path / "claude-5.jsonl"
    quiet.write_text("not a row at all\n" + "".join(json.dumps(line) + "\n" for line in (
        assistant_line({"type": "thinking", "thinking": "weighing it up"}), user_line("a summary of the earlier conversation", isCompactSummary=True))))
    assert (Claude().turns(quiet)[0].kind, len(Claude().turns(quiet))) == ("summary", 1), "a turn of nothing but thinking is not shown, and the summary that replaces an earlier conversation is"
    thinking = tmp_path / "claude-6.jsonl"
    thinking.write_text("not a row at all\n" + json.dumps(assistant_line({"type": "thinking", "thinking": "weighing it up"}, {"type": "tool_use", "id": "t1", "name": "Read", "input": {}})) + "\n")
    assert Claude().thoughts(thinking, 0)[0] == [("thinking", "weighing it up")], "a line that is no row is passed over when reading what the agent thought"
    assert "shell_rows" in Claude().crew(quiet), "a transcript that starts over with a summary is read for its crew from there"
    from providers.codex import Codex
    item = lambda kind, **more: {"type": "response_item", "timestamp": stamp, "payload": {"type": kind, **more}}
    rollout = tmp_path / "rollout-2026-10-02T10-00-00-aaaaaaaa-0000-0000-0000-000000000009.jsonl"
    rollout.write_text("".join(json.dumps(line) + "\n" for line in (
        item("message", role="assistant", content=[{"type": "output_text", "text": "Built it."}]),
        item("message", role="user", content=[{"type": "input_text", "text": "  "}]),
        item("message", role="system", content=[{"type": "input_text", "text": "rules"}]),
        item("function_call", name="exec", call_id="c1", arguments="{}"),
        item("function_call_output", call_id="c1", output="done"),
        item("reasoning", summary=[]),
        {"type": "event_msg", "timestamp": stamp, "payload": {"type": "task_started"}})))
    heard = Codex().turns(rollout)
    assert [(turn.who, turn.text) for turn in heard if turn.text] == [("agent", "Built it."), ("tool", "done")], \
        "a Codex rollout is read as what the agent wrote and what its tools returned, leaving out blank lines, system text, reasoning and events"
    agents.update(row.n, transcript=str(transcript), status="working")
    read_transcripts(record.root)


def test_a_provider_that_knows_nothing_extra_answers_neutrally(tmp_path):
    from pathlib import Path
    from providers.base import Provider
    from providers.codex import Codex
    from providers.claude import Claude

    class Bare(Provider):
        name = "bare"
        def agent_file(self, project, name): return project / name
        def agent_text(self, kind, model): return ""
        def config(self, project): return project / "bare.json"
        def present(self, project): return True
        def wiring(self, *a, **k): return None

    bare, path = Bare(), tmp_path / "none.jsonl"
    assert (bare.shell_wrapper(Path("x.sh")), bare.unwrapped_command("ls -la"), bare.shell_runs(path), bare.typed_runs(path), bare.work_links(path)) == ({}, "ls -la", [], [], []), \
        "a provider that wraps no shell and reads no commands, runs or links answers with nothing"
    assert (bare.failure(path), bare.dispatch(object(), tmp_path), bare.context(object()), bare.usage(path), bare.effort(tmp_path)) == (None, None, None, None, ""), \
        "one that cannot tell a failure, a dispatch, the context, the usage or the effort answers with nothing"
    assert bare.background_tasks(path).started == {}, "one that reads no background tasks finds none"
    assert (bare.row_of({"a": 1}), bare.turn(object(), 1), bare.tool_uses({}), bare.crew(path), bare.stop_instruction("b1")) == ({"a": 1}, None, [], {}, "stop task b1 now"), \
        "its rows stay as they are, it has no turns, tool uses or crew, and a task is stopped in plain words"
    assert (bare.conversation_file("c"), bare.subagent_transcript(path, "s"), bare.is_subagent(object()), bare.thoughts(path, 7), bare.skill_load("journal")) == (None, None, False, ([], 7), "Skill: journal"), \
        "it finds no conversation file or subagent, no thoughts, and names a loaded skill plainly"
    assert bare.commands_for("effort", "high", "m") == [], "one with no controls types nothing to choose an effort"
    assert (bare.dispatch_model("m"), bare.skills(None), bare.skills(tmp_path / "gone.jsonl"), bare.hook_files(tmp_path)) == ("m", [], [], [bare.config(tmp_path)]), \
        "it dispatches the model it was given, finds no skills loaded without a transcript, and keeps its hooks in the one file"


def test_no_hook_reads_more_than_a_tail_of_a_long_transcript_and_a_new_build_keeps_its_line_numbers(tmp_path, monkeypatch):
    import json
    import time
    import features
    from engine import whole_reads
    from providers import PROVIDERS, jsonl, transcript_cache
    from runner.hooks import handle
    from tests.conftest import fresh
    features.load()
    record = fresh()
    cache = transcript_cache.CACHE
    monkeypatch.setattr(cache, "folder", tmp_path / "folds")
    monkeypatch.setattr(jsonl, "FRESH_BYTES", 64_000)
    entry = lambda n: json.dumps({"type": "user", "timestamp": "2026-10-05T10:00:00Z", "message": {"content": f"line {n} " + "x" * 300}}) + "\n"
    transcript = tmp_path / "claude-7.jsonl"
    transcript.write_text("".join(entry(n) for n in range(6000)))
    spans, read = [], jsonl.read_bytes

    def measured(path, start, stop=None) -> bytes:
        found = read(path, start, stop)
        spans.append(len(found))
        return found
    monkeypatch.setattr(jsonl, "read_bytes", measured)
    before = whole_reads.count()
    for event in ("SessionStart", "UserPromptSubmit", "PreToolUse", "PostToolUse", "Stop"):
        handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": event, "session_id": "claude-7", "transcript_path": str(transcript),
                                                                "tool_name": "Read", "tool_input": {"file_path": "x.py"}, "cwd": str(record.root.parent)})
    assert (bool(spans), max(spans) <= transcript_cache.RECENT_BYTES < transcript.stat().st_size, whole_reads.count() - before) == (True, True, 0), \
        "no hook reads more than a tail of a long transcript, and none reads it whole"
    last = PROVIDERS["claude"]().turns(transcript)[-1].line
    cursor = cache.file((transcript_cache.CURSOR, str(transcript)))
    waited = time.monotonic() + 2
    while not cursor.exists() and time.monotonic() < waited:
        time.sleep(0.01)
    cache.transcripts.clear()
    monkeypatch.setattr(transcript_cache, "shape_mark", lambda: "a newer way of shaping turns")
    assert PROVIDERS["claude"]().turns(transcript)[-1].line == last, "a new way of shaping turns reads the transcript from its tail again and still numbers its lines from the first"
    searched = PROVIDERS["claude"]().every_turn(transcript, jsonl.WholeRead.SEARCH)
    assert (len(searched) > len(PROVIDERS["claude"]().turns(transcript)), whole_reads.since(before)) == (True, (jsonl.WholeRead.SEARCH,)), \
        "only a search reads a transcript whole, and the read is recorded with its reason"


def test_a_long_transcript_answers_its_newest_turns_at_once_and_fills_in_behind(tmp_path, monkeypatch):
    import json
    import time
    from providers import PROVIDERS, transcript_cache
    monkeypatch.setattr(transcript_cache.CACHE, "folder", tmp_path / "folds")
    monkeypatch.setattr(transcript_cache, "FOLD_IN_PLACE_BYTES", 10_000)
    monkeypatch.setattr(transcript_cache, "RECENT_BYTES", 5_000)
    said = lambda n: {"type": "user", "timestamp": "2026-10-05T10:00:00Z", "message": {"content": f"question {n} " + "x" * 200}}
    answered = lambda n: {"type": "assistant", "timestamp": "2026-10-05T10:00:01Z", "message": {"content": [{"type": "text", "text": f"answer {n}"}]}}
    transcript = tmp_path / "long.jsonl"
    transcript.write_text("".join(json.dumps(row) + "\n" for n in range(200) for row in (said(n), answered(n))))
    claude = PROVIDERS["claude"]()
    began = time.monotonic()
    first = claude.turns(transcript)
    assert (bool(first), first[-1].text, time.monotonic() - began < 1) == (True, "answer 199", True), \
        "a long transcript nobody has read yet answers at once with its newest turns"
    waited = time.monotonic() + 5
    while len(claude.turns(transcript)) <= len(first) and time.monotonic() < waited:
        time.sleep(0.02)
    whole = claude.turns(transcript)
    assert (len(whole) > len(first), whole[-1].text, whole[0].text.startswith("question 0")) == (True, "answer 199", True), \
        "and fills in with the rest once the read behind it has caught up"
