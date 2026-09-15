#!/usr/bin/env python3
"""reports.py: file a report for the user, list, read, archive; never a doc."""
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


def j(*a, stdin=""):
    return P.cli(*a, stdin=stdin)


def stored():
    f = d / ".journal" / "environments" / "default" / "reports.json"
    return json.loads(f.read_text())["reports"] if f.is_file() else []


j("todos", "add", "check the flaky test")

code, out = j("reports", "add", "the flaky test", "--about=todo 1", "--brief", stdin="It fails one run in ten: a race in the watcher.\n")
check("a report is filed for a to-do", (code, "report 1: the flaky test — for to-do 1" in out), (0, True))
check("stored on this environment's own file", [(r["title"], r["about"]) for r in stored()], [("the flaky test", "todo:1")])
code, out = j("reports", "add", "no text", "--brief", stdin="")
check("a report needs its text", code, 1)
code, out = j("reports", "add", "bad link", "--about=pin 3", "--brief", stdin="x")
check("a report answers a to-do or a question, nothing else", code, 1)
code, out = j("reports", "add", "no such to-do", "--about=todo 9", "--brief", stdin="x")
check("a to-do that is not there is refused", code, 1)

code, out = j("reports")
check("the list shows it, and what it is for", ("the flaky test" in out, "for to-do 1" in out), (True, True))
code, out = j("reports", "show", "1")
check("show prints the text", ("a race in the watcher" in out, "REPORT 1" in out), (True, True))
check("a report is not a doc", "the flaky test" in j("docs", "--all")[1], False)

code, out = j("reports", "archive", "1")
check("archive wants a reason", code, 1)
code, out = j("reports", "archive", "1", "fixed since")
check("archived with its reason", (code, "is archived" in out), (0, True))
check("off the list", "the flaky test" in j("reports")[1], False)
check("--all still lists it", "the flaky test" in j("reports", "--all")[1], True)
check("twice is refused", j("reports", "archive", "1", "again")[0], 1)

# ------------------------------------------------------------------ a report older than the setting is archived
j("reports", "add", "an old measurement", "--brief", stdin="numbers from last month\n")
f = d / ".journal" / "environments" / "default" / "reports.json"
data = json.loads(f.read_text())
from datetime import datetime, timedelta, timezone
data["reports"][-1]["at"] = (datetime.now(timezone.utc) - timedelta(days=10)).isoformat(timespec="seconds")
f.write_text(json.dumps(data))
code, out = j("reports")
check("by default a report older than 7 days is off the list", ("an old measurement" in out, "1 archived" in out or "2 archived" in out), (False, True))
check("--all lists it, saying why", ("an old measurement" in j("reports", "--all")[1], "older than 7 day(s)" in j("reports", "--all")[1]), (True, True))
code, out = j("reports", "keep", "0")
check("keep 0 keeps reports listed", (code, "until archived by hand" in out, "an old measurement" in j("reports")[1]), (0, True, True))
code, out = j("reports", "keep", "7")
check("keep 7 sets a week", (code, "for 7 day(s)" in out, "an old measurement" in j("reports")[1]), (0, True, False))

# ------------------------------------------------------------------ a report turned into a document is kept
code, out = j("reports", "add", "worth keeping", "--brief", stdin="The finding that matters.\nMore detail.\n")
_keep = len(json.loads(f.read_text())["reports"])
code, out = j("reports", "doc", str(_keep))
check("a report is turned into a doc", (code, "is now doc" in out), (0, True))
check("the doc holds the report's title and text", ("worth keeping" in j("docs", "--all")[1],), (True,))
check("the report is archived, pointing at the doc", ("worth keeping" in j("reports")[1], "turned into doc" in j("reports", "--all")[1]), (False, True))
check("twice is refused", j("reports", "doc", str(_keep))[0], 1)

# ------------------------------------------------------------------ after 30 days a report is removed for good
j("reports", "add", "an ancient note", "--brief", stdin="from long ago\n")
data = json.loads(f.read_text())
_ancient = len(data["reports"])
data["reports"][-1]["at"] = "2020-01-01T00:00:00+00:00"
f.write_text(json.dumps(data))
code, out = j("reports", "--all")
check("a report older than 30 days is gone, even under --all", "an ancient note" in out, False)
kept = json.loads(f.read_text())["reports"]
check("its text is removed from the store, and its place is kept so later numbers do not shift",
      (len(kept) == _ancient, "from long ago" in json.dumps(kept), bool(kept[-1].get("removed"))), (True, False, True))

j("todos", "add", "write a report on the slow build")
_n = next(line.split()[0] for line in j("todos")[1].splitlines() if "write a report on the slow build" in line)
code, out = j("todos", "start", _n)
check("starting a to-do that asks for a report reminds the agent how to write one", "journal reports add" in out, True)
j("work", "end", "write a report on the slow build")
code, out = j("todos", "start", "1")
check("a to-do that does not mention a report gets no such reminder", "journal reports add" in out, False)
j("messages", "add", "can you report on what the tests cover")
_m = len(json.loads((d / ".journal" / "environments" / "default" / "inbox.json").read_text())["inbox"])
code, out = j("messages", "show", str(_m))
check("reading a message that asks for a report reminds the agent too", "journal reports add" in out, True)

# ------------------------------------------------------------------ a report that is ready is news on Home
import notifications as _notif  # noqa: E402
import reports as _reports  # noqa: E402
_root = d / ".journal"
code, out = j("reports", "add", "what the flaky test turned out to be", "--brief", stdin="the retry hides a race")
_n = len(stored())
_mine = [x for x in _notif._all(_root, "default") if x.get("about") == f"report:{_n}"]
check("filing a report tells the user it is ready, with the report to open",
      (code, len(_mine), bool(_mine) and "Your report is ready: what the flaky test turned out to be" in _mine[0]["text"],
       bool(_mine) and _mine[0].get("read_at")), (0, 1, True, None))
_before = len(_notif._all(_root, "default"))
_reports.add(_root, "a report the user wrote in the viewer", "their own words", "2026-09-15T10:00:00+00:00",
             source="web", track="default")
check("a report filed from the viewer does not notify the user who wrote it", len(_notif._all(_root, "default")), _before)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
