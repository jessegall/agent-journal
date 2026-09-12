#!/usr/bin/env python3
"""`journal todos prune`: done/dropped to-dos, cleared off the list once they are old
enough — archived by default, actually deleted only with --force. An open to-do is
never touched, whatever its age.

    .journal/test_prune.py
"""
import os, re, sys, tempfile
from datetime import datetime, timedelta, timezone
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import testkit, todo  # noqa: E402

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
todo_dir = root / "environments" / "t" / "todo"


def j(*a):
    code, out = P.cli(*a, session="s1")
    return code, out.strip()


def backdate(n: int, days: int):
    """Rewrite to-do n's `done:` line as if it closed `days` ago — the only way to
    test an age-based cutoff without waiting for real time to pass."""
    f = next(todo_dir.glob(f"{n:03d}-*.md"))
    when = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat(timespec="seconds")
    f.write_text(re.sub(r"^done: .*$", f"done: {when}", f.read_text(), flags=re.M))


j("switch", "t")
j("todos", "add", "old and done")       # 1
j("todos", "add", "recent and done")    # 2
j("todos", "add", "still open")         # 3
j("todos", "done", "1", "finished ages ago")
j("todos", "done", "2", "finished just now")
backdate(1, 60)

# ------------------------------------------------------------------ requires an explicit age
code, out = j("todos", "prune")
check("no age given is refused — no silent default for a destructive sweep", code, 1)
check("still on disk, untouched", (todo_dir / "archived").is_dir(), False)

# ------------------------------------------------------------------ an open to-do is NEVER touched
backdate3 = todo._get(root, "t", 3)[0]
check("to-do 3 has no done field at all — nothing to backdate, it is genuinely open",
      bool(backdate3.get("done")), False)

# ------------------------------------------------------------------ default: archive, not delete
code, out = j("todos", "prune", "--older-than=30d")
check("archives exactly the one old-enough row", (code, "archived 1" in out), (0, True))
check("the file is moved, not deleted", (todo_dir / "archived" / "001-old-and-done.md").is_file(), True)
check("gone from the todo/ folder itself", (todo_dir / "001-old-and-done.md").is_file(), False)

out = j("todos")[1]
check("the open list is unaffected (still just to-do 3)", "still open" in out and "old and done" not in out, True)
out_all = j("todos", "--all")[1]
check("--all still shows the recent done one — it was never a prune candidate",
      "recent and done" in out_all, True)
check("but the archived one is gone even from --all — _all() only scans the top-level folder",
      "old and done" in out_all, False)

code, out = j("todos", "prune", "--older-than=30d")
check("running prune again finds nothing left to archive", (code, "nothing to prune" in out), (0, True))

# ------------------------------------------------------------------ --force actually deletes
backdate(2, 60)
code, out = j("todos", "prune", "--older-than=30d", "--force")
check("force deletes instead of archiving", (code, "deleted 1" in out), (0, True))
check("really gone from disk — not moved anywhere", any(todo_dir.rglob("002-*.md")), False)

# ------------------------------------------------------------------ a bad duration/date is refused
code, out = j("todos", "prune", "--older-than=nonsense")
check("garbage age is refused, not silently treated as 0", code, 1)

print(f"\n{ok} passed, {fail} failed")
raise SystemExit(1 if fail else 0)
