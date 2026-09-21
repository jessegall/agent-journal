import json

import features
from controllers.types import Agents
from engine.actors import Agent, BUSY, IDLE, STOPPED, WORKING
from engine.drivers import DRIVERS
from engine.hooks import EVENTS, STATUS, handle
from engine.record import Record
from features.work.auto import QUESTION_REFUSAL
from providers import PROVIDERS
from providers.payload import Hook
from resources.types import AgentRow
from resources.base import SYSTEM
from tests.conftest import fresh

import pytest


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_the_hook_payload_is_read_once_into_typed_fields():
    hook = Hook.read({"hook_event_name": "PreToolUse", "session_id": "s-1", "transcript_path": "/t/abc-7.jsonl", "cwd": "/p", "model": "m",
                      "tool_name": "Agent", "tool_input": {"subagent_type": "auditor", "model": "haiku", "command": "ls"}, "tool_response": {"session_id": "sh-1"}})
    assert (hook.event, hook.session, str(hook.transcript), hook.cwd, hook.model, hook.tool.name, hook.tool.subagent_type, hook.tool.model, hook.command, hook.tool.response) == \
        ("PreToolUse", "abc-7", "/t/abc-7.jsonl", "/p", "m", "Agent", "auditor", "haiku", "ls", {"session_id": "sh-1"}), \
        "the hook payload is read once into typed fields: event, session from the transcript, tool and its inputs"

    def said(name, **given):
        return Hook.read({"tool_name": name, "tool_input": given}).tool.doing

    assert (said("Read", file_path="/p/web/src/gist.js"), said("Edit", file_path="/p/Turn.vue"), said("Write", file_path="/p/new.py"),
            said("Grep", pattern="def foo"), said("Glob", pattern="**/*.vue"), said("Agent", subagent_type="auditor"), said("Skill", skill="journal"),
            said("mcp__playwright__browser_navigate"), said("WebFetch", url="https://docs.example.com/a/b"), said("Bash", command="ls -la"), said("TodoWrite")) == \
        ("reading gist.js", "editing Turn.vue", "writing new.py", "searching def foo", "searching **/*.vue", "dispatching auditor", "loading skill journal",
         "playwright · browser navigate", "fetching docs.example.com", "ls -la", "todowrite"), \
        "every tool use has words the status bar and the band show: files by name, patterns, agents, skills, mcp as server · tool"
    assert (Hook.read({}).event, Hook.read({}).session, Hook.read({}).transcript, Hook.read({}).tool.name) == ("", "", None, ""), \
        "an empty payload reads to empty fields, never to a KeyError"


