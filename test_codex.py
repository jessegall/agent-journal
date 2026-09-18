"""hook.py under Codex: the payloads doc 9 measured, answered the way Codex takes them.

    .journal/test_codex.py

Codex's hooks hand the same fields Claude Code's do and take the same JSON back, with one
measured exception: a Stop answered with additionalContext FAILS ("hook: Stop Failed") where
`decision: "block"` holds the turn. So the suite fires the measured payloads — transcript_path a
rollout file under a .codex/sessions folder — and checks the start block, the write gate, and
the shape of a Stop hold.
"""
import json
import os
import sys
import tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import state, testkit  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


d = Path(tempfile.mkdtemp()) / "proj"
(d / ".claude").mkdir(parents=True)
testkit.make(d, SRC)
P = testkit.Project(d)
home = Path(tempfile.mkdtemp())
SID = "01a0b3f2-7d8e-7d33-a4a9-da79f20da233"
rollout = home / ".codex" / "sessions" / "2026" / "09" / "18" / f"rollout-2026-09-18T11-56-48-{SID}.jsonl"
rollout.parent.mkdir(parents=True)
rollout.write_text(json.dumps({"timestamp": "2026-09-18T09:56:48.760Z", "type": "session_meta",
                               "payload": {"id": SID, "cwd": str(d), "originator": "codex_exec", "cli_version": "0.142.5"}}) + "\n")
BASE = {"session_id": SID, "transcript_path": str(rollout), "cwd": str(d), "model": "gpt-5.5", "permission_mode": "bypassPermissions"}
STEM = rollout.stem


def fire(event, **extra):
    return P.hook(event, **BASE, **extra)[1]


# THE START BLOCK, as Codex takes it: additionalContext under SessionStart
out = fire("SessionStart", source="startup")
got = json.loads(out)
check("SessionStart answers the start block as additionalContext", "additionalContext" in (got.get("hookSpecificOutput") or {}), True)
check("the session is keyed by the rollout's stem, not the session id", state.get(d / ".journal", "session_started", "", stem=STEM), "startup")
check("and the record says which agent it is", state.get(d / ".journal", "agent", "", stem=STEM), "codex")

# the start hook bound the session to the project's default environment; the CLI works the same one
P.cli("switch", "default", session=STEM)
fire("UserPromptSubmit", turn_id="t1", prompt="edit the file")
# THE WRITE GATE reads Codex's Bash call unchanged: tool_name Bash, tool_input.command
out = fire("PreToolUse", turn_id="t1", tool_name="Bash", tool_input={"command": "echo forbidden > probe.txt"}, tool_use_id="call_1")
check("a write with nothing open is refused, in the permissionDecision shape", "deny" in testkit.denied(out) or "work start" in testkit.denied(out), True)
out = fire("PreToolUse", turn_id="t1", tool_name="Bash", tool_input={"command": "cat probe.txt"}, tool_use_id="call_2")
check("a read is not", testkit.denied(out), "")

# A STOP HOLD IS A DECISION BLOCK under Codex — additionalContext there ends the turn
P.cli("todo", "a chore", session=STEM)
P.cli("todo", "auto", "on", session=STEM)
out = fire("Stop", turn_id="t1", stop_hook_active=False, last_assistant_message="done")
got = json.loads(out) if out.strip() else {}
check("the hold is decision: block with the line as its reason", (got.get("decision"), "auto is on" in got.get("reason", "")), ("block", True))
check("no additionalContext rides on a Codex Stop", "hookSpecificOutput" in got, False)

# THE VIEWER NAMES IT: the activity's agent carries "codex", and the bar reads the name from that
import controllers.activity as activity  # noqa: E402
got_agent = activity.ActivityController._agent(d / ".journal", "default") or {}
check("the activity says which agent holds the environment, and its model from the rollout", (got_agent.get("agent"), got_agent.get("model")), ("codex", "gpt-5.5"))
P.close()

# THE HOOKS GO INTO .codex/hooks.json, in Codex's three-level shape, keeping whatever the user put there;
# a second run changes nothing. In a subprocess, because install.PROJECT is fixed at import.
import subprocess  # noqa: E402
codex_conf = d / ".codex" / "hooks.json"
codex_conf.parent.mkdir()
codex_conf.write_text(json.dumps({"hooks": {"Stop": [{"matcher": "", "hooks": [{"type": "command", "command": "echo mine"}]}]}}))


