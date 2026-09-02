#!/usr/bin/env python3
"""Sessions are bound to tracks: two sessions, two tracks, one project.

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
(d / ".journal" / "settings.json").write_text("{}")
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
check("an old record is moved under its track on first read",
      ([p["fact"] for p in state.get(root, "pins")], "pins" in json.loads((root / "record.json").read_text())), (["old top-level pin"], False))

# ---------------------------------------------------------------- two sessions, two tracks
a = S("aaaaaaaa-1")
ctx = a.start()
check("a session starts bound to the project's start track", ("bound to track `default`" in ctx, tracks.bound(root, "aaaaaaaa-1")), (True, "default"))
code, out = a.j("switch", "side")
check("a switch from inside a session moves that session only",
      (code, "this session is on side" in out, "the project still starts on default" in out, tracks.bound(root, "aaaaaaaa-1"),
       json.loads((root / "record.json").read_text())["current"]), (0, True, True, "side", "default"))
b = S("bbbbbbbb-2")
check("a second session starts on the project's start track, not on a's", tracks.bound(root, "bbbbbbbb-2"), "default")
a.j("pin", "written from a on side"); b.j("pin", "written from b on default")
rec = json.loads((root / "record.json").read_text())
check("each session's pin landed on its own track",
      ([p["fact"] for p in rec["tracks"]["side"]["pins"]][-1], [p["fact"] for p in rec["tracks"]["default"]["pins"]][-1]),
      ("written from a on side", "written from b on default"))
code, out = a.j("pins")
check("a lists side's pins", ("written from a on side" in out, "written from b on default" in out), (True, False))
code, out = b.j("pins")
check("b lists default's", ("written from b on default" in out, "written from a on side" in out), (True, False))
a.j("work", "start", "side work"); b.j("work", "start", "default work")
code, out = a.j("open")
check("open work is the session's track's", ("side work" in out, "default work" in out), (True, False))
code, out = a.j("tracks")
check("tracks shows this session marked, the start track, and who is where",
      ("*  side" in out or "* " in out, ">" in out, "aaaaaaaa" in out and "bbbbbbbb" in out), (True, True, True))
a.j("todo", "a side chore")
code, out = b.j("todo")
check("to-dos are the session's track's too", "a side chore" in out, False)

# ---------------------------------------------------------------- --project, and a switch from the terminal
code, out = a.j("switch", "third", "--project")
check("--project binds this session and moves the start track",
      (code, "the project starts on third" in out, tracks.bound(root, "aaaaaaaa-1"), json.loads((root / "record.json").read_text())["current"]),
      (0, True, "third", "third"))
check("b stays where it was", tracks.bound(root, "bbbbbbbb-2"), "default")
c = S("cccccccc-3")
check("a new session starts on the new start track", tracks.bound(root, "cccccccc-3"), "third")
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
check("a session's start block names its own track, not the project's", "bound to track `third`" in ctx, True)
ctx = b.start()
check("and b's names b's", "bound to track `side`" in ctx, True)
b.j("todo", "chore on side"); b.j("todo", "auto", "on")
out = subprocess.run([str(root / "hook.py")], input=json.dumps({"hook_event_name": "Stop", "session_id": "bbbbbbbb-2", "transcript_path": str(b.path)}),
                     capture_output=True, text=True, timeout=60).stdout
check("a stop hold reads the session's track: b is held for side's list", "auto is on" in json.loads(out).get("reason", ""), True)
out = subprocess.run([str(root / "hook.py")], input=json.dumps({"hook_event_name": "Stop", "session_id": "aaaaaaaa-1", "transcript_path": str(a.path)}),
                     capture_output=True, text=True, timeout=60).stdout
check("a, on third, is not held for side's list", "auto is on" in (json.loads(out).get("reason", "") if out.strip() else ""), False)
check("bindings are runtime, not record", (root / "runtime" / "bindings.map").is_file() and "bindings" not in (root / "record.json").read_text(), True)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
