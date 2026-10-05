from dataclasses import replace
import inspect
import json


import features
from controllers.types import Agents, Works
from runner.gate import gated
from runner.hooks import handle
from engine.gates import AFTERWARDS, CANCELERS, LONG_COMMAND, POLICIES, HookCall, cancelled, gate_file
from engine.gates import held
from engine.wording import APPENDS
from providers import PROVIDERS
from providers.payload import Hook
from resources.base import AGENT, SYSTEM
from resources.types import SUBAGENT
from tests.conftest import fresh



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
    from commands.dispatch import dispatch
    import commands.http  # noqa: F401
    from controllers.types import Notices, Nudges
    from resources.base import SYSTEM
    from tests.kit import report
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")

    for name, provider_cls in PROVIDERS.items():
        def crash(self, hook, root):
            raise TypeError(f"{name} crashed")
        monkeypatch.setattr(provider_cls, "facts", crash)
        body = {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "Read", "tool_input": {"file_path": "x.py"}}
        dispatch("POST", f"/api/hook/{name}", record.root, {"root": str(record.root), "env": record.env}, body)
        lines = [f"{n.title} {n.brief}" for n in Nudges(record, actor=SYSTEM)._every()]
        assert any("hit an error" in line and f"TypeError: {name} crashed" in line for line in lines), \
            f"{name}: a crash inside the hook reaches the agent, with the error"
        dispatch("POST", f"/api/hook/{name}", record.root, {"root": str(record.root), "env": record.env}, body)
        assert len([line for line in lines if "crashed" in line]) == len([n for n in Nudges(record, actor=SYSTEM)._every() if "crashed" in n.brief]), \
            f"{name}: the same error again is not told twice"
        for notice in Notices(record, actor=SYSTEM)._standing():
            Notices(record, actor=SYSTEM).complete(notice.n, "fixed")
    monkeypatch.undo()
    from engine import runtime
    runtime.hook_failures(record.root).write_text(f"1790000000 000 claude {record.env}\n1790000001 500 claude {record.env}\n")
    commands.http.unanswered(record.root)
    lines = [f"{n.title} {n.brief}" for n in Nudges(record, actor=SYSTEM)._every()]
    assert any("no answer from the server 2 times (codes 000, 500)" in line for line in lines), \
        "hooks the server never answered are told once it answers again"
    assert not runtime.hook_failures(record.root).exists(), "and are told only once"
    monkeypatch.setattr(runtime, "STARTED", [1790000100.0])
    runtime.hook_failures(record.root).write_text(f"1790000095 000 claude {record.env}\n")
    commands.http.unanswered(record.root)
    assert len([n for n in Nudges(record, actor=SYSTEM)._every() if "no answer from the server" in n.brief]) == 1, \
        "a hook missed while the server was restarting is not an error"
    runtime.restarting(record.root).write_text("1790000060")
    runtime.hook_failures(record.root).write_text(f"1790000070 000 claude {record.env}\n")
    commands.http.unanswered(record.root)
    assert len([n for n in Nudges(record, actor=SYSTEM)._every() if "no answer from the server" in n.brief]) == 1, \
        "however long a restart the journal began itself takes, the hooks it missed are not an error"


def test_a_command_runs_as_the_session_its_own_shell_names_for_every_provider(monkeypatch):
    import os
    from commands.cli import context
    from commands.parser import parser
    from engine.sessions import Sessions
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
    dispatch = {"subagent_type": "general-purpose", "model": "haiku", "description": "look", "prompt": "look"}
    try:
        for subagent in (False, True):
            asked.clear()
            called = {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "Agent", "tool_input": dispatch}
            hook = Hook.read({**called, "agent_id": "helper"} if subagent else called, provider.tool_kinds)
            call = HookCall(provider, record, hook, main)
            gated(call)
            cancelled(LONG_COMMAND, call, {})
            wanted = sorted((g for g in every if g.reaches(subagent)), key=repr)
            assert sorted(asked, key=repr) == wanted, f"a {'subagent' if subagent else 'main agent'}'s call asks exactly the guards that reach it"
    finally:
        for point, entries in zip(points, kept):
            point.entries = entries
