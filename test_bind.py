#!/usr/bin/env python3
"""Sessions are bound to environments: two sessions, two environments, one project.

    .journal/test_bind.py
"""
import json, os, shutil, subprocess, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import state, tracks, transcript  # noqa: E402

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
shutil.copytree(SRC, d / ".journal", ignore=shutil.ignore_patterns(
    "runtime", "state.json*", "record.json*", "todo", "docs", "tools", ".journal", ".git", ".claude", "__pycache__"))
(d / ".journal" / "settings.json").write_text(json.dumps({"bind_on_start": True, "one_session_per_environment": False}))  # the rule has its own section below
root = d / ".journal"
tdir = transcript.project_dir(d); tdir.mkdir(parents=True, exist_ok=True)
J = str(root / "journal.py")


class S:
    def __init__(self, stem):
        self.stem = stem
        self.path = tdir / f"{stem}.jsonl"; self.path.write_text("")
        self.env = {**os.environ, transcript.SESSION_ENV: stem}
        self.start()

    def start(self):
        out = subprocess.run([str(root / "hook.py")], input=json.dumps({"hook_event_name": "SessionStart", "source": "startup",
                             "session_id": self.stem, "transcript_path": str(self.path)}), capture_output=True, text=True, timeout=60).stdout
        return json.loads(out)["hookSpecificOutput"]["additionalContext"]

    def j(self, *a):
        p = subprocess.run([J, *a], env=self.env, capture_output=True, text=True, timeout=60)
        return p.returncode, p.stdout + p.stderr


def terminal(*a):
    env = {k: v for k, v in os.environ.items() if k != transcript.SESSION_ENV}
    p = subprocess.run([J, *a], env=env, capture_output=True, text=True, timeout=60)
    return p.returncode, p.stdout + p.stderr


# ---------------------------------------------------------------- the old record shape is moved on first read
(root / "record.json").write_text(json.dumps({"pins": [{"fact": "old top-level pin", "at": "x", "struck": None}],
                                              "work": [], "current": "default",
                                              "tracks": {"side": {"pins": [{"fact": "parked pin", "at": "x", "struck": None}], "work": [], "at": "x"}}}))
check("an old record is moved under its environment on first read",
      ([p["fact"] for p in state.get(root, "pins")], "pins" in json.loads((root / "record.json").read_text())), (["old top-level pin"], False))

# ---------------------------------------------------------------- two sessions, two environments
a = S("aaaaaaaa-1")
ctx = a.start()
check("a session starts bound to the project's start environment", ("bound to environment `default`" in ctx, tracks.bound(root, "aaaaaaaa-1")), (True, "default"))
code, out = a.j("switch", "side")
check("a switch from inside a session moves that session only",
      (code, "this session is on side" in out, "the project still starts on default" in out, tracks.bound(root, "aaaaaaaa-1"),
       json.loads((root / "record.json").read_text())["current"]), (0, True, True, "side", "default"))
b = S("bbbbbbbb-2")
check("a second session starts on the project's start environment, not on a's", tracks.bound(root, "bbbbbbbb-2"), "default")
a.j("pin", "written from a on side"); b.j("pin", "written from b on default")
rec = json.loads((root / "record.json").read_text())
check("each session's pin landed on its own environment",
      ([p["fact"] for p in rec["tracks"]["side"]["pins"]][-1], [p["fact"] for p in rec["tracks"]["default"]["pins"]][-1]),
      ("written from a on side", "written from b on default"))
code, out = a.j("pins")
check("a lists side's pins", ("written from a on side" in out, "written from b on default" in out), (True, False))
code, out = b.j("pins")
check("b lists default's", ("written from b on default" in out, "written from a on side" in out), (True, False))
a.j("work", "start", "side work"); b.j("work", "start", "default work")
code, out = a.j("open")
check("open work is the session's environment's", ("side work" in out, "default work" in out), (True, False))
code, out = a.j("tracks")
check("environments shows this session marked, the start environment, and who is where",
      ("*  side" in out or "* " in out, ">" in out, "aaaaaaaa" in out and "bbbbbbbb" in out), (True, True, True))
a.j("todo", "a side chore")
code, out = b.j("todo")
check("to-dos are the session's environment's too", "a side chore" in out, False)

# ---------------------------------------------------------------- --project, and a switch from the terminal
code, out = a.j("switch", "third", "--project")
check("--project binds this session and moves the start environment",
      (code, "the project starts on third" in out, tracks.bound(root, "aaaaaaaa-1"), json.loads((root / "record.json").read_text())["current"]),
      (0, True, "third", "third"))