def test_every_provider_wires_hooks_writes_status_and_tracks_running_commands(tmp_path):
    for name, cls in PROVIDERS.items():
        provider = cls()
        project = tmp_path / name
        project.mkdir()
        root = project / ".journal"
        f = provider.wire(project, "sh /x/hook.sh claude /r /py")
        got = json.loads(f.read_text())
        assert (f.is_relative_to(project), sorted(got["hooks"])) == (True, sorted(EVENTS)), f"{name}: wires every hook event into its own config file"
        assert all("/x/hook.sh" in json.dumps(v) for v in got["hooks"].values()) is True, f"{name}: each hook runs the one command"
        record = Record(root, "main")
        agents = Agents(record, actor=SYSTEM)
        payload = {"session_id": "abc-1", "transcript_path": f"/tmp/{name}/abc-1.jsonl", "cwd": str(project)}
        was = ""
        for event in EVENTS:
            handle(provider, root, "main", {**payload, "hook_event_name": event, "tool_name": "Bash" if "Tool" in event else ""})
            row = agents.by_session("abc-1")
            want = STATUS[event] or was or "idle"
            assert (row.data["status"], row.data["event"], row.data["provider"]) == (want, event, name), f"{name}: {event} writes the agent's status {want}"
            was = want
        assert len(agents.all()) == 1, f"{name}: one agent row per session, not one per hook"
        assert (handle(provider, root, "main", {**payload, "hook_event_name": "Whatever"}), len(record.events())) == ({}, 1 + len(EVENTS)), \
            f"{name}: an unknown hook writes nothing"
        driver = DRIVERS[name](record, "abc-1", fd=1)
        agent = Agent(record, driver)
        assert agent.state() == STOPPED, f"{name}: the engine's agent reads the status the hook wrote"
        handle(provider, root, "main", {**payload, "hook_event_name": "Stop"})
        driver.quiet_for = lambda: 2.0
        assert agent.state() == IDLE, f"{name}: after a Stop the agent is idle"
        handle(provider, root, "main", {**payload, "hook_event_name": "PreToolUse", "tool_name": "Bash"})
        driver.quiet_for = lambda: 0.2
        assert agent.state() == BUSY, f"{name}: after a tool call starts without declared work it is busy"
        handle(provider, root, "main", {**payload, "hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "npm run build"}})
        row = agents.by_session("abc-1").data
        assert (row["running"]["what"], "done" in row["running"], [c["what"] for c in row["commands"]]) == ("npm run build", False, ["npm run build"]), \
            f"{name}: a shell command is reported as running and joins the ring"
        handle(provider, root, "main", {**payload, "hook_event_name": "PostToolUse", "tool_name": "Bash", "tool_input": {"command": "npm run build"}})
        row = agents.by_session("abc-1").data
        assert (row["running"]["done"] >= row["running"]["at"], len(row["commands"])) == (True, 1), \
            f"{name}: its end stamps the running command done; a read reports no command"
        agents.update(agents.by_session("abc-1").n, running={**row["running"], "changed": {"edited": 2}})
        handle(provider, root, "main", {**payload, "hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "npm test"}})
        assert ("changed" in agents.by_session("abc-1").running) is False, \
            f"{name}: a new command starts without the last one's line changes, so the bar hides them until it edits"
        handle(provider, root, "main", {**payload, "hook_event_name": "UserPromptSubmit"})
        assert agents.by_session("abc-1").running == {}, f"{name}: the next turn clears the command and its change count"
        logged = (root / "runtime" / "commands.log").read_text().splitlines()
        assert [line.split("\t")[1] for line in logged][-2:] == ["'npm run build'", "'npm test'"], \
            f"{name}: every command starting is logged raw, as received, for the record"
        handle(provider, root, "main", {**payload, "hook_event_name": "PreToolUse", "tool_name": "Read", "tool_input": {"file_path": "/x"}})
        assert [(c["what"], c["tool"]) for c in agents.by_session("abc-1").data["commands"]][-1] == ("reading x", "Read"), \
            f"{name}: a read joins the ring in words, with its tool, so the bar shows it as it is"
        agents.set(agents.by_session("abc-1").n, "status", IDLE)
        assert agents.by_session("abc-1").data["status"] == IDLE, f"{name}: journal agent set status idle is the same funnel"
        question = {**payload, "hook_event_name": "PreToolUse", "tool_name": {"claude": "AskUserQuestion", "codex": "request_user_input"}[name]}
        assert handle(provider, root, "main", question) == {}, f"{name}: a blocking question is allowed while auto is off"
        record.features = {**record.features, "auto": True}
        assert handle(provider, root, "main", question) == {"decision": "block", "reason": QUESTION_REFUSAL}, f"{name}: auto refuses its blocking question tool"
        assert handle(provider, root, "main", {**question, "tool_name": "Read"}) == {}, f"{name}: auto leaves an ordinary read alone"
        if name == "codex":
            transcript = project / "rollout.jsonl"
            transcript.write_text("not json\n" + "\n".join(json.dumps(r) for r in [
                {"type": "session_meta", "payload": {"source": {}}},
                {"type": "event_msg", "payload": {"type": "token_count", "info": {"last_token_usage": {"total_tokens": 129200}, "model_context_window": 258400}}},
                {"type": "response_item", "timestamp": "2026-09-19T10:00:00Z", "payload": {"type": "custom_tool_call", "name": "exec", "input": 'const r=await tools.exec_command({cmd:"sed -n 1,80p .codex/skills/journal/SKILL.md"});'}},
                {"type": "response_item", "timestamp": "2026-09-19T10:00:01Z", "payload": {"type": "function_call", "namespace": "collaboration", "name": "spawn_agent", "arguments": {"task_name": "audit"}}},
                {"type": "response_item", "timestamp": "2026-09-19T10:00:02Z", "payload": {"type": "custom_tool_call_output", "output": "Script running with cell ID 41"}},
            ]) + "\n")
            handle(provider, root, "main", {**payload, "transcript_path": str(transcript), "hook_event_name": "Stop"})
            crew = provider.crew(transcript)
            assert (agents.by_session("rollout").context, crew["skills"], crew["subagents"], crew["shells"]) == (50.0, ["journal"], 1, 1), \
                "codex: rollout context, skills, native subagents and yielded shells are detected"
            assert (crew["shell_rows"][0]["cell"], crew["subagent_rows"][0]["task"]) == ("41", "audit"), \
                "codex: crew details identify the yielded shell and spawned task"
            with transcript.open("a") as out:
                out.write(json.dumps({"type": "event_msg", "payload": {"type": "token_count", "info": {"last_token_usage": {"total_tokens": 193800}, "model_context_window": 258400}}}) + "\n")
            handle(provider, root, "main", {**payload, "transcript_path": str(transcript), "hook_event_name": "PreToolUse"})
            assert agents.by_session("rollout").context == 75.0, "codex: each hook refreshes the latest rollout context"
            child = project / "child.jsonl"
            child.write_text("bad json\n" + json.dumps({"type": "session_meta", "payload": {"source": {"subagent": {"thread_spawn": {"parent_thread_id": "main-thread"}}}}}) + "\n")
            assert provider.session(child)["parent"] == "main-thread", "codex: a native subagent transcript reports its parent session"


EFFECTS = {
    "python3 tests/test_gist.py 2>&1 | tail -2": "tests",
    "/opt/homebrew/Frameworks/Python.framework/Versions/3.14/Resources/Python.app/Contents/MacOS/Python tests/features/files/test_changed.py": "tests",
    "for t in $(find tests -name 'test_*.py'); do python3 $t; done": "tests",
    "for t in tests/*.py; do python3 $t; done": "tests",
    "for f in src/*.py; do python3 $f; done": "",
    "cd web && npm test": "tests",
    "rm -rf build": "deletes",
    "git rm old.py": "deletes",
    "python3 - <<'EOF'\nfrom pathlib import Path\nPath('a').write_text('x')\nEOF": "writes",
    "sed -i '' 's/a/b/' f.py": "writes",
    "echo hi > out.txt": "writes",
    "cat a.py": "reads",
    "grep -n foo x.py | head": "searches",
    "cat *.md": "searches",
    "find . -name x": "searches",
    "cd web && npm run build": "builds",
    'git commit -m "npm run build is not what this does"': "writes",
    "git status": "reads",
    "journal todo all": "",
    'journal work log 5 "done > shipped" >/dev/null; python3 - <<\'EOF\'\nimport pathlib\npathlib.Path("a").write_text("x")\nEOF': "writes",
    'journal message reply 3 "use a > b" >/dev/null': "",
    'W=$(journal todo show 5 | grep work); journal work log $W "x"; git commit -m y': "writes",
}


def test_a_shell_commands_effect_is_a_fact_the_provider_reports():
    claude = PROVIDERS["claude"]()
    assert {c: claude.effect(Hook.read({"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": c}})) for c in EFFECTS} == EFFECTS, \
        "each shell command is classified by what it does"
    read_only = "python3 - <<'EOF'\nprint(open('a').read())\nEOF"
    assert (claude.effect(Hook.read({"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": read_only}})),
            claude.writes(Hook.read({"hook_event_name": "PostToolUse", "tool_name": "Bash", "tool_input": {"command": read_only}}))) == ("", False), \
        "a heredoc that only reads is neither editing nor a write"
    reading = 'cd /x && journal todo start 221 2>&1|tail -1; grep -n "a\\|<template v-if=\\"family\\">\\|b" f.vue | sed -n 1,40p'
    assert (claude.without_journal(reading).startswith("cd /x && |tail"), claude.effects(reading),
            claude.writes(Hook.read({"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": reading}}))) == \
        (True, ["searches", "reads"], False), "a journal call with 2>&1 is set aside whole, and a > inside escaped quotes is not a redirect"
    assert ([claude.effect_of(c) for c in ("grep 'c>=2' f", "git commit -m 'a > b'")],
            claude.writes(Hook.read({"hook_event_name": "PostToolUse", "tool_name": "Bash", "tool_input": {"command": "python3 tests/x.py && git commit -m y"}}))) == \
        (["searches", "writes"], True), "a quoted > is text, not a redirect; tests then a commit is still a write"
    assert [claude.writes(Hook.read({"hook_event_name": "PostToolUse", "tool_name": "Bash", "tool_input": {"command": c}}))
            for c in ('journal work log 5 "x"; git commit -m y', 'journal message reply 3 "a > b"', ".journal/journal todo create x")] == [True, False, False], \
        "an edit next to a journal call is still a write, and journal calls alone never are"
    assert all(claude.writes(Hook.read({"hook_event_name": "PostToolUse", "tool_name": "Bash", "tool_input": {"command": c}}))
               for c, e in EFFECTS.items() if e in ("writes", "deletes")) is True, "a command labelled editing is one whose line changes are counted"
    assert [claude.effect(Hook.read({"hook_event_name": "PreToolUse", "cwd": "/p", "tool_name": name, "tool_input": {"file_path": path}}))
            for name, path in (("Read", "x"), ("Read", "/somewhere/else/x"), ("Grep", ""), ("WebFetch", ""), ("Agent", ""), ("Skill", ""), ("TodoWrite", ""))] == \
        ["reads", "reads", "searches", "fetches", "dispatches", "loads", ""], \
        "every tool says what it did: reading a file wherever it is, searching, fetching, dispatching, loading"
    assert claude.effect(Hook.read({"hook_event_name": "PreToolUse", "cwd": "/p", "tool_name": "Edit", "tool_input": {"file_path": "/somewhere/else/x"}})) == "", \
        "a write outside the project is not counted as one"
    shelled = claude.shell(AgentRow(n=1, title="s"), Hook.read({"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "rm x", "description": "Remove x"}}))
    ring = AgentRow(n=1, title="s", data={"running": {}, "commands": [{"what": "sleep 90", "tool": "Bash", "at": 1.0},
                                                                      {"what": "echo done", "tool": "Bash", "at": 2.0}]})
    late = claude.shell(ring, Hook.read({"hook_event_name": "PostToolUse", "tool_name": "Bash", "tool_input": {"command": "echo done"}}))
    assert [(c["what"], bool(c.get("done"))) for c in late["commands"]] == [("sleep 90", False), ("echo done", True)], \
        "a command that reports back is the one marked finished, even when another is still running"
    assert (shelled["running"].get("effect"), shelled["commands"][-1].get("effect")) == ("deletes", "deletes"), \
        "the effect rides on the running command and on its entry in the recent commands"


def test_the_current_effort_is_read_from_each_providers_own_settings(tmp_path, monkeypatch):
    home = tmp_path / "home"
    project = tmp_path / "project"
    home.mkdir()
    project.mkdir()
    (home / ".claude").mkdir()
    (home / ".claude" / "settings.json").write_text(json.dumps({"effortLevel": "high"}))
    monkeypatch.setenv("HOME", str(home))
    assert PROVIDERS["claude"]().effort(project) == "high", "Claude's effort comes from the user's settings"
    (project / ".claude").mkdir()
    (project / ".claude" / "settings.local.json").write_text(json.dumps({"effortLevel": "low"}))
    assert PROVIDERS["claude"]().effort(project) == "low", "a project's local setting wins"
    (home / ".codex").mkdir()
    (home / ".codex" / "config.toml").write_text('model = "gpt-5"\nmodel_reasoning_effort = "medium"\n')
    assert PROVIDERS["codex"]().effort(project) == "medium", "Codex's effort comes from its config"
    assert [c["value"] for g in PROVIDERS["claude"].controls["groups"] if g["key"] == "model" for c in g["choices"]][-1] == "claude-fable-5-1", \
        "Fable is offered by its current id"


def test_claude_context_window_and_effort_come_from_settings_the_model_and_the_transcript(tmp_path, monkeypatch):
    home = tmp_path / "home"
    project = tmp_path / "project"
    home.mkdir()
    project.mkdir()
    monkeypatch.setenv("HOME", str(home))
    transcript = project / "t.jsonl"
    transcript.write_text(json.dumps({"message": {"usage": {"input_tokens": 100_000}}}) + "\n")

    def used(model=""):
        return PROVIDERS["claude"]().context(Hook.read({"hook_event_name": "Stop", "transcript_path": str(transcript), "cwd": str(project), "model": model}))

    assert used() == 50.0, "with no long-context model set, the window is 200,000"
    (home / ".claude").mkdir()
    (home / ".claude" / "settings.json").write_text(json.dumps({"model": "opus[1m]"}))
    assert used() == 10.0, "a model set to [1m] in the settings means a million"
    (home / ".claude" / "settings.json").write_text(json.dumps({"model": "opus"}))
    assert used("claude-opus-5[1m]") == 10.0, "the model the hook names can say [1m] too"
    transcript.write_text(json.dumps({"message": {"usage": {"input_tokens": 400_000}}}) + "\n")
    assert used() == 40.0, "more than 200,000 in use can only be a million window"

    (home / ".claude" / "settings.json").write_text(json.dumps({"effortLevel": "medium"}))
    said_home = home / ".journal" / "claude-status"
    said_home.mkdir(parents=True)
    (said_home / f"{transcript.stem}.json").write_text(json.dumps({"effort": {"level": "max"}}))
    assert PROVIDERS["claude"]().effort(project, transcript) == "max", "the effort the CLI reports wins over the settings"
    (said_home / f"{transcript.stem}.json").write_text(json.dumps({"model": {"id": "x"}}))
    assert PROVIDERS["claude"]().effort(project, transcript) == "medium", "with nothing reported, the settings say what it is"
    assert PROVIDERS["claude"]().effort(project, project / "none.jsonl") == "medium", "with no confirmation in the transcript, the settings say"


def test_the_hooks_facts_ride_on_the_agents_event():
    facts = fresh()
    handle(PROVIDERS["claude"](), facts.root, facts.env, {"hook_event_name": "PostToolUse", "session_id": "claude-7", "tool_name": "Edit",
                                                       "cwd": str(facts.root.parent), "tool_input": {"file_path": str(facts.root.parent / "a.py")}})
    said = [e for e in facts.events() if e.type == "agent"][-1]
    assert (said.action, said.data["hook"], said.data["tool"], said.data["session"], said.data["file"].endswith("a.py")) == \
        ("updated", "PostToolUse", "Edit", "claude-7", True), "a hook writes what it saw on the agent's event"


def test_a_test_runs_outcome_is_read_from_its_output_and_kept_on_the_command():
    claude = PROVIDERS["claude"]()
    running = claude.shell(AgentRow(n=1, title="s"), Hook.read({"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "python3 tests/a.py"}}))["running"]
    ended = claude.shell(AgentRow(n=1, title="s", data={"running": running}), Hook.read({"hook_event_name": "PostToolUse", "tool_name": "Bash", "tool_input": {"command": "python3 tests/a.py"},
                                                                                          "tool_response": {"stdout": "a.py: 12 passed, 0 failed\nb.py: 3 passed, 1 failed"}}))["running"]
    assert ended.get("result") == {"passed": 15, "failed": 1}, "the summed outcome rides on the finished test command"
    assert [claude.outcome_of(Hook.read({"tool_name": "Bash", "tool_response": {"stdout": out}}), "builds")
            for out in ("✓ built in 700ms", "npm ERR! code 1", "")] == [{"ok": True}, {"ok": False}, None], \
        "a build is read as built or failed from what it printed"
    assert [claude.test_result(Hook.read({"tool_name": "Bash", "tool_response": {"stdout": out}})) for out in ("== 2 failed, 40 passed in 1s ==", "Tests: 1 failed, 9 passed, 10 total")] == \
        [{"passed": 40, "failed": 2}, {"passed": 9, "failed": 1}], "pytest and jest summaries are read too"
    outcomes = {
        "OK (12 tests, 30 assertions)": {"passed": 12, "failed": 0},
        "FAILURES!\nTests: 12, Assertions: 30, Failures: 2, Errors: 1.": {"passed": 9, "failed": 3},
        "Failed!  - Failed:     2, Passed:    10, Skipped:     0, Total:    12": {"passed": 10, "failed": 2},
        "Tests run: 3, Failures: 0, Errors: 0\nResults:\nTests run: 10, Failures: 1, Errors: 1, Skipped: 0": {"passed": 8, "failed": 2},
        "Finished in 0.1 seconds\n10 examples, 2 failures": {"passed": 8, "failed": 2},
        "Finished in 0.2 seconds\n7 tests, 0 failures": {"passed": 7, "failed": 0},
    }
    assert {out: claude.test_result(Hook.read({"tool_name": "Bash", "tool_response": {"stdout": out}})) for out in outcomes} == outcomes, \
        "PHPUnit, .NET, Maven, RSpec and mix summaries are read"
    assert [claude.effect_of(c) for c in ("dotnet test", "mvn -q test", "./gradlew test", "bundle exec rspec", "mix test")] == \
        ["tests", "tests", "tests", "tests", "tests"], "more test runners are recognised"
    assert [claude.effect_of(c) for c in ("npm ci", "pip install -r req.txt", "composer install --no-scripts", "go mod tidy", "uv pip install ruff")] == \
        ["installs", "installs", "installs", "installs", "installs"], "installing dependencies is its own kind"
    assert [claude.effect_of(c) for c in ("npm run build", "npx vite build", "make", "cargo build --release", "mvn package")] == \
        ["builds", "builds", "builds", "builds", "builds"], "building is its own kind"
    assert [claude.effect_of(c) for c in ("npm test", "mvn -q test", "cargo test")] == ["tests", "tests", "tests"], \
        "a test run is still a test run, not a build"
    assert claude.test_result(Hook.read({"tool_name": "Bash", "tool_response": {"stdout": "built"}})) is None, "output with no summary gives no outcome"


def test_subagents_and_background_shells_are_listed_with_whether_they_run(tmp_path):
    claude = PROVIDERS["claude"]()
    crewed = tmp_path / "main.jsonl"

    def said_by(role, content, at):
        return json.dumps({"type": role, "timestamp": at, "message": {"role": role, "content": content}})

    crewed.write_text("\n".join([
        said_by("assistant", [{"type": "tool_use", "id": "t1", "name": "Agent", "input": {"description": "Audit core", "subagent_type": "auditor", "model": "sonnet", "run_in_background": True}},
                              {"type": "tool_use", "id": "t2", "name": "Agent", "input": {"description": "Quick lookup", "model": "haiku"}},
                              {"type": "tool_use", "id": "t3", "name": "Bash", "input": {"command": "npm run dev", "run_in_background": True}}], "2026-09-19T10:00:00Z"),
        said_by("user", [{"type": "tool_result", "tool_use_id": "t1", "content": "launched"}, {"type": "tool_result", "tool_use_id": "t2", "content": "found it"},
                         {"type": "tool_result", "tool_use_id": "t3", "content": "running in background"}], "2026-09-19T10:00:05Z"),
        json.dumps({"type": "queue-operation", "operation": "enqueue", "timestamp": "2026-09-19T10:02:00Z", "content": "<task-notification>\n<tool-use-id>t3</tool-use-id>\n<status>failed</status>\n</task-notification>"}),
    ]) + "\n")
    home = crewed.with_suffix("") / "subagents"
    home.mkdir(parents=True)
    (home / "agent-abc.meta.json").write_text(json.dumps({"toolUseId": "t1"}))
    (home / "agent-abc.jsonl").write_text(json.dumps({"type": "user", "isSidechain": True, "agentId": "abc", "timestamp": "2026-09-19T10:00:01Z", "message": {"role": "user", "content": "audit the core"}}) + "\n")
    crew = claude.crew(crewed)
    assert [(r["task"], r["type"], r["model"], r["running"], r["session"]) for r in crew["subagent_rows"]] == \
        [("Audit core", "auditor", "sonnet", True, "abc"), ("Quick lookup", "", "haiku", False, "")], \
        "subagents: the background one runs with its session, the foreground one returned"
    assert [(r["command"], r["running"], r["status"]) for r in crew["shell_rows"]] == [("npm run dev", False, "failed")], \
        "a background shell ends with the status its notification gives"
    assert [t.text for t in claude.transcript(claude.subagent_transcript(crewed, "abc"))] == ["audit the core"], \
        "a subagent's own session reads as a transcript"
    assert claude.subagent_transcript(crewed, "nope") is None, "an unknown session gives no transcript path"


def test_an_edit_tool_reports_the_writes_effect_only_inside_the_project():
    claude = PROVIDERS["claude"]()
    edit_in = Hook.read({"hook_event_name": "PreToolUse", "tool_name": "Edit", "cwd": "/p", "tool_input": {"file_path": "/p/a.py"}})
    edit_out = Hook.read({"hook_event_name": "PreToolUse", "tool_name": "Edit", "cwd": "/p", "tool_input": {"file_path": "/elsewhere/a.py"}})
    assert (claude.effect(edit_in), claude.effect(edit_out)) == ("writes", ""), "an edit inside the project writes; outside it has no effect"


def test_a_new_command_keeps_the_finished_one_so_its_line_counts_can_still_arrive():
    claude = PROVIDERS["claude"]()
    finished = {"what": "sed -i x f.py", "tool": "Bash", "at": 1.0, "done": 2.0, "effect": "writes", "changed": {"added": 3}, "step": "sed"}
    nxt = claude.shell(AgentRow(n=1, title="s", data={"running": finished}), Hook.read({"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "git status"}}))["running"]
    assert (nxt["what"], nxt["before"]) == ("git status", {"what": "sed -i x f.py", "tool": "Bash", "at": 1.0, "done": 2.0, "effect": "writes", "changed": {"added": 3}}), \
        "the finished command rides along as before, without its step"
    unfinished = claude.shell(AgentRow(n=1, title="s", data={"running": {"what": "a", "at": 1.0}}), Hook.read({"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "b"}}))["running"]
    assert ("before" in unfinished) is False, "a command that never finished is not kept"
