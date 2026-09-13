#!/usr/bin/env python3
"""A to-do's priority: bigger is more important, 100 is the default, and it orders
the list and what `ready()`/auto pick up next.

    .journal/test_priority.py
"""
import json, os, sys, tempfile
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


def j(*a):
    code, out = P.cli(*a, session="s1")
    return code, out.strip()


j("switch", "t")

# ------------------------------------------------------------------ backward compatibility
# an old to-do file, written before this field existed, has no "priority:" line at all.
root = d / ".journal"
todo_dir = root / "environments" / "t" / "todo"
todo_dir.mkdir(parents=True, exist_ok=True)
(todo_dir / "001-old-format.md").write_text(
    "---\ntitle: an old to-do from before this feature existed\ntrack: t\nat: 2020-01-01T00:00:00+00:00\n---\n\nbody\n"
)
old, _ = todo._get(root, "t", 1)
check("a file with no priority field reads as the default", todo.priority_of(old), 100)
check("and shows no priority fact — it is the common case, not worth a line",
      "priority" in todo.render(root, "t"), False)

# ------------------------------------------------------------------ setting it: numbers and names
j("todos", "add", "second")   # to-do 2
j("todos", "add", "third")    # to-do 3
check("a raw number", j("todos", "priority", "2", "70"), (0, "to-do 2 is priority 70"))
check("a named level", j("todos", "priority", "3", "high"), (0, "to-do 3 is priority high (150)"))
check("default is a name for 100, same as never setting it",
      j("todos", "priority", "3", "default"), (0, "to-do 3 is priority 100"))
code, out = j("todos", "priority", "2", "bogus")
check("a nonsense value is refused, and nothing changed", (code, "critical" in out and "low" in out), (1, True))
check("still 70 after the refused attempt", todo.priority_of(todo._get(root, "t", 2)[0]), 70)
code, out = j("todos", "priority", "999", "high")
check("an unknown to-do number is refused, not silently ignored", code, 1)

# ------------------------------------------------------------------ ordering the list
j("todos", "priority", "2", "critical")   # to-do 2: 200 — highest
j("todos", "priority", "3", "low")        # to-do 3: 50 — lowest
# to-do 1 stays at the default, 100 — in between
out = j("todos")[1]
order = [int(l.strip().split()[0]) for l in out.splitlines() if l.strip()[:1].isdigit()]
check("default list order: highest priority first (2, 1, 3)", order, [2, 1, 3])

out_asc = j("todos", "--order=asc")[1]
order_asc = [int(l.strip().split()[0]) for l in out_asc.splitlines() if l.strip()[:1].isdigit()]
check("--order=asc: lowest priority first (3, 1, 2)", order_asc, [3, 1, 2])

out_id = j("todos", "--order-by-id")[1]
order_id = [int(l.strip().split()[0]) for l in out_id.splitlines() if l.strip()[:1].isdigit()]
check("--order-by-id: back to plain number order, ignoring priority entirely (3, 2, 1)",
      order_id, [3, 2, 1])

# ------------------------------------------------------------------ ready() feeds auto and `journal next`
ready = todo.ready(root, "t")
check("ready() suggests the highest-priority row first", ready[0]["n"], 2)

# an ANSWERED to-do still outranks priority — the user's own word to do it now
j("todos", "priority", "1", "low")
j("todos", "ask", "1", "what number?")
j("todos", "answer", "1", "42")
ready2 = todo.ready(root, "t")
check("an answered-but-low-priority row still comes first", ready2[0]["n"], 1)

print(f"\n{ok} passed, {fail} failed")
raise SystemExit(1 if fail else 0)