check("b stays where it was", tracks.bound(root, "bbbbbbbb-2"), "default")
c = S("cccccccc-3")
check("a new session starts on the new start environment", tracks.bound(root, "cccccccc-3"), "third")
code, out = terminal("switch", "side")
check("from a terminal a switch is the project's, and it lists the sessions bound elsewhere with how to move them",
      (code, "the project starts on side" in out, "aaaaaaaa" in out and "bbbbbbbb" in out and "cccccccc" in out, "--session=<id>" in out),
      (0, True, True, True))
check("and none of them moved", (tracks.bound(root, "aaaaaaaa-1"), tracks.bound(root, "bbbbbbbb-2"), tracks.bound(root, "cccccccc-3")), ("third", "default", "third"))
code, out = terminal("switch", "side", "--session=bbbbbbbb")
check("--session moves that one", (code, tracks.bound(root, "bbbbbbbb-2"), tracks.bound(root, "aaaaaaaa-1")), (0, "side", "third"))
code, out = terminal("switch", "side", "--all-sessions")
check("--all-sessions moves every one", (tracks.bound(root, "aaaaaaaa-1"), tracks.bound(root, "cccccccc-3")), ("side", "side"))
code, out = a.j("switch", "--back")
check("--back returns this session to where it came from", (code, tracks.bound(root, "aaaaaaaa-1")), (0, "third"))
code, out = a.j("switch", "third")
check("switching to where you are is refused", code, 1)

# ---------------------------------------------------------------- the hooks read through the binding
ctx = a.start()
check("a session's start block names its own environment, not the project's", "bound to environment `third`" in ctx, True)
ctx = b.start()
check("and b's names b's", "bound to environment `side`" in ctx, True)
b.j("todo", "chore on side"); b.j("todo", "auto", "on")
out = subprocess.run([str(root / "hook.py")], input=json.dumps({"hook_event_name": "Stop", "session_id": "bbbbbbbb-2", "transcript_path": str(b.path)}),
                     capture_output=True, text=True, timeout=60).stdout
check("a stop hold reads the session's environment: b is held for side's list", "auto is on" in json.loads(out).get("reason", ""), True)
out = subprocess.run([str(root / "hook.py")], input=json.dumps({"hook_event_name": "Stop", "session_id": "aaaaaaaa-1", "transcript_path": str(a.path)}),
                     capture_output=True, text=True, timeout=60).stdout
check("a, on third, is not held for side's list", "auto is on" in (json.loads(out).get("reason", "") if out.strip() else ""), False)
check("bindings are runtime, not record", (root / "runtime" / "bindings.map").is_file() and "bindings" not in (root / "record.json").read_text(), True)


# ---------------------------------------------------------------- one live session per environment
e = Path(tempfile.mkdtemp()) / "proj"
(e / ".claude").mkdir(parents=True)
shutil.copytree(SRC, e / ".journal", ignore=shutil.ignore_patterns(
    "runtime", "state.json*", "record.json*", "todo", "docs", "tools", ".journal", ".git", ".claude", "__pycache__"))
(e / ".journal" / "settings.json").write_text(json.dumps({"bind_on_start": True}))
root2 = e / ".journal"
tdir2 = transcript.project_dir(e); tdir2.mkdir(parents=True, exist_ok=True)
J2 = str(root2 / "journal.py")


class T:
    def __init__(self, stem):
        self.stem = stem
        self.path = tdir2 / f"{stem}.jsonl"; self.path.write_text("")
        self.env = {**os.environ, transcript.SESSION_ENV: stem}
        self.ctx = self.fire("SessionStart", source="startup")

    def fire(self, event, **extra):
        out = subprocess.run([str(root2 / "hook.py")], input=json.dumps({"hook_event_name": event, "session_id": self.stem,
                             "transcript_path": str(self.path), **extra}), capture_output=True, text=True, timeout=60).stdout
        if not out.strip():
            return ""
        got = json.loads(out)
        return got.get("reason") or (got.get("hookSpecificOutput") or {}).get("additionalContext") or \
            (got.get("hookSpecificOutput") or {}).get("permissionDecisionReason") or ""

    def j(self, *a):
        p = subprocess.run([J2, *a], env=self.env, capture_output=True, text=True, timeout=60)
        return p.returncode, p.stdout + p.stderr

    def write(self):
        return self.fire("PreToolUse", tool_name="Write", tool_input={"file_path": str(e / "f.txt"), "content": "x"})

    def bash(self, cmd):
        return self.fire("PreToolUse", tool_name="Bash", tool_input={"command": cmd})

    def read(self):
        return self.fire("PreToolUse", tool_name="Read", tool_input={"file_path": str(e / "f.txt")})


