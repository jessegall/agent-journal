#!/usr/bin/env python3
"""channel.py: the MCP channel server declares itself; it pushes everything, only while the session is idle, whatever auto mode is."""
import json, os, subprocess, sys, tempfile, time
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
# THE POLL IS THE CLOCK THIS SUITE RUNS ON. The channel wakes, looks, sleeps; every wait here is a
# multiple of that, so the suite is told to poll fast and then waits on the CONDITION — a line that
# arrives, or a quiet window several polls long — rather than on a timeout somebody guessed.
POLL = 0.25
os.environ["AGENT_JOURNAL_CHANNEL_POLL"] = str(POLL)
#: a push is expected: generous, and it costs nothing because it returns the moment the line lands
SOON = 12
#: nothing is expected: long enough for several polls to have happened and found nothing
QUIET = max(1.0, POLL * 6)
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
got = read_line(SOON)
check("initialize declares the channel capability",
      (got or {}).get("result", {}).get("capabilities", {}).get("experimental", {}).get("claude/channel"), {})
ask({"jsonrpc": "2.0", "method": "notifications/initialized"})

j("messages", "add", "please check the build")
push = read_line(SOON)
# WHAT ARRIVED AND ITS NUMBER, NOT HALF OF WHAT IT SAYS. The line used to carry the first two
# hundred characters of the message, and the agent's very next act is to open it and read all of
# it — so the quote was a partial copy of something about to be read in full, which can be acted
# on as though it were the whole.
check("a waiting message is pushed to an idle session, naming which one",
      ((push or {}).get("method"), ((push or {}).get("params") or {}).get("meta", {}).get("message"),
       "message 1" in ((push or {}).get("params") or {}).get("content", "")),
      ("notifications/claude/channel", "1", True))
check("and it does not quote the message the agent is about to read",
      "please check the build" in ((push or {}).get("params") or {}).get("content", ""), False)
check("and not pushed twice", read_line(QUIET), None)
# A MESSAGE WITH A FILE IS STILL JUST A MESSAGE HERE. The line once carried the file's name too,
# which was one more thing quoted out of something the agent opens in full a moment later.
import base64 as _b64  # noqa: E402
_inbox_mod = __import__("inbox")
_inbox_mod.add(root, "here is the meeting", "2026-09-14T10:00:00+00:00", track="default",
               files=[{"name": "transcript.txt", "data": _b64.b64encode(b"a long transcript").decode()}])
import channel as _channel  # noqa: E402
_lines = [c["content"] for _, c in _channel._waiting("default", 0.0) if c.get("meta", {}).get("message")]
check("every message line names its number and quotes nothing",
      (all("message " in c for c in _lines),
       any("here is the meeting" in c or "transcript.txt" in c for c in _lines)),
      (True, False))


j("auto-mode", "enable")
import questions  # noqa: E402
questions.add(root, "ship it on Friday?", "2026-09-14T10:00:00+00:00", track="default")
j("questions", "answer", "1", "yes, Friday")
push = read_line(SOON)
params = (push or {}).get("params") or {}
check("an answered question is pushed to an idle session, naming which one",
      ("question 1" in params.get("content", ""), "yes, Friday" in params.get("content", ""),
       params.get("meta", {}).get("question")), (True, False, "1"))
check("and not pushed twice", read_line(QUIET), None)
check("a pushed answer is told, so the next stop does not deliver it again", questions.untold(root, "default"), [])
j("questions", "answer", "1", "no, Monday")
push = read_line(SOON)
check("a changed answer is pushed again, still without quoting it",
      (((push or {}).get("params") or {}).get("meta", {}).get("question"),
       "no, Monday" in (((push or {}).get("params") or {}).get("content", ""))), ("1", False))

j("todos", "add", "a to-do to comment on")
j("comments", "add", "todo 1", "use the other colour")
push = read_line(SOON)
params = (push or {}).get("params") or {}
check("a new comment is pushed to an idle session, naming what it is on",
      ("to-do 1" in params.get("content", ""), "use the other colour" in params.get("content", ""),
       params.get("meta", {}).get("comment")), (True, False, "1"))
check("and not pushed twice", read_line(QUIET), None)
import comments as _comments  # noqa: E402
check("a pushed comment is told, so the next stop does not deliver it again", _comments.untold(root, "default"), [])

P.cli("suggest", "poll the to-dos less often", "--brief", stdin="the list reloads every five seconds")
P.cli("suggestions", "accept", "1")
push = read_line(SOON)
params = (push or {}).get("params") or {}
check("a suggestion the user decides is pushed to an idle session, naming it",
      ("accepted suggestion 1" in params.get("content", ""), params.get("meta", {}).get("suggestion")), (True, "1"))
check("an accepted suggestion names the to-do it became and how to start it",
      (" as to-do " in params.get("content", ""), "todos start " in params.get("content", "")), (True, True))
check("and not pushed twice", read_line(QUIET), None)

(root / "runtime").mkdir(exist_ok=True)
(root / "runtime" / "upstream.cache").write_text(json.dumps({"version": "9.9.9", "headline": "", "at": 9e12}))
push = read_line(SOON)
params = (push or {}).get("params") or {}
check("a newer journal upstream is pushed to an idle session, with the upgrade command",
      (params.get("meta", {}).get("update"), "journal.py update" in params.get("content", "")), ("9.9.9", True))
check("once per version", read_line(QUIET), None)
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
push = read_line(SOON)
params = (push or {}).get("params") or {}
check("a plan the user approves in the viewer is pushed to an idle session, naming the phase to start",
      (params.get("meta", {}).get("plan"), "approved plan 1" in params.get("content", ""), "Phase 1 is current" in params.get("content", "")),
      ("1", True, True))
