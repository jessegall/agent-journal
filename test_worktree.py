#!/usr/bin/env python3
"""A linked worktree shares the main checkout's journal: symlink when clean, redirect when not."""
import json, os, shutil, subprocess, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import transcript  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


def git(cwd, *a):
    return subprocess.run(["git", *a], cwd=cwd, capture_output=True, text=True, timeout=60).stdout.strip()


base = Path(tempfile.mkdtemp())
main = base / "main"
main.mkdir()
git(main, "init", "-q", "-b", "main")
git(main, "config", "user.email", "t@t"); git(main, "config", "user.name", "t")
shutil.copytree(SRC, main / ".journal", ignore=shutil.ignore_patterns("runtime", "state.json*", "record.json*", "todo", "docs", "tools", ".journal", ".git", ".claude", "__pycache__"))
(main / ".journal" / "settings.json").write_text("{}")
(main / "README").write_text("x\n")
git(main, "add", "-A"); git(main, "commit", "-q", "-m", "init")
for p in (main, base / "wt"):
    transcript.project_dir(p).mkdir(parents=True, exist_ok=True)
env = {**os.environ, transcript.SESSION_ENV: "m1"}
subprocess.run([str(main / ".journal" / "journal.py"), "pin", "a fact from main"], env=env, capture_output=True, timeout=60)

# a clean linked worktree: the copy becomes a symlink at session start
git(main, "worktree", "add", "-q", str(base / "wt"), "-b", "feature")
wt = base / "wt"
check("the worktree has a checked-out copy", ((wt / ".journal").is_dir(), (wt / ".journal").is_symlink()), (True, False))
tpath = transcript.project_dir(wt) / "w1.jsonl"; tpath.write_text("")
p = subprocess.run([str(wt / ".journal" / "hook.py")], input=json.dumps({"hook_event_name": "SessionStart", "source": "startup", "session_id": "w1", "transcript_path": str(tpath)}),
                   capture_output=True, text=True, timeout=60)
ctx = json.loads(p.stdout)["hookSpecificOutput"]["additionalContext"]
check("session start in the worktree replaces the copy with a symlink and says so",
      ((wt / ".journal").is_symlink(), (wt / ".journal").resolve() == (main / ".journal").resolve(), "replaced with a symlink" in " ".join(ctx.split())), (True, True, True))
