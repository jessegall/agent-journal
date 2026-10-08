import inspect
import json
import os
import threading
import time
from dataclasses import replace
from pathlib import Path

import features
from commands.cli import context
from commands.dispatch import dispatch
from commands.http import dispatch as request
from commands.parser import parser
from controllers.types import Agents, Notices, Nudges, Works
from engine import runtime
from engine.gates import AFTERWARDS, CANCELERS, HookCall, LONG_COMMAND, POLICIES, cancelled, gate_file, held
from engine.sessions import ACTIVE_ENV, Sessions
from engine.wording import APPENDS
from providers import PROVIDERS, claude_channel as channel
from providers.claude_channel import Asked
from providers.payload import Hook
from resources.base import AGENT, SYSTEM
from resources.types import SUBAGENT
from runner.gate import gated
from runner.hooks import handle
from tests.conftest import fresh
from tests.kit import report
import commands.http  # noqa: F401



def test_a_write_is_refused_until_work_is_open_for_every_provider():
    features.load()
    REFUSED = features.FEATURES["work_tracking"].line("undeclared held", {})[0]
    record = fresh()
    root, env = record.root, record.env

    for name, provider_cls in PROVIDERS.items():
        provider = provider_cls()
        session = f"{name}-7"

        def hook(event, tool="", cwd="", **tool_input):
            return handle(provider, root, env, {"hook_event_name": event, "session_id": session, "tool_name": tool, "tool_input": tool_input, "cwd": cwd})

        hook("SessionStart")
        assert held(record, session) == REFUSED, f"{name}: a fresh session with nothing open: the flag says refused"
        assert hook("PreToolUse", "Read", file_path="x.py") == {}, f"{name}: a read passes"
        assert hook("PreToolUse", "Bash", command="cat x.py | grep y") == {}, f"{name}: a Bash read passes"
        assert hook("PreToolUse", "Edit", file_path="x.py") == provider.blocking(REFUSED), \
            f"{name}: an edit is refused, in the harness's shape"
        runtime.OFF.raise_flag(root)
        try:
            assert hook("PreToolUse", "Edit", file_path="x.py") == {}, f"{name}: with the journal switched off nothing is held, the escape hatch"
        finally:
            runtime.OFF.lower_flag(root)
        assert hook("PreToolUse", "Bash", command="git commit -m x") == provider.blocking(REFUSED), \
            f"{name}: a writing command is refused"
        assert hook("PreToolUse", "Bash", command="echo x > out.txt") == provider.blocking(REFUSED), \
            f"{name}: a redirect is a write"
        assert hook("PreToolUse", "Bash", command="make > /dev/null") == {}, f"{name}: a redirect to /dev/null is not"
        assert hook("PreToolUse", "Bash", command="python3 tests/x.py 2>&1 | tail -1") == {}, f"{name}: joining stderr is not a write"
        project = str(root.parent)
        assert hook("PreToolUse", "Write", cwd=project, file_path="web/x.js") == provider.blocking(REFUSED), \
            f"{name}: a project file is gated"
        assert hook("PreToolUse", "Write", cwd=project, file_path=".journal/environments/main/notes.md") == {}, \
            f"{name}: a file inside the journal is not project work"
        assert hook("PreToolUse", "Edit", cwd=project, file_path="/tmp/elsewhere/memory.md") == {}, \
            f"{name}: a file outside the project is not project work"
        assert hook("PreToolUse", "Bash", command="journal work start \"x\" >/dev/null; .journal/journal todo add x") == {}, \
            f"{name}: a journal command is never gated, it is how work opens"
        work = Works(record, actor=AGENT).create(f"the header for {name}")
        assert held(record, session) == "", f"{name}: work open: the flag flips to allowed"
        assert hook("PreToolUse", "Edit", file_path="x.py") == {}, f"{name}: the same edit passes"
        Works(record, actor=AGENT).complete(work.n, "done")
        assert hook("PreToolUse", "Write", file_path="y.py") == provider.blocking(REFUSED), \
            f"{name}: work ended, nothing open: refused again"
        assert json.loads(gate_file(root, env, session).read_text())["work_tracking"] == {"why": REFUSED, "reach": "main"}, \
            f"{name}: the flag is a file per environment and session, with the why"