def wire_codex():
    return subprocess.run([sys.executable, "-c", f"import sys; sys.path.insert(0, {str(d / '.journal')!r});"
                           "import install; print(chr(10).join(install.wire_codex(False)))"],
                          capture_output=True, text=True, timeout=120).stdout.splitlines()


said = wire_codex()
after = json.loads(codex_conf.read_text())["hooks"]
check("every event the journal listens to is wired", sorted(after), sorted(set(["Stop", "SessionStart", "SessionEnd", "PostToolUse", "PreToolUse", "UserPromptSubmit", "SubagentStop", "PreCompact"])))
stop = after["Stop"]
check("the user's own Stop hook is kept beside ours", [h["command"] for b in stop for h in b["hooks"]][:1], ["echo mine"])
ours = [h for b in stop for h in b["hooks"] if "hook.py" in h["command"]]
check("ours walks up to the installation, with a matcher and a timeout", (len(ours), stop[-1].get("matcher"), ours[0].get("timeout")), (1, "", 60))
check("and says so, once per event", sum(1 for l in said if l.startswith("  + ")), 8)
check("a second run changes nothing", all(l.startswith("  = ") for l in wire_codex()), True)

# THE ROLLOUT IS READ AS A TRANSCRIPT: the same lines the Claude reader gives, from Codex's records.
# A synthetic rollout in the measured shape (doc 9), not the real file.
import transcript, context, rollout  # noqa: E402
recs = [
    {"timestamp": "t0", "type": "session_meta", "payload": {"id": SID, "cwd": str(d)}},
    {"timestamp": "t1", "type": "event_msg", "payload": {"type": "task_started", "turn_id": "t", "model_context_window": 258400}},
    {"timestamp": "t1", "type": "response_item", "payload": {"type": "message", "role": "user", "content": [{"type": "input_text", "text": "<environment_context>x</environment_context>"}]}},
    {"timestamp": "t1", "type": "turn_context", "payload": {"turn_id": "t", "model": "gpt-5.5"}},
    {"timestamp": "t2", "type": "response_item", "payload": {"type": "message", "role": "user", "content": [{"type": "input_text", "text": "fix the header"}]}},
    {"timestamp": "t2", "type": "event_msg", "payload": {"type": "user_message", "message": "fix the header"}},
    {"timestamp": "t3", "type": "response_item", "payload": {"type": "reasoning", "encrypted_content": "…"}},
    {"timestamp": "t3", "type": "response_item", "payload": {"type": "function_call", "name": "exec_command", "arguments": "{\"cmd\":\"ls\"}", "call_id": "c1"}},
    {"timestamp": "t4", "type": "response_item", "payload": {"type": "function_call_output", "call_id": "c1", "output": "a.py"}},
    {"timestamp": "t4", "type": "event_msg", "payload": {"type": "token_count", "info": {"last_token_usage": {"input_tokens": 12000}, "model_context_window": 258400}}},
    {"timestamp": "t5", "type": "response_item", "payload": {"type": "message", "role": "assistant", "content": [{"type": "output_text", "text": "[!reply] fixed"}]}},
    {"timestamp": "t5", "type": "event_msg", "payload": {"type": "agent_message", "message": "[!reply] fixed"}},
]
rollout_path = home / ".codex" / "sessions" / "2026" / "09" / "18" / f"rollout-2026-09-18T12-00-00-{SID[:-1]}9.jsonl"
rollout_path.write_text("".join(json.dumps(r) + "\n" for r in recs))
lines, boundaries = transcript.read(rollout_path)
check("one line per thing said: injected, human, the tool call, its result, the reply — reasoning and the doubled records skipped",
      [(l.role, l.kind, l.tools) for l in lines],
      [("user", "injected", []), ("user", "human", []), ("assistant", "text", ["Bash"]), ("user", "tool_result", []), ("assistant", "text", [])])
check("the last reply and its tag read as on Claude", (transcript.last_reply(rollout_path) or ("", ""))[0], "[!reply] fixed")
check("the model comes from the turn's context", transcript.last_model(rollout_path), "gpt-5.5")
check("the context reading is the last call's input, and the window the rollout's own", (context.reading_tail(rollout_path), rollout.window_of(rollout_path)), (12000, 258400))
os.environ["CODEX_HOME"] = str(home / ".codex")
check("a Codex session's file is found by its stem under the sessions folder", transcript.find(d, rollout_path.stem), rollout_path)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
