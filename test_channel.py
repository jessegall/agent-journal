#!/usr/bin/env python3
"""channel.py: the MCP channel server declares itself; it pushes everything, only while the session is idle, whatever auto mode is."""
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
state.put(root, "seen_at", int(time.time()) + 3600, stem=STEM)  # its hook is running, as a real session's is

srv = subprocess.Popen([sys.executable, str(root / "channel.py")], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                       stderr=subprocess.PIPE, text=True, bufsize=1, env={**os.environ})


def ask(obj):
    srv.stdin.write(json.dumps(obj) + "\n")
    srv.stdin.flush()


_unread = [""]


def read_line(timeout):
    # its own buffer: two pushes can land in one read, and select cannot see a line a text reader already holds
    import select
    end = time.time() + timeout
    while True:
        while "\n" in _unread[0]:
            line, _, _unread[0] = _unread[0].partition("\n")
            if line.strip():
                return json.loads(line)
        left = end - time.time()
        if left <= 0:
            return None
        r, _, _ = select.select([srv.stdout.fileno()], [], [], left)
        if r:
            chunk = os.read(srv.stdout.fileno(), 65536)
            if not chunk:
                return None
            _unread[0] += chunk.decode()


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
# A TRANSCRIPT ARRIVES AS A FILE, and the wake line quoted only the message's text — so the thing the
# paste was for was invisible to an idle agent. Found while building the transcription feature.
import base64 as _b64  # noqa: E402
_inbox_mod = __import__("inbox")
_inbox_mod.add(root, "here is the meeting", "2026-09-14T10:00:00+00:00", track="default",
               files=[{"name": "transcript.txt", "data": _b64.b64encode(b"a long transcript").decode()}])
import channel as _channel  # noqa: E402
_carried = [c for _, c in _channel._waiting("default", 0.0) if "here is the meeting" in c.get("content", "")]
check("a message carrying a file says so when it wakes an agent",
      (len(_carried), "transcript.txt" in (_carried[0]["content"] if _carried else "")), (1, True))


j("auto-mode", "enable")
import questions  # noqa: E402
questions.add(root, "ship it on Friday?", "2026-09-14T10:00:00+00:00", track="default")
j("questions", "answer", "1", "yes, Friday")
push = read_line(12)
params = (push or {}).get("params") or {}
check("an answered question is pushed to an idle session, naming it",
      ("yes, Friday" in params.get("content", ""), params.get("meta", {}).get("question")), (True, "1"))
check("and not pushed twice", read_line(7), None)
check("a pushed answer is told, so the next stop does not deliver it again", questions.untold(root, "default"), [])
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
import comments as _comments  # noqa: E402
check("a pushed comment is told, so the next stop does not deliver it again", _comments.untold(root, "default"), [])

P.cli("suggest", "poll the to-dos less often", "--brief", stdin="the list reloads every five seconds")
P.cli("suggestions", "accept", "1")
push = read_line(12)
params = (push or {}).get("params") or {}
check("a suggestion the user decides is pushed to an idle session, naming it",
      ("accepted suggestion 1" in params.get("content", ""), params.get("meta", {}).get("suggestion")), (True, "1"))
check("an accepted suggestion names the to-do it became and how to start it",
      (" as to-do " in params.get("content", ""), "todos start " in params.get("content", "")), (True, True))
check("and not pushed twice", read_line(7), None)

(root / "runtime").mkdir(exist_ok=True)
(root / "runtime" / "upstream.cache").write_text(json.dumps({"version": "9.9.9", "headline": "", "at": 9e12}))
push = read_line(12)
params = (push or {}).get("params") or {}
check("a newer journal upstream is pushed to an idle session, with the upgrade command",
      (params.get("meta", {}).get("update"), "journal.py update" in params.get("content", "")), ("9.9.9", True))
check("once per version", read_line(7), None)
(root / "runtime" / "upstream.cache").unlink()

import re as _re  # noqa: E402
from datetime import datetime as _dt, timezone as _tz  # noqa: E402
import plans as _plans  # noqa: E402
_code, _out = P.cli("todos", "add", "the first step of the plan")
_step = _re.search(r"to-do (\d+)", _out).group(1)
P.cli("plans", "add", "a plan to approve", "--goal=it gets approved", "--brief", stdin="the approach")
P.cli("plans", "phase", "1", "the first phase")
P.cli("plans", "todos", "1", "1", _step)
_plans.activate(root, 1, _dt.now(_tz.utc).isoformat(timespec="seconds"), source="web", track="default")
push = read_line(12)
params = (push or {}).get("params") or {}
check("a plan the user approves in the viewer is pushed to an idle session, naming the phase to start",
      (params.get("meta", {}).get("plan"), "approved plan 1" in params.get("content", ""), "the first phase, is current" in params.get("content", "")),
      ("1", True, True))
