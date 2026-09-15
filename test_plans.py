#!/usr/bin/env python3
"""plans.py: a plan is ordered phases of to-dos; a phase is complete when its to-dos are done."""
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
root = d / ".journal"
sys.path.insert(0, str(root))
import plans  # noqa: E402

AT = "2026-09-15T12:00:00+00:00"


def j(*a, stdin=""):
    return P.cli(*a, stdin=stdin)


def show(n):
    return plans.row_response(root, n, plans._all(root, "default")[n - 1], "default", full=True)


for title in ("storage", "commands", "viewer", "skills"):
    j("todos", "add", title)

code, out = j("plans", "add", "ship plans", "--brief", stdin="phases of to-dos")
check("a plan needs its goal", (code, "needs its goal" in out), (1, True))
code, out = j("plans", "add", "ship plans", "--goal=plans work end to end", "--brief", stdin="phases of to-dos\n")
check("a plan is filed as a draft", (code, "plan 1: ship plans (draft)" in out), (0, True))
f = root / "environments" / "default" / "plans.json"
check("stored on this environment's own file", f.is_file() and json.loads(f.read_text())["plans"][0]["goal"], "plans work end to end")

code, out = j("plans", "phase", "1", "the core", "--when=the CLI works")
check("a phase is added", (code, "plan 1 phase 1: the core" in out), (0, True))
j("plans", "phase", "1", "the viewer", "--checkpoint")
code, out = j("plans", "todos", "1", "3", "1")
check("a phase that does not exist takes nothing", (code, "has no phase 3" in out), (1, True))
code, out = j("plans", "todos", "1", "1", "9")
check("a to-do that does not exist is refused", (code, "no to-do 9" in out), (1, True))

code, out = j("plans", "activate", "1")
check("an agent cannot activate a plan", (code, "only the user activates" in out), (1, True))
took = plans.activate(root, 1, AT, source="web", track="default")
check("a plan whose first phase is empty cannot start", (took[0], "first phase has no to-dos" in took[1]), (False, True))

code, out = j("plans", "todos", "1", "1", "1", "2")
check("to-dos go into a phase", (code, "to-do(s) 1, 2 added" in out), (0, True))
j("plans", "todos", "1", "2", "3")
code, out = j("plans", "todos", "1", "2", "1")
check("a to-do sits in one phase", (code, "already in plan 1 phase 1" in out), (1, True))
check("membership names each to-do's plan and phase", plans.membership(root, "default"), {1: (1, 1), 2: (1, 1), 3: (1, 2)})

took = plans.activate(root, 1, AT, source="web", track="default")
check("the user activates it", took, (True, "plan 1 is active; phase 1, the core, is current"))
check("phase 1 is current", (show(1)["status"], show(1)["current"]), ("active", 1))
j("plans", "add", "another", "--goal=something else", "--brief", stdin="x")
j("plans", "phase", "2", "only phase")
j("plans", "todos", "2", "1", "4")
took = plans.activate(root, 2, AT, source="web", track="default")
check("one plan is active at a time", (took[0], "plan 1 is already active" in took[1]), (False, True))

j("todos", "done", "1", "stored")
check("a phase with an open to-do is not complete", show(1)["phases"][0]["complete"], False)
j("todos", "done", "2", "commands work")
check("when its to-dos are done the phase is complete and the next is current",
      (show(1)["phases"][0]["complete"], show(1)["current"], show(1)["phases_done"]), (True, 2, 1))
j("plans", "abandon", "2", "folded into plan 1")
code, out = j("plans", "todos", "1", "1", "4")
check("adding to a complete phase asks why", (code, "is complete" in out), (1, True))
code, out = j("plans", "todos", "1", "1", "4", "--off")
check("taking out a to-do that is not there is refused", (code, "is not in plan 1 phase 1" in out), (1, True))
code, out = j("plans", "todos", "1", "1", "4", "--reopen=the storage missed a field")
check("with a reason it reopens the phase, which is current again", (code, show(1)["current"]), (0, 1))
j("plans", "todos", "1", "1", "4", "--off")
check("taking it out completes the phase again", show(1)["current"], 2)

code, out = j("plans", "link", "1", "doc 7")
check("a doc that does not exist is not linked", code, 1)
j("reports", "add", "the research", "--brief", stdin="what was found")
code, out = j("plans", "link", "1", "report 1")
check("a report is linked", (code, show(1)["refs"]), (0, ["report 1"]))
code, out = j("plans", "link", "1", "the wiki")
check("anything else is not a link", (code, "not something a plan links" in out), (1, True))

j("todos", "done", "3", "viewer done")
check("when the last phase completes the plan is done, and nothing is current",
      (show(1)["status"], show(1)["current"]), ("done", None))
code, out = j("plans", "phase", "1", "one more")
check("a done plan takes no more changes", (code, "is done" in out), (1, True))