check("and only once", read_line(QUIET), None)
j("auto-mode", "enable")
# THE USER SPEAKING DOES NOT WAIT FOR A STOP; a plan approved in the viewer does. The kind is
# already in every event's meta, and `channel_reach_now` is the list of kinds that interrupt.
state.put(root, "last_event", "PreToolUse", stem=STEM)
j("messages", "add", "another one while working")
push = read_line(SOON)
check("a message reaches a session that is mid-turn",
      (bool(((push or {}).get("params") or {}).get("meta", {}).get("message")),
       "another one while working" in (((push or {}).get("params") or {}).get("content", ""))), (True, False))

j("auto-mode", "disable")
j("questions", "answer", "1", "no, Tuesday")
push = read_line(SOON)
params = (push or {}).get("params") or {}
check("with auto mode off an answered question still reaches it, saying not to start the to-do list",
      (params.get("meta", {}).get("question"), "no, Tuesday" in params.get("content", ""), "do not start on the to-do list" in params.get("content", "")),
      ("1", False, True))
j("messages", "add", "a message with auto off")
push = read_line(SOON)
check("while a message still does", bool(((push or {}).get("params") or {}).get("meta", {}).get("message")), True)
state.put(root, "last_event", "PreToolUse", stem=STEM)
j("questions", "answer", "1", "no, Wednesday")
j("messages", "add", "sent while it works, auto off")
_kinds = set()
while not {"message", "question"} <= _kinds:
    _line = read_line(SOON)
    if _line is None:
        break
    _kinds |= set((_line.get("params") or {}).get("meta", {}))
check("with auto off a message and a changed answer still reach it mid-turn: both are the user speaking",
      sorted(_kinds & {"message", "question"}), ["message", "question"])

import commandlog as _commandlog  # noqa: E402
from datetime import datetime as _dt2, timezone as _tz2  # noqa: E402
# A QUIET KIND WAITS. Writing a reminder in the viewer is a `did` event, which is not in
# `channel_reach_now`: it is there when the turn ends, and reading it a minute later costs
# nothing. The session is still mid-turn from the checks above.
_commandlog.record_web(root, "default", "reminders", "store", None, {}, _dt2.now(_tz2.utc).isoformat(timespec="seconds"))
check("a quiet kind does not reach a session mid-turn", read_line(QUIET), None)
state.put(root, "last_event", "Stop", stem=STEM)
push = read_line(SOON)
params = (push or {}).get("params") or {}
check("anything else the user does in the viewer is pushed too, in the words Activity shows it",
      ("Wrote a reminder" in params.get("content", ""), params.get("meta", {}).get("did")),
      (True, "Wrote a reminder"))
check("and not pushed twice", read_line(QUIET), None)

tracks.unbind(root, STEM)
j("messages", "add", "while on no environment")
push = read_line(SOON)
params = (push or {}).get("params") or {}
# AN EVENT BELONGS TO AN ENVIRONMENT AND GOES TO WHOEVER WORKS IT. A session that has chosen
# nothing used to be handed every environment's traffic — written when being unbound was rare,
# and left in place when it became the state EVERY new session starts in. So a message on one
# environment woke an agent with nothing to do with it, and it read somebody else's instruction.
# It is still woken, because a message on a fresh project must not sit unheard; it is told that
# something waits THERE and that it is on no environment, and the event stays untold for whoever
# picks that environment up.
check("a session on no environment is told that something waits, not what it is",
      (params.get("meta", {}).get("env"), params.get("meta", {}).get("did"),
       params.get("meta", {}).get("message"), "no environment" in params.get("content", "")),
      ("default", "waiting", None, True))
check("and it does not carry the message the agent has no business reading",
      "while on no environment" in params.get("content", ""), False)

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
      ([f"default:reply:{_mn}:0"], False))
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
#: BY ENVIRONMENT AND NUMBER, NOT BY WORDS. The push line names what arrived and where; it does
#: not quote the message, so what a session heard is read off the meta rather than the prose.
_ON_DEFAULT = str(len(_inbox._all(root, "default")))
_ON_SPARE = str(len(_inbox._all(root, "spare")))


def _heard(stem):
    return {(p["meta"].get("env"), p["meta"]["message"]) for _, p in chan_mod.pending(stem) if p["meta"].get("message")}


def _told_something_waits(stem):
    return {p["meta"]["env"] for _, p in chan_mod.pending(stem) if p["meta"].get("did") == "waiting"}


check("the session on the environment is woken for its message",
      ("default", _ON_DEFAULT) in _heard("holder-a"), True)
check("a session on no environment is not woken for another live session's environment",
      ("default", _ON_DEFAULT) in _heard("free-b"), False)
# an environment nobody holds still has to reach somebody, and the one session on no environment
# that is seen most recently is who it reaches — told that something waits there, never what
check("an environment no live session holds tells one session on no environment that something waits",
      ("spare" in _told_something_waits("free-b"), "spare" in _told_something_waits("free-c")), (True, False))
check("and never the event itself: a session on no environment is handed nobody's messages",
      (_heard("free-b"), _heard("free-c")), (set(), set()))
check("of two sessions bound to one environment, only the one seen most recently is woken",
      (("default", _ON_DEFAULT) in _heard("holder-a"), ("default", _ON_DEFAULT) in _heard("stale-d")), (True, False))

_real_ppid = chan_mod.os.getppid
try:
    chan_mod.os.getppid = lambda: 424242
    state.put(root, "session_pids", {"424242": "holder-a"})
    chan_mod.STARTED[0] = _now
    check("a process id whose session ran its hook just now is trusted", chan_mod._session(), "holder-a")
    check("and being trusted stamps the session: the viewer reads it as one with a channel",
          abs((state.get(root, "channel_seen", 0, stem="holder-a") or 0) - time.time()) < 5, True)
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
