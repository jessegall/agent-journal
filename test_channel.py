#!/usr/bin/env python3
"""channel.py: the MCP channel server declares itself; with auto off it pushes messages only, with auto on everything once idle."""
import json, os, subprocess, sys, tempfile, time
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import testkit  # noqa: E402

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
root = d / ".journal"


def j(*a):
    return P.cli(*a)


sys.path.insert(0, str(root))
import state, tracks  # noqa: E402

STEM = "chan-session"
tracks.bind(root, STEM, "default")
state.put(root, "session_pids", {str(os.getpid()): STEM})
state.put(root, "last_event", "Stop", stem=STEM)

srv = subprocess.Popen([sys.executable, str(root / "channel.py")], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                       stderr=subprocess.PIPE, text=True, bufsize=1, env={**os.environ})


def ask(obj):
    srv.stdin.write(json.dumps(obj) + "\n")
    srv.stdin.flush()


def read_line(timeout):
    import select
    end = time.time() + timeout
    while time.time() < end:
        r, _, _ = select.select([srv.stdout], [], [], max(0.0, end - time.time()))
        if r:
            line = srv.stdout.readline()
            if line.strip():
                return json.loads(line)
    return None


ask({"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-06-18", "capabilities": {}}})
got = read_line(10)
check("initialize declares the channel capability",
      (got or {}).get("result", {}).get("capabilities", {}).get("experimental", {}).get("claude/channel"), {})
ask({"jsonrpc": "2.0", "method": "notifications/initialized"})

j("messages", "add", "please check the build")
push = read_line(12)
check("a waiting message is pushed to an idle session, naming it",
      ((push or {}).get("method"), "please check the build" in ((push or {}).get("params") or {}).get("content", ""),
       ((push or {}).get("params") or {}).get("meta", {}).get("message")),
      ("notifications/claude/channel", True, "1"))
check("and not pushed twice", read_line(7), None)

j("auto-mode", "enable")
import questions  # noqa: E402
questions.add(root, "ship it on Friday?", "2026-09-14T10:00:00+00:00", track="default")
j("questions", "answer", "1", "yes, Friday")
push = read_line(12)
params = (push or {}).get("params") or {}
check("an answered question is pushed to an idle session, naming it",
      ("yes, Friday" in params.get("content", ""), params.get("meta", {}).get("question")), (True, "1"))
check("and not pushed twice", read_line(7), None)
j("questions", "answer", "1", "no, Monday")
push = read_line(12)
check("a changed answer is pushed again", "no, Monday" in (((push or {}).get("params") or {}).get("content", "")), True)

j("todos", "add", "a to-do to comment on")
j("comments", "add", "todo 1", "use the other colour")
push = read_line(12)
params = (push or {}).get("params") or {}
check("a new comment is pushed to an idle session, naming it",
      ("use the other colour" in params.get("content", ""), params.get("meta", {}).get("comment")), (True, "1"))
check("and not pushed twice", read_line(7), None)

j("auto-mode", "enable")
state.put(root, "last_event", "PreToolUse", stem=STEM)
j("messages", "add", "another one while working")
check("with auto on and the session working, nothing is pushed", read_line(8), None)
state.put(root, "last_event", "Stop", stem=STEM)
push = read_line(12)
check("once the session stops, it is pushed", "another one while working" in (((push or {}).get("params") or {}).get("content", "")), True)

j("auto-mode", "disable")
j("questions", "answer", "1", "no, Tuesday")
check("with auto mode off an answered question does not wake the session: only messages do", read_line(8), None)
j("messages", "add", "a message with auto off")
push = read_line(12)
check("while a message still does", "a message with auto off" in (((push or {}).get("params") or {}).get("content", "")), True)
j("questions", "answer", "1", "no, Wednesday")
state.put(root, "last_event", "PreToolUse", stem=STEM)
j("messages", "add", "sent while it works, auto off")
push = read_line(12)
check("with auto off a message reaches a working session too, and the answer still does not",
      [((p or {}).get("params") or {}).get("meta", {}).get("message") is not None for p in [push, read_line(6)] if p], [True])
state.put(root, "last_event", "Stop", stem=STEM)

tracks.unbind(root, STEM)
j("messages", "add", "while on no environment")
push = read_line(12)
params = (push or {}).get("params") or {}
check("a session on no environment yet is still woken, told which environment it is for",
      ("while on no environment" in params.get("content", ""), params.get("meta", {}).get("env")), (True, "default"))

import channel  # noqa: E402
check("nothing that happened before the channel started is pushed", channel._waiting("default", time.time() + 60), [])
check("a session on no environment yet is woken for new messages only, not for another environment's answers or comments",
      sorted({next(k for k in ("message", "question", "comment") if k in params["meta"]) for _, params in channel._waiting("default", 0, answers=False)}),
      ["message"])

srv.stdin.close()
srv.wait(timeout=10)

code, out = j("channel", "--install")
mcp = json.loads((d / ".mcp.json").read_text())
check("channel --install adds the server to .mcp.json and says how to start Claude",
      (code, mcp["mcpServers"]["journal"]["args"], "server:journal" in out), (0, [".journal/channel.py"], True))
code, out = j("channel", "--install")
check("a second install leaves it as it is", "left as it is" in out, True)

(d / ".mcp.json").unlink()
code, out = j("claude", "--dry-run", "--continue", "fix the build")
check("journal claude adds the channel if it is missing and shows the command it would run",
      (code, "journal" in json.loads((d / ".mcp.json").read_text())["mcpServers"],
       "claude --dangerously-load-development-channels server:journal --continue 'fix the build'" in out),
      (0, True, True))

code, out = j("claude", "--dry-run", "--continue", "--dangerously-skip-permissions", "--model=sonnet",
             "fix", "the", "build")
check("journal claude passes undeclared flags through to claude, in order, before the prompt",
      (code, "claude --dangerously-load-development-channels server:journal --continue "
             "--dangerously-skip-permissions --model=sonnet 'fix the build'" in out),
      (0, True))

code, out = j("channel", "--bogus")
check("a command that does not opt into passthrough still refuses an unknown option",
      (code, "unknown option '--bogus'" in out), (1, True))

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
