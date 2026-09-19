import json
import os
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import features  # noqa: E402
from controllers.types import Agents  # noqa: E402
from engine.actors import Agent, BUSY, IDLE, STOPPED, WORKING  # noqa: E402
from engine.drivers import DRIVERS  # noqa: E402
from engine.hooks import EVENTS, STATUS, handle  # noqa: E402
from engine.record import Record  # noqa: E402
from features.auto.policy import QUESTION_REFUSAL  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from providers.payload import Hook  # noqa: E402
from resources.types import AgentRow  # noqa: E402
from resources.base import SYSTEM  # noqa: E402
from tests.kit import check, done  # noqa: E402

features.unload()
features.load()

hook = Hook.read({"hook_event_name": "PreToolUse", "session_id": "s-1", "transcript_path": "/t/abc-7.jsonl", "cwd": "/p", "model": "m",
                  "tool_name": "Agent", "tool_input": {"subagent_type": "auditor", "model": "haiku", "command": "ls"}, "tool_response": {"session_id": "sh-1"}})
check("the hook payload is read once into typed fields: event, session from the transcript, tool and its inputs", (hook.event, hook.session, str(hook.transcript), hook.cwd, hook.model, hook.tool.name, hook.tool.subagent_type, hook.tool.model, hook.command, hook.tool.response),
      ("PreToolUse", "abc-7", "/t/abc-7.jsonl", "/p", "m", "Agent", "auditor", "haiku", "ls", {"session_id": "sh-1"}))
said = lambda name, **given: Hook.read({"tool_name": name, "tool_input": given}).tool.doing
check("every tool use has words the status bar and the band show: files by name, patterns, agents, skills, mcp as server · tool",
      (said("Read", file_path="/p/web/src/gist.js"), said("Edit", file_path="/p/Turn.vue"), said("Write", file_path="/p/new.py"), said("Grep", pattern="def foo"), said("Glob", pattern="**/*.vue"),
       said("Agent", subagent_type="auditor"), said("Skill", skill="journal"), said("mcp__playwright__browser_navigate"), said("WebFetch", url="https://docs.example.com/a/b"), said("Bash", command="ls -la"), said("TodoWrite")),
      ("reading gist.js", "editing Turn.vue", "writing new.py", "searching def foo", "searching **/*.vue", "dispatching auditor", "loading skill journal", "playwright · browser navigate", "fetching docs.example.com", "ls -la", "todowrite"))
check("an empty payload reads to empty fields, never to a KeyError", (Hook.read({}).event, Hook.read({}).session, Hook.read({}).transcript, Hook.read({}).tool.name), ("", "", None, ""))