check("and only once", read_line(7), None)
j("auto-mode", "enable")
state.put(root, "last_event", "PreToolUse", stem=STEM)
j("messages", "add", "another one while working")
check("with auto on and the session working, nothing is pushed", read_line(8), None)
state.put(root, "last_event", "Stop", stem=STEM)
push = read_line(12)
check("once the session stops, it is pushed", "another one while working" in (((push or {}).get("params") or {}).get("content", "")), True)

j("auto-mode", "disable")
j("questions", "answer", "1", "no, Tuesday")
push = read_line(12)
params = (push or {}).get("params") or {}
check("with auto mode off an answered question still wakes an idle session, saying not to start the to-do list",
      (params.get("meta", {}).get("question"), "no, Tuesday" in params.get("content", ""), "do not start on the to-do list" in params.get("content", "")),
      ("1", True, True))
j("messages", "add", "a message with auto off")
push = read_line(12)
check("while a message still does", "a message with auto off" in (((push or {}).get("params") or {}).get("content", "")), True)
j("questions", "answer", "1", "no, Wednesday")
state.put(root, "last_event", "PreToolUse", stem=STEM)
j("messages", "add", "sent while it works, auto off")
push = read_line(12)
check("with auto off a working session is not pushed anything either: its hooks tell it", push, None)
state.put(root, "last_event", "Stop", stem=STEM)
_pushed = []
while not (any("sent while it works, auto off" in c for c in _pushed) and any("no, Wednesday" in c for c in _pushed)):
    _line = read_line(12)
    if _line is None:
        break
    _pushed.append(((_line.get("params") or {}).get("content", "")))
check("once it stops, the message and the changed answer are both pushed",
      (any("sent while it works, auto off" in c for c in _pushed), any("no, Wednesday" in c for c in _pushed)), (True, True))

import commandlog as _commandlog  # noqa: E402
from datetime import datetime as _dt2, timezone as _tz2  # noqa: E402
_commandlog.record_web(root, "default", "reminders", "store", None, {}, _dt2.now(_tz2.utc).isoformat(timespec="seconds"))
push = read_line(12)
params = (push or {}).get("params") or {}
check("anything else the user does in the viewer is pushed too, in the words Activity shows it",
      ("Wrote a reminder" in params.get("content", ""), params.get("meta", {}).get("did")),
      (True, "Wrote a reminder"))
check("and not pushed twice", read_line(7), None)

tracks.unbind(root, STEM)
j("messages", "add", "while on no environment")
push = read_line(12)
params = (push or {}).get("params") or {}
check("a session on no environment yet is still woken, told which environment it is for",
      ("while on no environment" in params.get("content", ""), params.get("meta", {}).get("env")), (True, "default"))

import channel  # noqa: E402
_old = channel._waiting("default", time.time() + 60)
check("a plan approved before the channel started is pushed anyway: an approval goes stale when the work STARTS, not when the clock passes it",
      [k.split(":")[2:4] for k, _ in _old], [["1", "approved"]])
P.cli("todos", "start", _step)
check("and once its first row is picked up, nothing from before the channel started is pushed",
      channel._waiting("default", time.time() + 60), [])
import inbox as _inbox  # noqa: E402
_mn = len(_inbox._all(root, "default"))
_inbox.add(root, "a message the agent finishes with", _dt.now(_tz.utc).isoformat(timespec="seconds"), track="default")
_mn += 1
_inbox.done(root, _mn, _dt.now(_tz.utc).isoformat(timespec="seconds"), track="default")
_inbox.reply(root, _mn, "and one more thing about it", _dt.now(_tz.utc).isoformat(timespec="seconds"),
             source="web", track="default")
_turn = [(k, p) for k, p in channel._waiting("default", time.time() + 60) if ":reply:" in k]
check("the user's reply under a message the agent already PROCESSED still wakes it: a message is told once, a conversation is not",
      ([k for k, _ in _turn], "and one more thing" in (_turn[0][1]["content"] if _turn else "")),
      ([f"default:reply:{_mn}:0"], True))
channel._told([f"default:reply:{_mn}:0"])
check("and it is told once, per turn rather than per message",
      [k for k, _ in channel._waiting("default", time.time() + 60) if ":reply:" in k], [])
_inbox.reply(root, _mn, "a second turn, after that one was told", _dt.now(_tz.utc).isoformat(timespec="seconds"),
             source="web", track="default")
check("a second turn is its own event, so a back-and-forth does not die after the first",
      [k for k, _ in channel._waiting("default", time.time() + 60) if ":reply:" in k], [f"default:reply:{_mn}:1"])
_inbox.reply(root, _mn, "the agent's own answer", _dt.now(_tz.utc).isoformat(timespec="seconds"),
             source="cli", track="default")
