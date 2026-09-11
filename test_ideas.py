#!/usr/bin/env python3
"""Ideas: a stray line, global, no promise attached — and the two ways out of it.

    .journal/test_ideas.py
"""
import json, os, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
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
(d / ".journal" / "settings.json").write_text(json.dumps({"idea_max_chars": 40}))
P = testkit.Project(d)


def j(*a):
    return P.cli(*a)


# ------------------------------------------------------------------ jot one down
code, out = j("ideas", "add", "a stray thought")
check("added", (code, "idea 1 (1 standing)" in out), (0, True))
code, out = j("ideas")
check("listed", "a stray thought" in out, True)

# ------------------------------------------------------------------ global, not environment-scoped
j("prepare", "elsewhere")
code, out = j("ideas")
check("visible from a DIFFERENT environment too — it is the project's, not one line of work's",
      "a stray thought" in out, True)
j("switch", "default")

# ------------------------------------------------------------------ the cap
code, out = j("ideas", "add", "x" * 60)
check("a paragraph is refused", (code, "60 characters" in out), (1, True))
code, out = j("ideas", "add", "x" * 40)
check("a line fits", code, 0)

# ------------------------------------------------------------------ dropping needs a reason
code, out = j("ideas", "drop", "1")
check("drop wants a reason", code, 1)
code, out = j("ideas", "drop", "1", "never mind")
check("dropped", code, 0)
code, out = j("ideas")
check("gone from the standing list", "a stray thought" in out, False)
code, out = j("ideas", "--all")
check("kept, struck, under --all", ("a stray thought" in out, "never mind" in out), (True, True))
code, out = j("ideas", "drop", "1", "again")
check("a second drop is refused", code, 1)

# ------------------------------------------------------------------ promoting turns it into a to-do
code, out = j("ideas", "add", "worth building")
n = out.split()[1]  # "idea N (…"
code, out = j("ideas", "promote", n)
check("promote wants a title", code, 1)
code, out = j("ideas", "promote", n, "--title=build the thing")
check("promoted", (code, "now a to-do on" in out), (0, True))
code, out = j("todos")
check("the to-do is really there", "build the thing" in out, True)
code, out = j("ideas", "--all")
check("the idea is dropped, not standing, and says where it went",
      ("worth building" in out, "promoted to a to-do on" in out), (True, True))

print(f"\n{ok} passed, {fail} failed")
raise SystemExit(1 if fail else 0)
