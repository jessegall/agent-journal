#!/usr/bin/env python3
"""A root that is not a repository, repositories under it, worktrees under those.

THE LAYOUT EVERY ONE OF THESE BUGS HID IN, and it is ordinary:

    root/                          no git here at all — but the journal lives here
      alpha/                       a repository
        .claude/worktrees/w        Claude Code's own worktree, three levels down
      beta/                        another repository
      beta-fix/                    a linked worktree of beta, sitting as a sibling

Nothing was wrong in any single component. The journal found itself by where its own script
sat, the hook was registered as `"$CLAUDE_PROJECT_DIR"/.journal/hook.py`, and every printed
command said `.journal/journal.py` — each correct for a session standing at the root, and
each silently wrong from the four other places an agent actually works. A hook that is not
registered says nothing by definition, so none of it announced itself.
"""
import json, os, subprocess, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import testkit  # noqa: E402
import install  # noqa: E402
import worktree as wt  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


def git(cwd, *a):
    return subprocess.run(["git", *a], cwd=str(cwd), capture_output=True, text=True).stdout


base = Path(tempfile.mkdtemp()) / "root"
testkit.make(base, SRC)
for name in ("alpha", "beta"):
    d = base / name
    d.mkdir()
    git(d, "init", "-q", "-b", "main")
    git(d, "config", "user.email", "t@t"); git(d, "config", "user.name", "t")
    (d / "f.txt").write_text("x"); git(d, "add", "-A"); git(d, "commit", "-q", "-m", "init")
git(base / "alpha", "worktree", "add", "-q", str(base / "alpha/.claude/worktrees/w"), "-b", "w")
git(base / "beta", "worktree", "add", "-q", str(base / "beta-fix"), "-b", "fix")

check("the root holding the journal is not a repository", (base / ".git").exists(), False)

PLACES = {
    "root": base,
    "a repository under it": base / "alpha",
    "a worktree under that": base / "alpha/.claude/worktrees/w",
    "a worktree beside it": base / "beta-fix",
}

# ─────────── the journal is found by walking up, from anywhere ─────────────────────────────
check("`nearest` finds the one journal from every one of them",
      [wt.nearest(p) == base / ".journal" for p in PLACES.values()], [True] * 4)
check("and finds none where there is none", wt.nearest(Path(tempfile.mkdtemp())), None)

# ─────────── the registered hook command runs from every one of them ───────────────────────
# `.claude/settings.json` is read from the starting directory's OWN `.claude/` with no
# parent-directory fallback — documented — so the command itself has to do the walking.
def fire(cwd, event="SessionStart", source="startup", **kw):
    p = subprocess.run(["sh", "-c", install.COMMAND], cwd=str(cwd), capture_output=True, text=True,
                       input=json.dumps({"hook_event_name": event, "source": source,
                                         "transcript_path": "/nonexistent.jsonl", **kw}),
                       env={**os.environ, "CLAUDE_PROJECT_DIR": str(cwd)})
    return (json.loads(p.stdout or "{}").get("hookSpecificOutput") or {}).get("additionalContext", "")


for label, cwd in PLACES.items():
    check(f"the hook command finds the journal from {label}",
          bool(fire(cwd, session_id="s" + str(abs(hash(label)))[:6])), True)
check("and stays silent, exit 0, where no journal is above it",
      subprocess.run(["sh", "-c", install.COMMAND], cwd=tempfile.mkdtemp(), input="{}",
                     capture_output=True, text=True,
                     env={**os.environ, "CLAUDE_PROJECT_DIR": tempfile.mkdtemp()}).returncode, 0)

# ─────────── every command it prints runs from where it is read ────────────────────────────
# `.journal/journal.py` is only right from the folder holding the journal. An agent in
# `alpha/` ran what it was told and got "No such file or directory" — from a system whose
# whole job is telling an agent what to run.
for label, cwd in PLACES.items():
    ctx = subprocess.run([sys.executable, str(base / ".journal/hook.py")], cwd=str(cwd),
                         capture_output=True, text=True,
                         input=json.dumps({"hook_event_name": "SessionStart", "source": "compact",
                                           "session_id": "p" + str(abs(hash(label)))[:6],
                                           "transcript_path": "/nonexistent.jsonl"})).stdout
    line = next((l.strip() for l in
                 (json.loads(ctx or "{}").get("hookSpecificOutput") or {})
                 .get("additionalContext", "").splitlines() if "journal.py conversation" in l), "")
    # RESOLVED AGAINST THE READER'S CWD, which is the whole question: a relative spelling
    # is right from the root and a lie from anywhere else, so the check has to stand where
    # the reader stands rather than where the test process happens to be.
    check(f"the command the block prints runs from {label}",
          bool(line) and (Path(cwd) / line.split()[0]).is_file(), True)

