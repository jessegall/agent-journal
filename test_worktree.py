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

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
