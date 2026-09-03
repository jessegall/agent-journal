#!/usr/bin/env python3
"""A to-do's brief: it reads back with its structure intact, and it can be changed.

    .journal/test_todo.py

Owns what test_queue.py (the stop queue) and test_docs.py (docs, a different shape) do
not: todo.py's own CRUD — a brief's rendering, and the amend/replace verbs that change
one without rewriting the file by hand.
"""
import os, shutil, subprocess, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import todo, transcript  # noqa: E402

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
    "runtime", "state.json*", "record.json*", "todo", "docs", "tools", ".journal",
    ".git", ".claude", "__pycache__"))
(d / ".journal" / "settings.json").write_text("{}")
tdir = transcript.project_dir(d); tdir.mkdir(parents=True, exist_ok=True)
(tdir / "s1.jsonl").write_text("")
J = str(d / ".journal" / "journal.py")
env = {**os.environ, transcript.SESSION_ENV: "s1"}
root = d / ".journal"


def j(*args, stdin=""):
    p = subprocess.run([J, *args], env=env, input=stdin, capture_output=True, text=True, timeout=60)
    return p.returncode, p.stdout + p.stderr


# ─────────────────────────── a brief round-trips: heading, list, command ──────────────────────
BRIEF = (
    "The opening paragraph, in ordinary prose that is long enough to wrap across more "
    "than one line once it is filled back to the terminal width, so wrapping is actually exercised.\n"
    "## What exactly\n"
    "  - first item of the list\n"
    "  - second item of the list\n"
    "## Where to start\n"
    "    journal todo edit 1 --section=\"What exactly\" --brief\n"
)
code, out = j("todo", "a brief with structure", "--brief", stdin=BRIEF)
check("adding with a brief succeeds", code, 0)
code, out = j("todo", "1")
check("the heading `## What exactly` is on its own line, not swallowed into prose",
      "## What exactly" in out, True)
check("the heading `## Where to start` is on its own line too",
      "## Where to start" in out, True)
check("the indented list items survive, each on its own line",
      ("- first item of the list" in out, "- second item of the list" in out), (True, True))
check("the indented command line survives exactly, not rewrapped",
      'journal todo edit 1 --section="What exactly" --brief' in out, True)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