code, out = j("plans", "abandon", "2", "again")
check("abandoning twice is refused", (code, "already abandoned" in out), (1, True))
code, out = j("plans")
check("the list hides done and abandoned plans", ("No plans yet." in out), True)
code, out = j("plans", "--all")
check("and --all shows them", ("ship plans (done)" in out, "another (abandoned)" in out), (True, True))
code, out = j("plans", "show", "1")
check("show draws the phases with their to-dos",
      ("✓ 1  the core — complete when the CLI works" in out, "[x] to-do 1  storage" in out, "(checkpoint)" in out), (True, True, True))

# ---------------------------------------------------------------- an active plan steers auto mode
import notifications, todo  # noqa: E402,E401
for title in ("phase one work", "phase two work", "an urgent bug", "an idle chore"):
    j("todos", "add", title)
j("todos", "priority", "7", "high")
j("plans", "add", "phased", "--goal=the phases run in order", "--brief", stdin="x")
j("plans", "phase", "3", "first", "--checkpoint")
j("plans", "phase", "3", "second")
j("plans", "phase", "3", "third, broken down later")
j("plans", "todos", "3", "1", "5")
j("plans", "todos", "3", "2", "6")
check("with no active plan, auto may pick any ready to-do", sorted(t["n"] for t in todo.ready(root, "default")), [4, 5, 6, 7, 8])
plans.activate(root, 3, AT, source="web", track="default")
check("with a plan active, auto picks the current phase first, then only urgent to-dos outside any plan",
      [t["n"] for t in todo.ready(root, "default")], [5, 7])
check("the session start names the active plan and its current phase", "PLAN 3 IS ACTIVE here: phased" in todo.carry(root, "default"), True)
j("todos", "done", "5", "phase one landed")
check("a completed phase tells the user once",
      [x["text"] for x in notifications._all(root, "default")].count("Plan 3, phase 1 is complete: first"), 1)
check("after a checkpoint phase auto stops at the plan: only urgent work outside it", [t["n"] for t in todo.ready(root, "default")], [7])
check("and says why", "it is a checkpoint" in plans.stall(root, "default"), True)
code, out = j("plans", "continue", "3")
check("an agent cannot continue past a checkpoint", (code, "only the user continues" in out), (1, True))
check("the user continues it", plans.proceed(root, 3, AT, source="web", track="default")[0], True)
check("then the next phase is picked", [t["n"] for t in todo.ready(root, "default")], [6, 7])
j("todos", "done", "6", "phase two landed")
check("a current phase with no to-dos says to break it down", "has no to-dos" in plans.stall(root, "default"), True)
j("auto-mode", "enable")
code, out = j("next")
check("journal next still offers urgent work outside the plan first", "to-do 7" in out, True)
j("todos", "done", "7", "fixed")
code, out = j("next")
check("and once that is done, says the current phase needs breaking down", "has no to-dos" in out, True)

# ---------------------------------------------------------------- a plan kept in a doc becomes a plan
import re, reports  # noqa: E402,E401
j("docs", "add", "Rollout plan", "--abstract=ship the rollout in phases", "--brief", stdin="the intro")
for title in ("Phase 1: groundwork", "Phase 2: switch over", "Risks"):
    j("docs", "part", "1", title, "--brief", stdin="text")
_cited = []
for title, part in (("lay the groundwork", "1.1"), ("switch the traffic", "1.2"), ("remove the old path", "1.2")):
    code, out = j("todos", "add", title, f"--doc={part}", "--brief", stdin="a brief")
    _cited.append((int(re.search(r"to-do (\d+)", out).group(1)), out))
check("the third open to-do citing one doc says it reads like a plan",
      ("cite doc 1 too" in _cited[1][1], "cite doc 1 too" in _cited[2][1]), (False, True))
code, out = j("plans", "from-doc", "1")
_made = plans._all(root, "default")[-1]
check("a doc's Phase parts become a draft plan's phases, holding the to-dos that cite them",
      (code, _made["status"], [ph["title"] for ph in _made["phases"]], [ph["todos"] for ph in _made["phases"]], _made["refs"]),
      (0, "draft", ["groundwork", "switch over"], [[_cited[0][0]], [_cited[1][0], _cited[2][0]]], ["doc 1"]))
code, out = j("plans", "from-doc", "1")
check("the same doc is not made into a plan twice", (code, "is already plan" in out), (1, True))
code, out = j("plans", "from-doc", "1.3")
_n_made = len(plans._all(root, "default"))
f_rep = root / "environments" / "default" / "reports.json"
_data = json.loads(f_rep.read_text())
_data["reports"][0]["at"] = "2020-01-01T00:00:00+00:00"
f_rep.write_text(json.dumps(_data))
j("plans", "link", str(_n_made), "report 1")
check("a report an unfinished plan links is not removed, however old", (reports.prune(root, "default"), bool(reports._all(root, "default")[0].get("title"))), (0, True))
j("plans", "abandon", str(_n_made), "trying the cleanup")
check("once the plan is abandoned, the old report is removed as usual", reports.prune(root, "default"), 1)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