def test_a_hook_that_crashes_is_told_to_the_agent_for_every_provider(monkeypatch):
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")

    for name, provider_cls in PROVIDERS.items():
        def crash(self, hook, root):
            raise TypeError(f"{name} crashed")
        monkeypatch.setattr(provider_cls, "facts", crash)
        body = {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "Read", "tool_input": {"file_path": "x.py"}}
        answered = dispatch("POST", f"/api/hook/{name}", record.root, {"root": str(record.root), "env": record.env}, body)
        assert answered.code == 200, f"{name}: a crash while recording the hook happens after it is answered, so the answer stands"
        answered.after()
        lines = [f"{n.title} {n.brief}" for n in Nudges(record, actor=SYSTEM).rows.every()]
        assert any("hit an error" in line and f"TypeError: {name} crashed" in line for line in lines), \
            f"{name}: a crash inside the hook reaches the agent, with the error"
        dispatch("POST", f"/api/hook/{name}", record.root, {"root": str(record.root), "env": record.env}, body).after()
        assert len([line for line in lines if "crashed" in line]) == len([n for n in Nudges(record, actor=SYSTEM).rows.every() if "crashed" in n.brief]), \
            f"{name}: the same error again is not told twice"
        for notice in Notices(record, actor=SYSTEM).rows.standing():
            Notices(record, actor=SYSTEM).complete(notice.n, "fixed")
    monkeypatch.undo()
    runtime.hook_failures(record.root).write_text(f"1790000000 000 claude {record.env}\n1790000001 500 claude {record.env}\n")
    commands.http.unanswered(record.root)
    lines = [f"{n.title} {n.brief}" for n in Nudges(record, actor=SYSTEM).rows.every()]
    assert any("no answer from the server 2 times (codes 000, 500)" in line for line in lines), \
        "hooks the server never answered are told once it answers again"
    assert not runtime.hook_failures(record.root).exists(), "and are told only once"
    monkeypatch.setattr(runtime, "STARTED", [1790000100.0])
    runtime.hook_failures(record.root).write_text(f"1790000095 000 claude {record.env}\n")
    commands.http.unanswered(record.root)
    assert len([n for n in Nudges(record, actor=SYSTEM).rows.every() if "no answer from the server" in n.brief]) == 1, \
        "a hook missed while the server was restarting is not an error"
    runtime.restarting(record.root).write_text("1790000060")
    runtime.hook_failures(record.root).write_text(f"1790000070 000 claude {record.env}\n")
    commands.http.unanswered(record.root)
    assert len([n for n in Nudges(record, actor=SYSTEM).rows.every() if "no answer from the server" in n.brief]) == 1, \
        "however long a restart the journal began itself takes, the hooks it missed are not an error"


def test_a_command_runs_as_the_session_its_own_shell_names_for_every_provider(monkeypatch):
    record = fresh()
    sessions = Sessions(record.root)
    for session in ("first-agent", "second-agent"):
        sessions.bind(session, record.env, pid=os.getpid(), provider="claude")
    for provider in PROVIDERS.values():
        if not provider.session_variable:
            continue
        monkeypatch.setenv("JOURNAL_SESSION_VARIABLE", provider.session_variable)
        monkeypatch.setenv(provider.session_variable, "second-agent")
        monkeypatch.delenv("JOURNAL_SESSION", raising=False)
        args = vars(parser("todo").parse_args(["--root", str(record.root), "todo", "all"]))
        assert context(args)["session"] == "second-agent", \
            f"{provider.name}: with two agents in one environment, a command runs as the agent whose shell ran it"


def values_for(feature, key: str, line) -> dict:
    appended = [p for append in APPENDS.each(key=f"{feature.name}.{key}") for p in inspect.signature(append).parameters.values()
                if p.default is p.empty and p.kind is p.POSITIONAL_OR_KEYWORD and p.name != "record"]
    return {**{p.name: [1] if p.annotation is list else "1" for p in appended}, **{name: "1" for name in line.placeholders()}}


def spied(guard, asked: list):
    def ask(*given):
        asked.append(guard)
        return ""
    ask.guard = guard
    return ask


def test_every_line_and_guard_reaches_exactly_the_agents_its_reach_names():
    features.load()
    record = fresh()
    agents = Agents(record, actor=SYSTEM)
    main = agents.by_session("claude-1")
    helper = agents.update(agents.by_session("claude-helper").n, status=SUBAGENT)
    for feature in features.FEATURES.values():
        for key, line in feature.lines.items():
            for row in (main, helper):
                arrived = feature.journal.whisper(record, row, key, **values_for(feature, key, line)) is not None
                assert arrived == line.reach.reaches(row.subagent), f"{feature.name}.{key} is {line.reach}; it arrived at a subagent row: {row.subagent}"

    provider = PROVIDERS["claude"]()
    asked: list = []
    points = (POLICIES, AFTERWARDS, CANCELERS)
    kept = [list(point.entries) for point in points]
    for point, entries in zip(points, kept):
        point.entries = [replace(entry, value=spied(entry.value.guard, asked)) for entry in entries]
    every = [entry.value.guard for entries in kept for entry in entries]
    job = {"subagent_type": "general-purpose", "model": "haiku", "description": "look", "prompt": "look"}
    try:
        for subagent in (False, True):
            asked.clear()
            called = {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "Agent", "tool_input": job}
            hook = Hook.read({**called, "agent_id": "helper"} if subagent else called, provider.tool_kinds)
            call = HookCall(provider, record, hook, main)
            gated(call)
            cancelled(LONG_COMMAND, call, {})
            wanted = sorted((g for g in every if g.reaches(subagent)), key=repr)
            assert sorted(asked, key=repr) == wanted, f"a {'subagent' if subagent else 'main agent'}'s call asks exactly the guards that reach it"
    finally:
        for point, entries in zip(points, kept):
            point.entries = entries


