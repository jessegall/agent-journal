#!/usr/bin/env python3
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

# ------------------------------------------------------------------ a to-do already on the list is not added again
j("todos", "add", "Flush the queue, after a minute!")
code, out = j("todos", "add", "flush the queue after a minute")
check("a title that differs only in case and punctuation is refused as the same to-do, pointing at amend and work update",
      (code, "already on the list" in out, "todos amend" in out, "work update" in out), (1, True, True, True))

# ------------------------------------------------------------------ done to-dos archive themselves
import prune as prune_mod  # noqa: E402
import todo as todo_mod  # noqa: E402

j("switch", "auto")
auto_dir = root / "environments" / "auto" / "todo"


def aged(n: int, days: int):
    f = next(auto_dir.glob(f"{n:03d}-*.md"))
    when = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat(timespec="seconds")
    f.write_text(re.sub(r"^done: .*$", f"done: {when}", f.read_text(), flags=re.M))


def listed():
    return [t["n"] for t in todo_mod._all(root, "auto")]


# the old layout: done to-dos from before this version, all still in the to-do folder itself
for title in ("done long ago", "done last week", "done today", "still open"):
    j("todos", "add", title)
for n in (1, 2, 3):
    j("todos", "done", str(n), "finished")
aged(1, 20)
aged(2, 8)
check("a done to-do stays listed for 7 days by default", todo_mod.archive_days(root, "auto"), 7)
check("before the sweep, the old layout lists every row", listed(), [1, 2, 3, 4])
check("the sweep archives the done to-dos older than that", prune_mod.sweep(root, "auto").get("todos_archived"), 2)
check("they are moved into archived/, not deleted",
      sorted(f.name[:3] for f in (auto_dir / "archived").glob("*.md")), ["001", "002"])
check("the list keeps the recent done one and the open one", listed(), [3, 4])
check("a second sweep has nothing left to archive", "todos_archived" in prune_mod.sweep(root, "auto"), False)

j("todos", "done", "4", "finished")
aged(4, 10)
prune_mod.sweep(root, "auto")
check("with the highest-numbered to-do archived, the list is down to one", listed(), [3])
code, out = j("todos", "add", "after the archive")
check("a new to-do never takes an archived to-do's number", sorted(f.name[:3] for f in auto_dir.glob("*.md")), ["003", "005"])

j("todos", "done", "5", "finished")
aged(5, 60)
prune_mod.sweep(root, "auto")
check("a done to-do past 30 days is still deleted outright", any(auto_dir.rglob("005-*.md")), False)
j("todos", "add", "after the deletion")
check("and its number is not given out again either", sorted(f.name[:3] for f in auto_dir.glob("*.md")), ["003", "006"])

code, out = j("todos", "keep", "0")
check("todos keep 0 keeps done to-dos listed", (code, "until archived by hand" in out), (0, True))
check("the setting is per environment", (todo_mod.archive_days(root, "auto"), todo_mod.archive_days(root, "t")), (0, 7))
j("todos", "done", "6", "finished")
aged(6, 10)
prune_mod.sweep(root, "auto")
check("with 0, the sweep archives nothing", listed(), [3, 6])
check("a negative number of days is refused", todo_mod.set_archive_days(root, "auto", -1)[0], False)
code, out = j("todos", "keep", "3")
check("todos keep sets the days", (code, "3 day(s)" in out, todo_mod.archive_days(root, "auto")), (0, True, 3))
prune_mod.sweep(root, "auto")
check("and the next sweep uses them", listed(), [3])

# ------------------------------------------------------------------ closing, starting, moving and naming rows
j("switch", "life")
j("todos", "add", "first step")        # 1
j("todos", "add", "needs the first")   # 2
j("todos", "after", "2", "1")
j("todos", "drop", "1", "not needed after all")
check("a dropped prerequisite keeps the row that waits on it waiting",
      todo.waiting_on(root, "life", todo._get(root, "life", 2)[0]), [1])
j("todos", "reopen", "1", "needed after all")
check("reopening clears the drop", todo._get(root, "life", 1)[0].get("struck") or "", "")

j("todos", "add", "third")             # 3
j("todos", "start", "3")
code, out = j("todos", "done", "3", "finished")
check("closing a to-do ends the work it opened, and says so", (code, "ended the work `third`" in out, "third" in j("open")[1]), (0, True, False))

j("work", "start", "fourth")
j("todos", "add", "fourth")            # 4
code, out = j("todos", "start", "4")
check("a start refused because the work is already open leaves the row unstarted",
      (code != 0, bool(todo._get(root, "life", 4)[0].get("started"))), (True, False))
j("work", "end", "fourth")

j("todos", "add", "fifth")             # 5
check("a to-do cannot be retitled to another open to-do's title", todo.retitle(root, "life", 5, "needs the first")[0], False)

j("switch", "dst2")
j("todos", "add", "old one")
todo._update(root, "dst2", 1, done="2020-01-01T00:00:00+00:00", how="done")
todo.prune(root, "dst2", "1d", "2026-09-14T00:00:00+00:00")
ok_move, _ = todo.move(root, "life", 5, "dst2", "2026-09-14T00:00:00+00:00")
check("a moved to-do never takes the number of a row archived at its destination",
      (ok_move, sorted(f.name[:3] for f in (root / "environments" / "dst2" / "todo").glob("*.md"))), (True, ["002"]))

j("switch", "rep")
j("todos", "add", "a job for a helper")
j("todos", "start", "1", "--as=helper")
j("todos", "report", "1", "fixed it", "--as=helper")
j("work", "end", "a job for a helper")
j("todo", "auto", "on")
code, out = j("next")
check("a row reported finished reads as yours to close, not as held by an agent still working",
      ("reported finished" in out, "held by an agent still working" in out), (True, False))

# ------------------------------------------------------------------ a test project does not outlive its process
import shutil as _shutil  # noqa: E402
import subprocess as _subprocess  # noqa: E402
_code = ("import sys, tempfile; from pathlib import Path; sys.path.insert(0, %r); import testkit; "
         "d = Path(tempfile.mkdtemp()) / 'proj'; testkit.make(d, Path(%r), cleanup=%s); print(d.parent)")
_gone = _subprocess.run([sys.executable, "-c", _code % (str(SRC), str(SRC), "True")],
                        capture_output=True, text=True, timeout=120).stdout.strip()
_kept = _subprocess.run([sys.executable, "-c", _code % (str(SRC), str(SRC), "False")],
                        capture_output=True, text=True, timeout=120,
                        env={**os.environ, "AGENT_JOURNAL_KEEP_TMP": "1"}).stdout.strip()
check("a test project is removed when the process that made it exits, and kept when asked",
      (bool(_gone) and Path(_gone).exists(), bool(_kept) and Path(_kept).exists()), (False, True))
_shutil.rmtree(_kept, ignore_errors=True)
_plain = _subprocess.run([sys.executable, "-c", "import sys, tempfile; sys.path.insert(0, %r); import testkit; "
                          "print(tempfile.mkdtemp())" % str(SRC)], capture_output=True, text=True, timeout=120).stdout.strip()
check("any temporary folder a test process makes is removed when it exits, not only projects",
      (bool(_plain), bool(_plain) and Path(_plain).exists()), (True, False))

print(f"\n{ok} passed, {fail} failed")
raise SystemExit(1 if fail else 0)