def term2(*a):
    env = {k: v for k, v in os.environ.items() if k != transcript.SESSION_ENV}
    p = subprocess.run([J2, *a], env=env, capture_output=True, text=True, timeout=60)
    return p.returncode, p.stdout + p.stderr


x = T("xxxxxxxx-1")
check("the first session on an environment is not told anything", "IS TAKEN" in x.ctx, False)
y = T("yyyyyyyy-2")
check("a second session on a taken environment is registered nowhere", tracks.bound(root2, "yyyyyyyy-2"), None)
check("a second session on the same environment is told at its start, and by whom",
      ("ENVIRONMENT `default` IS TAKEN" in y.ctx, "xxxxxxxx" in y.ctx, "switch" in y.ctx), (True, True, True))
check("its edits are refused until it switches", "IS TAKEN" in y.write(), True)
check("its reads are not", y.read(), "")
check("its stop is held, first in the queue", y.fire("Stop").startswith("journal: environment `default` is taken"), True)
check("its journal writes are refused while it is registered nowhere", "registered on no environment" in y.bash('.journal/journal.py pin "x"'), True)
check("but a switch is let through: it is what registers it", y.bash('.journal/journal.py switch "side"'), "")
check("and reads are", y.bash('.journal/journal.py pins'), "")
y.j("work", "start", "w")
check("open work does not lift it", "IS TAKEN" in y.write(), True)
code, out = y.j("switch", "side")
check("it switches to a free environment, and that registers it", (code, tracks.bound(root2, "yyyyyyyy-2")), (0, "side"))
check("and is not held or refused for the environment any more", (y.fire("Stop"), "IS TAKEN" in y.write()), ("", False))
check("the first session was never bothered", ("IS TAKEN" in x.write(), x.fire("Stop")), (False, ""))
code, out = x.j("switch", "side")
check("a switch onto a taken environment is refused, naming the holder", (code, "taken by session yyyyyyyy" in out), (1, True))
code, out = term2("switch", "side", "--session=xxxxxxxx")
check("moving a session onto a taken environment from a terminal is refused too", (code, "not moved" in out, tracks.bound(root2, "xxxxxxxx-1")), (1, True, "default"))
check("the --session switch moved the project's start environment there all the same",
      json.loads((root2 / "record.json").read_text())["current"], "side")
z = T("zzzzzzzz-3")
check("a session starting on the start environment finds it taken by the session on it", ("IS TAKEN" in z.ctx, "yyyyyyyy" in z.ctx), (True, True))
y.fire("SessionEnd", reason="exit")
check("SessionEnd frees the environment", tracks.bound(root2, "yyyyyyyy-2"), None)
check("and the waiting session is free at its next event", (z.fire("Stop"), "IS TAKEN" in z.write()), ("", False))
code, out = x.j("switch", "side")
check("a switch onto it is refused now because z holds it", (code, "zzzzzzzz" in out), (1, True))
state.put(root2, "seen_at", 1000, stem="zzzzzzzz-3")
code, out = x.j("switch", "side")
check("a session not seen for longer than session_stale_hours is gone: the environment is free", code, 0)
code, out = x.j("tracks")
check("environments says who is running and who is stale", ("xxxxxxxx-1 (active just now)".replace("-1", "") in out, "zzzzzzzz (stale)" in out), (True, True))
q = T("qqqqqqqq-4")   # start environment is side, held by x
check("the start block names the holder and how it was seen", ("IS TAKEN" in q.ctx, "xxxxxxxx" in q.ctx, "active" in q.ctx), (True, True, True))
# subagents: outside the rule entirely — a subagent of the waiting session edits, stops and
# is never bound, and the parent's environment holder is not disturbed by it
sub = {"hook_event_name": "PreToolUse", "session_id": "qqqqqqqq-4", "agent_id": "ab12", "transcript_path": str(q.path),
       "tool_name": "Write", "tool_input": {"file_path": str(e / "g.txt"), "content": "x"}}