PATCH = "*** Begin Patch\n*** Add File: web/x.py\n+print(1)\n*** End Patch"
OWN_SHAPES = {
    "claude": {
        "writes": [("Write", {"file_path": "web/x.py"}), ("Edit", {"file_path": "web/x.py"}), ("MultiEdit", {"file_path": "web/x.py"}), ("Bash", {"command": "echo x > web/x.py"})],
        "reads": [("Read", {"file_path": "web/x.py"}), ("Bash", {"command": "cat web/x.py"})],
        "malformed": [("Bash", {"nothing": 1}), ("Bash", "a string"), ("Write", {})],
    },
    "codex": {
        "writes": [("apply_patch", {"input": PATCH}), ("exec_command", {"cmd": "echo x > web/x.py"}), ("shell", {"command": ["bash", "-lc", "echo x > web/x.py"]}),
                   ("shell_command", {"command": "git commit -m x"})],
        "reads": [("exec_command", {"cmd": "cat web/x.py"}), ("shell", {"command": ["bash", "-lc", "cat web/x.py"]})],
        "malformed": [("exec_command", {"nothing": 1}), ("shell", "a string"), ("apply_patch", {})],
    },
}


def test_the_gate_holds_each_providers_own_tool_shapes_and_lets_a_malformed_call_through():
    features.load()
    REFUSED = features.FEATURES["work_tracking"].line("undeclared held", {})[0]
    record = fresh()
    project = str(record.root.parent)
    for name, provider_cls in PROVIDERS.items():
        provider, shapes, session = provider_cls(), OWN_SHAPES[name], f"{name}-9"

        def hook(tool, given):
            return handle(provider, record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": session, "tool_name": tool, "tool_input": given, "cwd": project})
        handle(provider, record.root, record.env, {"hook_event_name": "SessionStart", "session_id": session, "cwd": project})
        for tool, given in shapes["writes"]:
            assert hook(tool, given) == provider.blocking(REFUSED), f"{name}: {tool} with {sorted(given)} is a write, and refused with nothing open"
        for tool, given in shapes["reads"] + shapes["malformed"]:
            assert hook(tool, given) == {}, f"{name}: {tool} with {given!r} is a read or a call the gate cannot read, and passes"
        work = Works(record, actor=AGENT).create(f"work for {name}")
        for tool, given in shapes["writes"]:
            assert hook(tool, given) == {}, f"{name}: {tool} passes once work is open"
        Works(record, actor=AGENT).complete(work.n, "done")


def transcript_lines(*rows) -> str:
    return "".join(json.dumps(row) + "\n" for row in rows)


FIXTURES = {
    "claude": ("main.jsonl", (
        {"type": "user", "timestamp": "2026-10-06T10:00:00Z", "message": {"role": "user", "content": "hello"}},
        {"type": "assistant", "timestamp": "2026-10-06T10:00:05Z", "message": {"id": "m1", "model": "claude-opus-5-5", "content": [{"type": "text", "text": "ok"}],
                                                                        "usage": {"input_tokens": 20000, "cache_read_input_tokens": 80000, "cache_creation_input_tokens": 0}}})),
    "codex": ("rollout-2026-10-06T10-00-00-main.jsonl", (
        {"timestamp": "2026-10-06T10:00:00.000Z", "type": "session_meta", "payload": {"id": "main"}},
        {"timestamp": "2026-10-06T10:00:01.000Z", "type": "event_msg",
         "payload": {"type": "token_count", "info": {"last_token_usage": {"total_tokens": 50000}, "model_context_window": 200000}}})),
}
EXPECTED = {"claude": ("claude-opus-5-5", 50.0), "codex": ("the-hook-model", 25.0)}


def test_a_session_start_reads_session_model_and_context_from_each_providers_own_transcript(tmp_path):
    features.load()
    record = fresh()
    for name, provider_cls in PROVIDERS.items():
        file, rows = FIXTURES[name]
        path = tmp_path / name / file
        path.parent.mkdir()
        path.write_text(transcript_lines(*rows))
        handle(provider_cls(), record.root, record.env, {"hook_event_name": "SessionStart", "session_id": "ignored", "transcript_path": str(path),
                                                         "cwd": str(record.root.parent), "model": "the-hook-model"})
        row = Agents(record, actor=SYSTEM).by_session(path.stem)
        assert (row.provider, row.model, row.context, row.parent, row.transcript) == (name, *EXPECTED[name], "", str(path)), \
            f"{name}: the row is the transcript's session, with the model and the percent of the window its transcript says"
    claude = PROVIDERS["claude"]()
    switched = tmp_path / "claude" / FIXTURES["claude"][0]
    status = Path.home().joinpath(".journal", "claude-status", f"{switched.stem}.json")
    status.parent.mkdir(parents=True, exist_ok=True)
    status.write_text(json.dumps({"model": {"id": "claude-switched-model", "display_name": "Switched"}}))
    handle(claude, record.root, record.env, {"hook_event_name": "UserPromptSubmit", "session_id": "ignored", "transcript_path": str(switched),
                                             "cwd": str(record.root.parent)})
    assert Agents(record, actor=SYSTEM).by_session(switched.stem).model == "claude-switched-model", \
        "claude: a model switched in the session shows at once, from Claude Code's own status, before the transcript names it"
    child = tmp_path / "claude" / "main" / "subagents" / "agent-sub1.jsonl"
    child.parent.mkdir(parents=True)
    child.write_text(transcript_lines(FIXTURES["claude"][1][1]))
    handle(claude, record.root, record.env, {"hook_event_name": "SessionStart", "session_id": "sub1", "transcript_path": str(child), "cwd": str(record.root.parent)})
    row = Agents(record, actor=SYSTEM).by_session(child.stem)
    assert (row.model, row.context, row.uses) == ("", 0, 0), "claude: a hook from a subagent's transcript leaves its row without the main agent's facts"


def test_a_codex_child_thread_is_handled_by_its_hooks_as_a_subagent_like_claudes(tmp_path):
    features.load()
    record = fresh()
    child = tmp_path / "rollout-2026-10-06T10-00-00-child.jsonl"
    child.write_text(transcript_lines({"timestamp": "2026-10-06T10:00:00.000Z", "type": "session_meta",
                                       "payload": {"id": "child", "source": {"subagent": {"thread_spawn": {"parent_thread_id": "the-parent"}}}}}))
    codex = PROVIDERS["codex"]()

    def hook(event, **more):
        return handle(codex, record.root, record.env, {"hook_event_name": event, "session_id": "child", "transcript_path": str(child), "cwd": str(record.root.parent), **more})
    raw = {"hook_event_name": "PreToolUse", "session_id": "child", "transcript_path": str(child)}
    assert codex.is_subagent(Hook.read(raw, codex.tool_kinds)) is True, "codex: a hook whose transcript names a parent thread comes from a subagent"
    hook("SessionStart")
    assert hook("PreToolUse", tool_name="apply_patch", tool_input={"input": PATCH}) == {}, \
        "codex: a child thread's write is held by neither the open-work gate nor the skill hold, as a Claude subagent's is not"
    row = Agents(record, actor=SYSTEM).by_session(child.stem)
    assert (row.parent, row.subagent, row.uses) == ("the-parent", True, 0), \
        "codex: the child's row names its parent and counts as a subagent, and its tool use is not counted as a main agent's"
    claude = PROVIDERS["claude"]()
    assert claude.is_subagent(Hook.read({**raw, "agent_id": "sub1"}, claude.tool_kinds)) is True, "claude: a hook with an agent id is a subagent's"
    asked = {"hook_event_name": "PreToolUse", "session_id": "sub1", "agent_id": "sub1", "tool_name": "Edit", "tool_input": {"file_path": "web/x.py"}, "cwd": str(record.root.parent)}
    assert handle(claude, record.root, record.env, asked) == {}, "claude: a subagent's write is held by neither the open-work gate nor the skill hold, which reach main agents only"


def test_the_claude_channel_answers_its_handshake_and_delivers_each_queued_line_once(tmp_path, monkeypatch):
    monkeypatch.delenv(ACTIVE_ENV, raising=False)
    assert channel.answer(Asked("initialize", 1))["capabilities"] == {}, "a channel the journal did not launch offers no channel capability"
    monkeypatch.setenv(ACTIVE_ENV, "1")
    initialized = channel.answer(Asked("initialize", 1))
    assert (initialized["capabilities"], initialized["serverInfo"]["name"]) == ({"experimental": {"claude/channel": {}}}, "journal"), \
        "a launched channel answers initialize with the channel capability"
    assert (channel.answer(Asked("tools/list", 2)), channel.answer(Asked("notifications/initialized")), channel.answer(Asked("ping", 3))) == ({"tools": []}, None, {}), \
        "a list is empty, a notification is not answered and any other call gets an empty result"

    queued = tmp_path / "queue.jsonl"
    queued.write_text(json.dumps({"content": "queued before the channel started"}) + "\n")
    at = channel.start(queued)
    queued.write_text(queued.read_text() + json.dumps({"content": "one"}) + "\n" + json.dumps({"content": "two"}) + "\n")
    lines, at = channel.fresh_lines(queued, at)
    assert (channel.contents(lines), channel.fresh_lines(queued, at)) == (["one", "two"], ([], at)), "a line appended after the start arrives once, and not again"
    queued.write_text(json.dumps({"content": "after a truncation"}) + "\n")
    lines, at = channel.fresh_lines(queued, at + 100)
    assert (channel.contents(lines), channel.fresh_lines(queued, at)) == (["after a truncation"], ([], at)), \
        "a queue truncated and written again is read from its start: the new line is neither lost nor sent twice"
    queued.write_text("")
    assert channel.fresh_lines(queued, at) == ([], 0), "a queue truncated to nothing is read from its start"
    assert channel.contents(["not json", json.dumps({"content": ""}), json.dumps({"content": "kept"})]) == ["kept"], "a line that is no message or says nothing is dropped"

    sent, stopped = [], threading.Event()

    class Stop(Exception):
        pass

    def pushing(*given):
        try:
            channel.push(*given)
        except Stop:
            pass

    class Clock:
        @staticmethod
        def sleep(seconds: float) -> None:
            if stopped.is_set():
                raise Stop
            time.sleep(0.01)
    monkeypatch.setattr(channel, "time", Clock)
    monkeypatch.setattr(channel, "say", sent.append)
    root = tmp_path / ".journal"
    queue = runtime.channel_queue(root, 4242)
    queue.parent.mkdir(parents=True)
    thread = threading.Thread(target=pushing, args=(root, 4242), daemon=True)
    thread.start()
    queue.write_text(json.dumps({"content": "first"}) + "\n")
    waited = time.monotonic()
    while len(sent) < 1 and time.monotonic() - waited < 10:
        time.sleep(0.02)
    with queue.open("a") as appended:
        appended.write(json.dumps({"content": "second"}) + "\n")
    while len(sent) < 2 and time.monotonic() - waited < 10:
        time.sleep(0.02)
    stopped.set()
    thread.join(timeout=10)
    assert [message["params"]["content"] for message in sent] == ["first", "second"], "a line appended to the queue arrives as one notification, each once"
    assert (sent[0]["method"], sent[0]["params"]["meta"], runtime.channel_alive(root, 4242).is_file()) == ("notifications/claude/channel", {"from": "journal"}, True), \
        "the notification is the channel one, from the journal, and the channel marks itself alive"


def test_the_hook_route_refuses_in_the_providers_shape_and_a_stranger_with_409():
    features.load()
    blocked = features.FEATURES["work_tracking"].line("undeclared held", {})[0]
    record = fresh()
    query = {"root": str(record.root), "env": record.env, "pid": "0"}
    wrong = {}
    for name, provider in PROVIDERS.items():
        hook = {"session_id": f"{name}-9"}
        handle(provider(), record.root, record.env, {**hook, "hook_event_name": "SessionStart"})
        edit = {**hook, "hook_event_name": "PreToolUse", "tool_name": "Edit", "tool_input": {"file_path": "x.py"}}
        refusal = request("POST", f"/api/hook/{name}", record.root, query, edit)
        elsewhere = request("POST", f"/api/hook/{name}", record.root, {**query, "root": str(record.root.parent / "elsewhere")}, edit)
        facts = {"a refused write is a 403 carrying the provider's blocking body": (refusal.code, refusal.body) == (403, provider().blocking(blocked)),
                 "a hook meant for another journal's root is a 409": elsewhere.code == 409}
        wrong[name] = [fact for fact, ok in facts.items() if not ok]
    assert {name: lapsed for name, lapsed in wrong.items() if lapsed} == {}, "every provider's hook route answers a refusal in its own shape and a stranger with 409"
    assert request("POST", "/api/hook/nobody", record.root, query, {}).code == 409, "a provider the journal does not know is a 409"
