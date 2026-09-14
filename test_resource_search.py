#!/usr/bin/env python3
"""journal <noun> search <term>: lines in that one resource mentioning a word, open items first, --all adds closed."""
import os, sys, tempfile
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
P = testkit.Project(d)


def j(*a):
    return P.cli(*a)


j("todos", "add", "wire the lantern relay")
j("todos", "add", "paint the shed")
j("todos", "add", "replace the lantern bulb")
j("todos", "done", "3", "swapped it")
j("messages", "add", "the lantern flickers at night")
j("questions", "add", "should the lantern stay on?")

code, out = j("todos", "search", "lantern")
check("todos search finds open to-dos mentioning the word, marked, and says a closed one is left out",
      (code, "wire the «lantern» relay" in out, "paint the shed" in out, "bulb" in out, "closed to-dos" in out),
      (0, True, False, False, True))
code, out = j("todos", "search", "lantern", "--all")
check("--all includes the closed to-do, marked as closed", ("bulb" in out, "(CLOSED)" in out), (True, True))
code, out = j("messages", "search", "lantern")
check("messages search looks at messages only", (code, "«lantern» flickers" in out, "relay" in out), (0, True, False))
code, out = j("questions", "search", "LANTERN")
check("search ignores case", (code, "stay on" in out), (0, True))
code, out = j("todos", "search", "zzznothing")
check("a search with no match says so", (code, "NO TO-DOS MENTION" in out), (0, True))
code, out = j("todos", "search")
check("a search with no term is refused", code != 0, True)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