p = subprocess.run([str(root2 / "hook.py")], input=json.dumps(sub), capture_output=True, text=True, timeout=60)
check("a subagent's edit on a taken environment is not refused", ("deny" in p.stdout, p.returncode), (False, 0))
p = subprocess.run([str(root2 / "hook.py")], input=json.dumps({**sub, "hook_event_name": "Stop"}), capture_output=True, text=True, timeout=60)
check("a subagent's stop is never held", p.stdout.strip(), "")
check("and a subagent is never bound to an environment", tracks.bound(root2, "agent-ab12"), None)
check("nor does it count as a session on one", "agent-ab12" in json.dumps(tracks.live(root2)), False)
p = subprocess.run([str(root2 / "hook.py")], input=json.dumps({**sub, "tool_input": {"command": '.journal/journal.py switch "elsewhere"'}, "tool_name": "Bash"}),
                   capture_output=True, text=True, timeout=60)
check("a subagent switching environments is refused as a journal write, as before", "from a subagent is refused" in p.stdout, True)
(root2 / "settings.json").write_text(json.dumps({"bind_on_start": True, "one_session_per_environment": False}))
check("with the rule off, the same session is free", (q.fire("Stop"), "IS TAKEN" in q.write()), ("", False))
code, out = x.j("switch", "default")
check("and switches are not refused for it", code, 0)
(root2 / "settings.json").write_text(json.dumps({"bind_on_start": True, "silenced": ["track"]}))
r = T("rrrrrrrr-5")
check("silencing `environment` is the same as the rule off", "IS TAKEN" in r.ctx, False)

# ------------------------------------------------------------------ claiming an environment
# THE GUARD REFUSES AND DOES NOT ADJUDICATE, so the one case it is reached for — the holder
# is gone and the work is not — had no answer but waiting out the staleness window or
# turning the setting off for every environment at once.
(root2 / "settings.json").write_text(json.dumps({"bind_on_start": True}))
a = T("aaaaaaaa-6")
code, out = a.j("switch", "held-env")
check("a session takes an environment", (code, tracks.bound(root2, "aaaaaaaa-6")), (0, "held-env"))
b = T("bbbbbbbb-7")
code, out = b.j("switch", "held-env")
check("the guard still refuses a plain switch onto it", (code, "taken by session aaaaaaaa" in out), (1, True))
code, out = b.j("claim", "held-env")
check("a claim with no reason is refused: the evicted session is owed the sentence",
      (code, "a claim says why" in out), (1, True))
code, out = b.j("claim", "no-such-env", "mine now")
check("a claim of an environment that does not exist is refused, naming what would make one",
      (code, "nothing to claim" in out, "prepare" in out), (1, True, True))
code, out = b.j("claim", "held-env", "its terminal was closed hours ago")
check("the claim takes it, names who lost it and why",
      (code, "claimed held-env from session aaaaaaaa" in out, "its terminal was closed hours ago" in out),
      (0, True, True))
check("the claimer is bound to it", tracks.bound(root2, "bbbbbbbb-7"), "held-env")
check("and the holder is bound to NOTHING, never to a second session on the same environment",
      tracks.bound(root2, "aaaaaaaa-6"), None)
claims = json.loads((root2 / "record.json").read_text())["claims"]
check("the claim is on the record: who, from whom, and why",
      (claims[-1]["track"], claims[-1]["by"], claims[-1]["from"], claims[-1]["why"]),
      ("held-env", "bbbbbbbb-7", ["aaaaaaaa-6"], "its terminal was closed hours ago"))
held_text = a.fire("Stop")
check("the evicted session is told at its next stop, with the reason and how to take it back",
      ("was claimed by another session" in held_text, "bbbbbbbb" in held_text,
       "its terminal was closed hours ago" in held_text), (True, True, True))
check("it is news, said once: the next stop is not held for it again",
      "was claimed" in a.fire("Stop"), False)
c = T("cccccccc-8")
c.j("switch", "empty-env")
c.fire("SessionEnd", reason="exit")
code, out = b.j("claim", "empty-env", "starting fresh here")
check("claiming an environment nobody holds is allowed and says so plainly",
      (code, "held by nobody" in out), (0, True))
code, out = a.j("environments", "claim", "empty-env", "the twin spelling under the noun")
check("`journal environments claim` is the same command, eviction and all",
      (code, tracks.bound(root2, "aaaaaaaa-6"), tracks.bound(root2, "bbbbbbbb-7")),
      (0, "empty-env", None))
code, out = a.j("environments", "switch", "held-env")
check("and every other lifecycle verb answers under the noun too",
      (code, tracks.bound(root2, "aaaaaaaa-6")), (0, "held-env"))

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