check("the agent's own reply is not pushed back to it",
      [k for k, _ in channel._waiting("default", time.time() + 60) if ":reply:" in k], [f"default:reply:{_mn}:1"])

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

# ------------------------------------------------------------------ an upgrade reaches a running server
import channel as chan_mod  # noqa: E402

chan_mod.STARTED[0] = 12345.0
first = chan_mod._poller()
check("the poll code is loaded once and reused while nothing on disk changes", chan_mod._poller() is first, True)
_later = time.time() + 60
os.utime(root / "suggestions.py", (_later, _later))
second = chan_mod._poller()
check("when a package file changes, the next poll runs the code as it is on disk now", second is not first, True)
check("the fresh code keeps the server's start time, so nothing older is pushed", second.STARTED[0], 12345.0)

# ------------------------------------------------------------------ no other agent's environment is pushed to this one
import inbox as _inbox  # noqa: E402

_now = time.time()
state.put(root, "session_pids", {"1001": "holder-a", "1002": "stale-d", "1003": "free-b", "1004": "free-c"})
for _stem, _env, _age in (("holder-a", "default", 5), ("stale-d", "default", 600), ("free-b", None, 5), ("free-c", None, 50)):
    if _env:
        tracks.bind(root, _stem, _env)
    state.put(root, "seen_at", int(_now - _age), stem=_stem)
    state.put(root, "last_event", "Stop", stem=_stem)
tracks.create(root, "spare", at="2026-09-14T10:00:00+00:00")
chan_mod.STARTED[0] = 0.0
_inbox.add(root, "a message for whoever works default", "2099-01-01T00:00:00+00:00", track="default")
_inbox.add(root, "a message on an environment nobody holds", "2099-01-01T00:00:00+00:00", track="spare")


def _heard(stem):
    return sorted(p["content"].split(": ", 1)[1] for _, p in chan_mod.pending(stem) if p["meta"].get("message"))


check("the session on the environment is woken for its message",
      "a message for whoever works default" in _heard("holder-a"), True)
check("a session on no environment is not woken for another live session's environment",
      "a message for whoever works default" in _heard("free-b"), False)
check("an environment no live session holds wakes one session on no environment, the one seen most recently",
      ("a message on an environment nobody holds" in _heard("free-b"), "a message on an environment nobody holds" in _heard("free-c")), (True, False))
check("of two sessions bound to one environment, only the one seen most recently is woken",
      ("a message for whoever works default" in _heard("holder-a"), "a message for whoever works default" in _heard("stale-d")), (True, False))

_real_ppid = chan_mod.os.getppid
try:
    chan_mod.os.getppid = lambda: 424242
    state.put(root, "session_pids", {"424242": "holder-a"})
    chan_mod.STARTED[0] = _now
    check("a process id whose session ran its hook just now is trusted", chan_mod._session(), "holder-a")
    state.put(root, "seen_at", int(_now - 3 * 3600), stem="holder-a")
    check("a process id left by a session last seen hours before this server started is not", chan_mod._session(), None)
finally:
    chan_mod.os.getppid = _real_ppid

# ---------------------------------------------------------- an idle agent with ready work is sent back to it
# Nothing else notices this one: a session's own hooks fire when it ACTS, and the channel otherwise
# speaks only when the user does. It must stay silent when auto is off, when nothing is ready, and
# before the interval — a nudge that fires when there is nothing to do is one nobody reads.
import settings as _settings  # noqa: E402
import todo as _todo_mod  # noqa: E402

_stem = "idle0000-0000-4000-8000-000000000001"
P.cli("switch", "default")
P.cli("todos", "add", "a row the agent could pick up")
state.put(root, "seen_at", int(time.time() - 1800), stem=_stem)

_todo_mod.set_auto(root, False)
check("with auto off, an idle agent is left alone", channel._idle_nudge(_stem, "default"), [])

_todo_mod.set_auto(root, True)
_got = channel._idle_nudge(_stem, "default")
check("with auto on and work ready, it is sent back to the list",
      (len(_got), "auto mode is on" in _got[0][1]["content"] if _got else ""), (1, True))
_key = _got[0][0]
state.put(root, "seen_at", int(time.time() - 120), stem=_stem)
check("but not before the interval has passed", channel._idle_nudge(_stem, "default"), [])
state.put(root, "seen_at", int(time.time() - 3600), stem=_stem)
check("and an hour in it is a NEW key, so the dedupe does not swallow the next one",
      channel._idle_nudge(_stem, "default")[0][0] != _key, True)

# every ready row, not just the one added here: this environment collected others earlier
for _r in _todo_mod.ready(root, "default"):
    P.cli("todos", "block", str(_r["n"]), "waiting on the rig")
state.put(root, "seen_at", int(time.time() - 1800), stem=_stem)
check("a list with nothing ready is never nagged", channel._idle_nudge(_stem, "default"), [])

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
