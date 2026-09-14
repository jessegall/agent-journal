#!/usr/bin/env python3
"""notifications.py: the agent tells the user, sparingly; read and unread."""
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
P = testkit.Project(d)


def j(*a):
    return P.cli(*a)


def stored():
    f = d / ".journal" / "environments" / "default" / "notifications.json"
    return json.loads(f.read_text())["notifications"] if f.is_file() else []


code, out = j("notify", "the migration finished on all 40 tables", "--about=todo 3")
check("notify sends one, pointing at what it is about", (code, "notification 1 is on the user's Home, pointing at to-do 3" in out), (0, True))
check("stored on this environment's own file", [(x["text"], x["about"], x["read_at"]) for x in stored()],
      [("the migration finished on all 40 tables", "todo:3", None)])
check("an empty one is refused", j("notify", " ")[0], 1)
check("a pointer to something it cannot point at is refused", j("notify", "x", "--about=pin 2")[0], 1)
j("notifications", "add", "the report you asked for is ready", "--about=report 1")

code, out = j("notifications")
check("the list shows the unread ones", ("2 unread" in out, "the migration finished" in out, "the report you asked for" in out),
      (True, True, True))
code, out = j("notifications", "read", "1")
check("one is marked read", (code, "is read" in out), (0, True))
check("twice is refused", j("notifications", "read", "1")[0], 1)
code, out = j("notifications")
check("a read one leaves the list", ("1 unread" in out, "the migration finished" in out), (True, False))
check("--all still shows it", "the migration finished" in j("notifications", "--all")[1], True)

code, out = j("notify", "your question was answered", "--about=message 2")
check("a notification can point at a message, so it opens there", code, 0)
import notifications as _n  # noqa: E402
check("stored as the message it opens", _n._all(d / ".journal", "default")[-1]["about"], "inbox:2")

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
