#!/usr/bin/env python3
"""channel.py: the MCP channel server declares itself and pushes a waiting message only to an idle or non-auto session."""
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
state.put(root, "last_event", "PreToolUse", stem=STEM)
j("messages", "add", "another one while working")
check("with auto on and the session working, nothing is pushed", read_line(8), None)
state.put(root, "last_event", "Stop", stem=STEM)
push = read_line(12)
check("once the session stops, it is pushed", "another one while working" in (((push or {}).get("params") or {}).get("content", "")), True)

srv.stdin.close()
srv.wait(timeout=10)

code, out = j("channel", "--install")
mcp = json.loads((d / ".mcp.json").read_text())
check("channel --install adds the server to .mcp.json and says how to start Claude",
      (code, mcp["mcpServers"]["journal"]["args"], "server:journal" in out), (0, [".journal/channel.py"], True))
code, out = j("channel", "--install")
check("a second install leaves it as it is", "left as it is" in out, True)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