check("and the main checkout's pin is what the worktree is handed", "a fact from main" in ctx, True)
wenv = {**os.environ, transcript.SESSION_ENV: "w1"}
subprocess.run([str(wt / ".journal" / "journal.py"), "pin", "a fact from the worktree"], env=wenv, capture_output=True, timeout=60)
p = subprocess.run([str(main / ".journal" / "journal.py"), "pins"], env=env, capture_output=True, text=True, timeout=60)
check("a pin written in the worktree is in the main journal", "a fact from the worktree" in p.stdout, True)
p = subprocess.run([str(wt / ".journal" / "journal.py"), "worktree"], env=wenv, capture_output=True, text=True, timeout=60)
check("journal worktree reports the link", "is a symlink" in " ".join(p.stdout.split()), True)
# git in the worktree must not see the link: a commit there leaves .journal untouched
check("git status in the worktree is clean after the link", git(wt, "status", "--porcelain"), "")
(wt / "feature.txt").write_text("x\n")
git(wt, "add", "-A"); git(wt, "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "-m", "feature")
check("a commit in the worktree records the feature and not the link",
      (git(wt, "ls-tree", "HEAD", ".journal")[:6], "feature.txt" in git(wt, "ls-tree", "--name-only", "HEAD")), ("040000", True))
check("the main checkout's journal files are still the tracked ones",
      git(wt, "ls-tree", "--name-only", "HEAD", ".journal/hook.py"), ".journal/hook.py")
p = subprocess.run([str(main / ".journal" / "journal.py"), "worktree"], env=env, capture_output=True, text=True, timeout=60)
check("in the main checkout it is not a linked worktree", "not a linked worktree" in p.stdout, True)

# a dirty copy is not deleted: redirected, and link does it by hand
git(main, "worktree", "add", "-q", str(base / "wt2"), "-b", "feature2")
wt2 = base / "wt2"
transcript.project_dir(wt2).mkdir(parents=True, exist_ok=True)
(wt2 / ".journal" / "record.json").write_text(json.dumps({"pins": [{"fact": "local only", "at": "x", "struck": None}]}))
tpath2 = transcript.project_dir(wt2) / "w2.jsonl"; tpath2.write_text("")
p = subprocess.run([str(wt2 / ".journal" / "hook.py")], input=json.dumps({"hook_event_name": "SessionStart", "source": "startup", "session_id": "w2", "transcript_path": str(tpath2)}),
                   capture_output=True, text=True, timeout=60)
ctx = json.loads(p.stdout)["hookSpecificOutput"]["additionalContext"]
check("a copy with local changes is kept, the main journal is used, and it says so",
      ((wt2 / ".journal").is_symlink(), "a copy with local changes" in " ".join(ctx.split()), "a fact from main" in ctx), (False, True, True))
p = subprocess.run([str(wt2 / ".journal" / "journal.py"), "worktree", "link"], env={**os.environ, transcript.SESSION_ENV: "w2"}, capture_output=True, text=True, timeout=60)
check("worktree link replaces it and keeps the copy aside",
      (p.returncode, (wt2 / ".journal").is_symlink(), (wt2 / ".journal.copy" / "record.json").is_file()), (0, True, True))


# ---------------------------------------------------------------- a session that moved into the worktree mid-way
# its transcript stays under the MAIN checkout's folder; the CLI in the worktree must still find it
import state  # noqa: E402
import uuid  # noqa: E402
moved_id = str(uuid.uuid4())
moved = transcript.project_dir(main) / f"{moved_id}.jsonl"; moved.write_text("")
check("a transcript under another checkout's folder is found by its session id", transcript.find(wt, moved_id), moved)
state.put(main / ".journal", "pin_due", {"rung": 0.5, "used": 500, "window": 1000}, stem=moved_id)
p = subprocess.run([str(wt / ".journal" / "journal.py"), "nothing", "only reads"], env={**os.environ, transcript.SESSION_ENV: moved_id},
                   capture_output=True, text=True, timeout=60)
check("`journal nothing` from the worktree clears the gate the hook set for that session",
      (p.returncode, state.get(main / ".journal", "pin_due", None, stem=moved_id)), (0, None))
p = subprocess.run([str(wt / ".journal" / "journal.py"), "nothing", "only reads"], env={**os.environ, transcript.SESSION_ENV: "no-such-session-0"},
                   capture_output=True, text=True, timeout=60)
check("with no transcript to file under, it says the decision was NOT filed", (p.returncode, "NOT filed" in p.stdout + p.stderr), (1, True))

# ---------------------------------- the shipped .gitignore hides the shared journal
# A WORKTREE'S `.journal` IS A SYMLINK, and `/.journal/` — with the trailing slash — is a
# pattern that matches a DIRECTORY and nothing else. So the shared journal showed as
# `?? .journal` in every worktree of this repo, and a `git add -A` there would have
# committed a symlink pointing at an absolute path on one machine. Measured on the real
# repo: check-ignore returned 1 in the worktree and 0 in the main checkout, for the same
# pattern and the same name.
probe = base / "ignore-probe"
probe.mkdir()
git(probe, "init", "-q", "-b", "main")


def ignores(pattern: str, make) -> bool:
    (probe / ".gitignore").write_text(pattern + "\n")
    target = probe / ".journal"
    if target.is_symlink() or target.is_file():
        target.unlink()
    elif target.is_dir():
        shutil.rmtree(target)
    make(target)
    r = subprocess.run(["git", "check-ignore", "-q", ".journal"], cwd=probe, timeout=60)
    return r.returncode == 0


as_symlink = lambda t: t.symlink_to(base)
as_directory = lambda t: t.mkdir()

check("`/.journal/` does NOT hide a symlink — the bug", ignores("/.journal/", as_symlink), False)
check("`/.journal` does", ignores("/.journal", as_symlink), True)
check("and still hides the real directory in the main checkout", ignores("/.journal", as_directory), True)
check("the shipped .gitignore carries the pattern without the trailing slash",
      [l for l in (SRC / ".gitignore").read_text().splitlines() if l.strip() in ("/.journal", "/.journal/")],
      ["/.journal"])

# ─────────── a granted subagent writing from inside a worktree, end to end ────────────────
# The actual use case: the dispatcher grants in the main checkout, the agent works in a
# worktree, and one record holds both. Demonstrated rather than argued.
wt_main = Path(tempfile.mkdtemp()) / "main"
import testkit as _tk
_tk.make(wt_main, SRC)
for c in (["init", "-q"], ["config", "user.email", "t@t"], ["config", "user.name", "t"]):
    subprocess.run(["git", *c], cwd=wt_main, capture_output=True)
(wt_main / "f.txt").write_text("x")
subprocess.run(["git", "add", "-A"], cwd=wt_main, capture_output=True)
subprocess.run(["git", "commit", "-q", "-m", "kit: base"], cwd=wt_main, capture_output=True)
side = wt_main.parent / "side"
subprocess.run(["git", "worktree", "add", "-q", str(side), "-b", "side"], cwd=wt_main, capture_output=True)
check("a worktree checks out its own copy of .journal", (side / ".journal").is_dir(), True)
wt_env = {**os.environ, transcript.SESSION_ENV: "m1"}
_td = transcript.project_dir(wt_main); _td.mkdir(parents=True, exist_ok=True); (_td / "m1.jsonl").write_text("")
_J = str(wt_main / ".journal" / "journal.py")
for a_ in (["prepare", "scout"], ["switch", "default"], ["grant", "scout"]):
    subprocess.run([sys.executable, _J, *a_], env=wt_env, capture_output=True, cwd=str(wt_main))
p = subprocess.run([sys.executable, str(side / ".journal" / "journal.py"), "--env=scout",
                    "pins", "add", "written from the worktree"],
                   env=wt_env, capture_output=True, text=True, cwd=str(side))
check("a write from inside the worktree succeeds", "pinned 1" in p.stdout, True)
check("and the worktree's copy became a symlink to the main checkout's",
      (side / ".journal").is_symlink()
      and Path(os.readlink(side / ".journal")).resolve() == (wt_main / ".journal").resolve(), True)
_pins = json.loads((wt_main / ".journal" / "environments" / "scout" / "pins.json").read_text())["pins"]
check("the pin landed in the MAIN checkout's record — one record, two checkouts",
      [x["fact"] for x in _pins], ["written from the worktree"])
_st = subprocess.run(["git", "status", "--porcelain"], cwd=str(side), capture_output=True, text=True).stdout
check("and git in the worktree sees nothing of .journal",
      [l for l in _st.splitlines() if ".journal" in l], [])

# ─────────── a SUBAGENT in a worktree of its own ──────────────────────────────────────────
# NOTHING FIRES A SessionStart FOR A SUBAGENT, so the linking cannot depend on one. Its
# first tool call is the first thing that reaches this checkout at all, and `resolve` runs
# at the import of hook.py — so the same event that tells it its name is the one that
# replaces the copy. If that were not true a subagent would work a SECOND record: its
# ledger, its report and its pins would land in a directory the parent never reads and
# `git status` in the worktree would carry them.
far = wt_main.parent / "far"
subprocess.run(["git", "worktree", "add", "-q", str(far), "-b", "far"], cwd=wt_main, capture_output=True)
check("the worktree starts as a plain copy",
      ((far / ".journal").is_dir(), (far / ".journal").is_symlink()), (True, False))
_AID = "wa77"
_p = subprocess.run([sys.executable, str(far / ".journal" / "hook.py")], cwd=str(far),
                    input=json.dumps({"hook_event_name": "PostToolUse", "session_id": "m1",
                                      "transcript_path": str(_td / "m1.jsonl"), "agent_id": _AID,
                                      "tool_name": "Bash", "tool_input": {"command": "ls"},
                                      "tool_response": {"stdout": ""}}),
                    env=wt_env, capture_output=True, text=True, timeout=60)
_ctx = (json.loads(_p.stdout or "{}").get("hookSpecificOutput") or {}).get("additionalContext", "")
check("its first tool call tells it its name AND links the copy",
      (f"YOU ARE AGENT `{_AID}`" in _ctx, (far / ".journal").is_symlink(),
       (far / ".journal").resolve() == (wt_main / ".journal").resolve()), (True, True, True))


def _far(*a):
    r = subprocess.run([sys.executable, str(far / ".journal" / "journal.py"), "--env=scout",
                           f"--as={_AID}", *a], env=wt_env, capture_output=True, text=True,
                       cwd=str(far), timeout=60)
    return r.stdout + r.stderr
subprocess.run([sys.executable, _J, "--env=scout", "todos", "add", "the row it was sent for"],
               env=wt_env, capture_output=True, cwd=str(wt_main))
_started = _far("todos", "start", "1")   # `start` opens the work too; that is the funnel
check("it claims and starts the row from the worktree", "held for `wa77`" in _started, True)
check("and reports it finished, still unable to close",
      ("reported finished" in _far("todos", "report", "1", "done in the worktree")), True)
check("its ledger is under the MAIN checkout, in its own folder",
      json.loads((wt_main / ".journal" / "environments" / "scout" / "agents" / _AID /
                  "work.json").read_text())["work"][0]["subject"], "the row it was sent for")
check("the parent, in the main checkout, sees the report",
      [t["n"] for t in __import__("todo").reported(wt_main / ".journal", "scout")], [1])
_deny = subprocess.run([sys.executable, str(far / ".journal" / "hook.py")], cwd=str(far),
                       input=json.dumps({"hook_event_name": "PreToolUse", "session_id": "m1",
                                         "transcript_path": str(_td / "m1.jsonl"), "agent_id": _AID,
                                         "tool_name": "Bash",
                                         "tool_input": {"command": f'{far}/.journal/journal.py rule "x"'}}),
                       env=wt_env, capture_output=True, text=True, timeout=60)
check("a worktree is no way around the grant: a rule is still refused",
      "deny" in (_deny.stdout + _deny.stderr).lower(), True)
check("and git in ITS worktree sees nothing of .journal either",
      [l for l in subprocess.run(["git", "status", "--porcelain"], cwd=str(far), capture_output=True,
                                 text=True).stdout.splitlines() if ".journal" in l], [])

# ─────────── the filesystem answers before git is asked ───────────────────────────────────
# `resolve` runs at the import of journal.py and hook.py — every command, every tool call —
# and shelled out to `git rev-parse` twice to learn something a stat already knows.
import worktree as _w
_calls = {"n": 0}
_real = subprocess.run


def _counted(*a, **k):
    _calls["n"] += 1
    return _real(*a, **k)


subprocess.run = _counted
try:
    _w._MAIN.clear()
    _w.resolve(Path(SRC))                      # the package's own checkout: a .git DIRECTORY
    check("a main checkout asks git nothing", _calls["n"], 0)
    _calls["n"] = 0; _w._MAIN.clear()
    _w.main_root(Path(tempfile.mkdtemp()))     # not a repository at all
    check("nor does a directory that is no repository", _calls["n"], 0)
    _calls["n"] = 0; _w._MAIN.clear()
    _w.main_root(side)                         # the linked worktree made above
    check("but a linked worktree still asks, because only git knows the common dir",
          _calls["n"], 2)
    _w.main_root(side)
    check("and asks once per process, not once per caller", _calls["n"], 2)
finally:
    subprocess.run = _real

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