for name, cls in PROVIDERS.items():                       # every provider, the same drill
    provider = cls()
    project = Path(tempfile.mkdtemp())
    root = project / ".journal"
    f = provider.wire(project, "sh /x/hook.sh claude /r /py")
    got = json.loads(f.read_text())
    check(f"{name}: wires every hook event into its own config file", (f.is_relative_to(project), sorted(got["hooks"])), (True, sorted(EVENTS)))
    check(f"{name}: each hook runs the one command", all("/x/hook.sh" in json.dumps(v) for v in got["hooks"].values()), True)
    record = Record(root, "main")
    agents = Agents(record, actor=SYSTEM)
    payload = {"session_id": "abc-1", "transcript_path": f"/tmp/{name}/abc-1.jsonl", "cwd": str(project)}
    for event in EVENTS:
        handle(provider, root, "main", {**payload, "hook_event_name": event, "tool_name": "Bash" if "Tool" in event else ""})
        row = agents.by_session("abc-1")
        check(f"{name}: {event} writes the agent's status {STATUS[event]}", (row.data["status"], row.data["event"], row.data["provider"]), (STATUS[event], event, name))
    check(f"{name}: one agent row per session, not one per hook", len(agents.all()), 1)
    check(f"{name}: an unknown hook writes nothing", (handle(provider, root, "main", {**payload, "hook_event_name": "Whatever"}), len(record.events())),
          ({}, 1 + len(EVENTS)))
    driver = DRIVERS[name](record, "abc-1", fd=1)
    agent = Agent(record, driver)
    check(f"{name}: the engine's agent reads the status the hook wrote", agent.state(), STOPPED)
    handle(provider, root, "main", {**payload, "hook_event_name": "Stop"})
    driver.quiet_for = lambda: 2.0
    check(f"{name}: after a Stop the agent is idle", agent.state(), IDLE)
    handle(provider, root, "main", {**payload, "hook_event_name": "PreToolUse", "tool_name": "Bash"})
    driver.quiet_for = lambda: 0.2
    check(f"{name}: after a tool call starts without declared work it is busy", agent.state(), BUSY)
    handle(provider, root, "main", {**payload, "hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "npm run build"}})
    row = agents.by_session("abc-1").data
    check(f"{name}: a shell command is reported as running and joins the ring", (row["running"]["what"], "done" in row["running"], [c["what"] for c in row["commands"]]), ("npm run build", False, ["npm run build"]))
    handle(provider, root, "main", {**payload, "hook_event_name": "PostToolUse", "tool_name": "Bash", "tool_input": {"command": "npm run build"}})
    row = agents.by_session("abc-1").data
    check(f"{name}: its end stamps the running command done; a read reports no command", (row["running"]["done"] >= row["running"]["at"], len(row["commands"])), (True, 1))
    agents.update(agents.by_session("abc-1").n, running={**row["running"], "changed": {"edited": 2}})
    handle(provider, root, "main", {**payload, "hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "npm test"}})
    check(f"{name}: a new command starts without the last one's line changes, so the bar hides them until it edits", "changed" in agents.by_session("abc-1").running, False)
    handle(provider, root, "main", {**payload, "hook_event_name": "UserPromptSubmit"})
    check(f"{name}: the next turn clears the command and its change count", agents.by_session("abc-1").running, {})
    logged = (root / "runtime" / "commands.log").read_text().splitlines()
    check(f"{name}: every command starting is logged raw, as received, for the record", [line.split("\t")[1] for line in logged][-2:], ["'npm run build'", "'npm test'"])
    handle(provider, root, "main", {**payload, "hook_event_name": "PreToolUse", "tool_name": "Read", "tool_input": {"file_path": "/x"}})
    check(f"{name}: a read joins the ring in words, with its tool, so the bar shows it as it is", [(c["what"], c["tool"]) for c in agents.by_session("abc-1").data["commands"]][-1], ("reading x", "Read"))
    agents.set(agents.by_session("abc-1").n, "status", IDLE)
    check(f"{name}: journal agent set status idle is the same funnel", agents.by_session("abc-1").data["status"], IDLE)
    question = {**payload, "hook_event_name": "PreToolUse", "tool_name": {"claude": "AskUserQuestion", "codex": "request_user_input"}[name]}
    check(f"{name}: a blocking question is allowed while auto is off", handle(provider, root, "main", question), {})
    record.features = {**record.features, "auto": True}
    check(f"{name}: auto refuses its blocking question tool", handle(provider, root, "main", question), {"decision": "block", "reason": QUESTION_REFUSAL})
    check(f"{name}: auto leaves an ordinary read alone", handle(provider, root, "main", {**question, "tool_name": "Read"}), {})
    if name == "codex":
        transcript = project / "rollout.jsonl"
        transcript.write_text("not json\n" + "\n".join(json.dumps(row) for row in [
            {"type": "session_meta", "payload": {"source": {}}},
            {"type": "event_msg", "payload": {"type": "token_count", "info": {"last_token_usage": {"total_tokens": 129200}, "model_context_window": 258400}}},
            {"type": "response_item", "timestamp": "2026-09-19T10:00:00Z", "payload": {"type": "custom_tool_call", "name": "exec", "input": 'const r=await tools.exec_command({cmd:"sed -n 1,80p .codex/skills/journal/SKILL.md"});'}},
            {"type": "response_item", "timestamp": "2026-09-19T10:00:01Z", "payload": {"type": "function_call", "namespace": "collaboration", "name": "spawn_agent", "arguments": {"task_name": "audit"}}},
            {"type": "response_item", "timestamp": "2026-09-19T10:00:02Z", "payload": {"type": "custom_tool_call_output", "output": "Script running with cell ID 41"}},
        ]) + "\n")
        handle(provider, root, "main", {**payload, "transcript_path": str(transcript), "hook_event_name": "Stop"})
        crew = provider.crew(transcript)
        check("codex: rollout context, skills, native subagents and yielded shells are detected", (agents.by_session("rollout").context, crew["skills"], crew["subagents"], crew["shells"]), (50.0, ["journal"], 1, 1))
        check("codex: crew details identify the yielded shell and spawned task", (crew["shell_rows"][0]["cell"], crew["subagent_rows"][0]["task"]), ("41", "audit"))
        with transcript.open("a") as out:
            out.write(json.dumps({"type": "event_msg", "payload": {"type": "token_count", "info": {"last_token_usage": {"total_tokens": 193800}, "model_context_window": 258400}}}) + "\n")
        handle(provider, root, "main", {**payload, "transcript_path": str(transcript), "hook_event_name": "PreToolUse"})
        check("codex: each hook refreshes the latest rollout context", agents.by_session("rollout").context, 75.0)
        child = project / "child.jsonl"
        child.write_text("bad json\n" + json.dumps({"type": "session_meta", "payload": {"source": {"subagent": {"thread_spawn": {"parent_thread_id": "main-thread"}}}}}) + "\n")
        check("codex: a native subagent transcript reports its parent session", provider.session(child)["parent"], "main-thread")

# A SHELL COMMAND'S EFFECT is a fact the provider reports with the running command
effects = {
    "python3 tests/test_gist.py 2>&1 | tail -2": "tests",
    "/opt/homebrew/Frameworks/Python.framework/Versions/3.14/Resources/Python.app/Contents/MacOS/Python tests/features/files/test_changed.py": "tests",
    "for t in $(find tests -name 'test_*.py'); do python3 $t; done": "tests",
    "cd web && npm test": "tests",
    "rm -rf build": "deletes",
    "git rm old.py": "deletes",
    "python3 - <<'EOF'\nfrom pathlib import Path\nPath('a').write_text('x')\nEOF": "writes",
    "sed -i '' 's/a/b/' f.py": "writes",
    "echo hi > out.txt": "writes",
    "cat a.py": "reads",
    "grep -n foo x.py | head": "reads",
    "cd web && npm run build": "",
    "git status": "",
    "journal todo all": "",
    'journal work log 5 "done > shipped" >/dev/null; python3 - <<\'EOF\'\nimport pathlib\npathlib.Path("a").write_text("x")\nEOF': "writes",
    'journal message reply 3 "use a > b" >/dev/null': "",
    'W=$(journal todo show 5 | grep work); journal work log $W "x"; git commit -m y': "writes",
}
claude = PROVIDERS["claude"]()
check("each shell command is classified by what it does", {c: claude.effect(Hook.read({"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": c}})) for c in effects}, effects)
read_only = "python3 - <<'EOF'\nprint(open('a').read())\nEOF"
check("a heredoc that only reads is neither editing nor a write", (claude.effect(Hook.read({"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": read_only}})),
      claude.writes(Hook.read({"hook_event_name": "PostToolUse", "tool_name": "Bash", "tool_input": {"command": read_only}}))), ("", False))
check("a quoted > is text, not a redirect; tests then a commit is still a write",
      ([claude.effect_of(c) for c in ("grep 'c>=2' f", "git commit -m 'a > b'")], claude.writes(Hook.read({"hook_event_name": "PostToolUse", "tool_name": "Bash", "tool_input": {"command": "python3 tests/x.py && git commit -m y"}}))),
      (["reads", "writes"], True))
check("an edit next to a journal call is still a write, and journal calls alone never are",
      [claude.writes(Hook.read({"hook_event_name": "PostToolUse", "tool_name": "Bash", "tool_input": {"command": c}})) for c in ('journal work log 5 "x"; git commit -m y', 'journal message reply 3 "a > b"', ".journal/journal todo add x")], [True, False, False])
check("a command labelled editing is one whose line changes are counted", all(claude.writes(Hook.read({"hook_event_name": "PostToolUse", "tool_name": "Bash", "tool_input": {"command": c}})) for c, e in effects.items() if e in ("writes", "deletes")), True)
check("a tool that is not the shell has no effect to report", claude.effect(Hook.read({"hook_event_name": "PreToolUse", "tool_name": "Read", "tool_input": {"file_path": "x"}})), "")
shelled = claude.shell(AgentRow(n=1, title="s"), Hook.read({"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "rm x", "description": "Remove x"}}))
check("the effect rides on the running command and on its entry in the recent commands", (shelled["running"].get("effect"), shelled["commands"][-1].get("effect")), ("deletes", "deletes"))

# THE CURRENT EFFORT is a fact each provider reads from its own settings; the project's settings win over the user's
home = Path(tempfile.mkdtemp())
project = Path(tempfile.mkdtemp())
(home / ".claude").mkdir()
(home / ".claude" / "settings.json").write_text(json.dumps({"effortLevel": "high"}))
os.environ["HOME"] = str(home)
check("Claude's effort comes from the user's settings", PROVIDERS["claude"]().effort(project), "high")
(project / ".claude").mkdir()
(project / ".claude" / "settings.local.json").write_text(json.dumps({"effortLevel": "low"}))
check("a project's local setting wins", PROVIDERS["claude"]().effort(project), "low")
(home / ".codex").mkdir()
(home / ".codex" / "config.toml").write_text('model = "gpt-5"\nmodel_reasoning_effort = "medium"\n')
check("Codex's effort comes from its config", PROVIDERS["codex"]().effort(project), "medium")
check("Fable is offered by its current id", [c["value"] for g in PROVIDERS["claude"].controls["groups"] if g["key"] == "model" for c in g["choices"]][-1], "claude-fable-5-1")

# CLAUDE'S CONTEXT WINDOW comes from the model it is set to, since its transcript does not name the window
home = Path(tempfile.mkdtemp())
project = Path(tempfile.mkdtemp())
os.environ["HOME"] = str(home)
transcript = project / "t.jsonl"
transcript.write_text(json.dumps({"message": {"usage": {"input_tokens": 100_000}}}) + "\n")
used = lambda model="": PROVIDERS["claude"]().context(Hook.read({"hook_event_name": "Stop", "transcript_path": str(transcript), "cwd": str(project), "model": model}))
check("with no long-context model set, the window is 200,000", used(), 50.0)
(home / ".claude").mkdir()
(home / ".claude" / "settings.json").write_text(json.dumps({"model": "opus[1m]"}))
check("a model set to [1m] in the settings means a million", used(), 10.0)
(home / ".claude" / "settings.json").write_text(json.dumps({"model": "opus"}))
check("the model the hook names can say [1m] too", used("claude-opus-5[1m]"), 10.0)
transcript.write_text(json.dumps({"message": {"usage": {"input_tokens": 400_000}}}) + "\n")
check("more than 200,000 in use can only be a million window", used(), 40.0)

# CLAUDE'S CURRENT EFFORT is the last one it confirmed in its transcript, even one kept for the session only
said = lambda text, kind="user": json.dumps({"type": kind, "message": {"role": kind, "content": text}})
transcript.write_text("\n".join([
    said("<local-command-stdout>Set effort level to medium (saved as your default for new sessions): Balanced</local-command-stdout>"),
    said("<local-command-stdout>Set effort level to max (this session only): Maximum</local-command-stdout>"),
    said("I quoted <local-command-stdout>Set effort level to low in my own words", "assistant"),
]) + "\n")
(home / ".claude" / "settings.json").write_text(json.dumps({"effortLevel": "medium"}))
check("the transcript's last confirmed effort wins over the settings, and the agent's own words never count", PROVIDERS["claude"]().effort(project, transcript), "max")
check("with no confirmation in the transcript, the settings say", PROVIDERS["claude"]().effort(project, project / "none.jsonl"), "medium")

done()