# ─────────── every printed PATH, not only the executable ───────────────────────────────────
# Found by a dogfood agent three directories down: a to-do's brief ends with the FILE it was
# written to — `.journal/environments/x/todo/001-….md` — and that resolved only from the
# project root. Every path this package prints starts with the same four characters, so
# every one of them was wrong from the same places.
J = str(base / ".journal" / "journal.py")
subprocess.run([sys.executable, J, "todos", "add", "a row with a brief"], cwd=str(base),
               input="the brief", capture_output=True, text=True,
               env={**os.environ, "CLAUDE_CODE_SESSION_ID": "paths"})
for label, cwd in PLACES.items():
    out = subprocess.run([sys.executable, J, "todos", "1"], cwd=str(cwd), capture_output=True,
                         text=True, env={**os.environ, "CLAUDE_CODE_SESSION_ID": "paths"}).stdout
    said = [w for w in out.split() if ".journal/" in w and w.endswith(".md")]
    check(f"the file path a brief prints resolves from {label}",
          bool(said) and (Path(cwd) / said[0]).is_file(), True)

# ─────────── one record, whichever place wrote to it ───────────────────────────────────────
for i, (label, cwd) in enumerate(PLACES.items(), 1):
    subprocess.run([sys.executable, J, "todos", "add", f"from {label}"], cwd=str(cwd),
                   capture_output=True, text=True,
                   env={**os.environ, "CLAUDE_CODE_SESSION_ID": "one"})
listed = subprocess.run([sys.executable, J, "todos"], cwd=str(base), capture_output=True,
                        text=True, env={**os.environ, "CLAUDE_CODE_SESSION_ID": "one"}).stdout
check("four places wrote, and there is one record holding all four",
      [f"from {label}" in listed for label in PLACES], [True] * 4)

# ─────────── a worktree Claude Code makes is handed the journal at creation ────────────────
# `WorktreeCreate` is the ONE moment this can happen without anybody remembering to, and
# there is no hook for entering a worktree that already exists. A worktree gets the hooks at
# all only because `.claude/settings.json` is tracked and git checked it out — so a project
# whose journal is gitignored, or whose settings live above the repository, gets nothing.
fresh = base / "alpha" / ".claude" / "worktrees" / "made"
git(base / "alpha", "worktree", "add", "-q", str(fresh), "-b", "made")
check("a fresh worktree has no journal of its own", (fresh / ".journal").exists(), False)
_said = subprocess.run([sys.executable, str(base / ".journal/hook.py")], capture_output=True,
                       text=True, input=json.dumps({"hook_event_name": "WorktreeCreate",
                                                    "worktree_path": str(fresh),
                                                    "session_id": "wc1"})).stdout
check("the create hook links it to the journal above, and says so once",
      ((fresh / ".journal").is_symlink(),
       (fresh / ".journal").resolve() == (base / ".journal").resolve(),
       "shares" in (json.loads(_said or "{}").get("hookSpecificOutput") or {}).get("additionalContext", "")),
      (True, True, True))
check("and git in it sees nothing of .journal",
      [l for l in git(fresh, "status", "--porcelain").splitlines() if ".journal" in l], [])
check("run again, it changes nothing and says nothing — a copy is never overwritten",
      subprocess.run([sys.executable, str(base / ".journal/hook.py")], capture_output=True,
                     text=True, input=json.dumps({"hook_event_name": "WorktreeCreate",
                                                  "worktree_path": str(fresh),
                                                  "session_id": "wc1"})).stdout.strip(), "")
check("a worktree with no journal anywhere above it is left alone, not an error",
      subprocess.run([sys.executable, str(base / ".journal/hook.py")], capture_output=True,
                     text=True, input=json.dumps({"hook_event_name": "WorktreeCreate",
                                                  "worktree_path": tempfile.mkdtemp(),
                                                  "session_id": "wc2"})).returncode, 0)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
