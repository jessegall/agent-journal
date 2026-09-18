#!/usr/bin/env python3
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
# A PHASE IS NAMED, NOT EXPLAINED (rule 13): its title and its --when are refused past 80 characters or
# with a colon; the explanation is its brief, read when the phase is opened
code, out = j("plans", "phase", "2", "the viewer: everything the plan page shows about a plan")
check("a phase title that explains itself is refused", (code, "phase title" in out and "colon" in out), (1, True))
code, out = j("plans", "phase", "2", "the viewer", "--when=complete when every page the plan touches — the list, the page, the bar, the card, the inspector — reads the same record")
check("and so is a --when past the limit", (code, "at most 80" in out), (1, True))
code, out = j("plans", "phase", "2", "briefed", "--brief", stdin="what this phase is for, at length\n")
check("a phase takes a brief", (code, show(2)["phases"][-1]["body"]), (0, "what this phase is for, at length"))
code, out = j("plans", "show", "2")
check("plans show prints it under the phase", "what this phase is for, at length" in out, True)
j("plans", "rephrase", "2", "2", "--brief", stdin="reworded\n")
check("rephrase replaces it", show(2)["phases"][-1]["body"], "reworded")
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
check("a finished plan stays listed until the user acknowledges it; the abandoned one is hidden",
      ("(done)" in out, "again" in out), (True, False))
plans.acknowledge(root, 1, AT, source="web", track="default")   # the user's word, from the viewer
code, out = j("plans")
check("acknowledged, it is history: the list hides done and abandoned plans", ("No plans yet." in out), True)
code, out = j("plans", "--all")
check("and --all shows them", ("ship plans (done)" in out, "another (abandoned)" in out), (True, True))
code, out = j("plans", "show", "1")
check("show draws the phases with their to-dos",
      ("✓ 1  the core — complete when the CLI works" in out, "[x] to-do 1  storage" in out, "(checkpoint)" in out), (True, True, True))
check("only a checkpoint phase is marked as one", ("the CLI works  (checkpoint)" in out, "the viewer  (checkpoint)" in out), (False, True))

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
check("with no active plan, a draft's to-dos wait for approval and the rest may be picked", sorted(t["n"] for t in todo.ready(root, "default")), [4, 7, 8])
check("and the hold says the draft waits for the user", "wait until the user approves" in plans.stall(root, "default"), True)
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
# ONE auto switch, the environment's: a plan has none of its own, so the two can never disagree
_saved = plans._all(root, "default")[2]["phases"][0].pop("continued_at")
j("auto-mode", "enable")
check("with auto mode on, a completed checkpoint does not hold the plan",
      (plans.stall(root, "default"), [t["n"] for t in todo.ready(root, "default")]), ("", [6, 7]))
check("the row reports that one switch", show(3)["auto"], True)
j("auto-mode", "disable")
check("with auto mode off the same checkpoint holds again", "it is a checkpoint" in plans.stall(root, "default"), True)
check("and the row reports it off", show(3)["auto"], False)
_items = plans._all(root, "default"); _items[2]["phases"][0]["continued_at"] = _saved; plans._put(root, _items, "default")
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

# ---------------------------------------------------------------- a row moves between phases in one command
j("todos", "add", "a row written into the wrong phase")
_wrong = [t["n"] for t in __import__("todo")._all(root, "default") if t["title"] == "a row written into the wrong phase"][0]
j("plans", "add", "a plan to reorder", "--goal=the rows sit where they belong", "--brief", stdin="phases")
_pn = len(plans._all(root, "default"))
j("plans", "phase", str(_pn), "first")
j("plans", "phase", str(_pn), "second")
j("plans", "todos", str(_pn), "2", str(_wrong))
code, out = j("plans", "todos", str(_pn), "1", str(_wrong))
check("a to-do already in another phase is refused, and the refusal names the one command that moves it",
      (code, "already in plan" in out, f"todos {_pn} 1 {_wrong} --move" in out), (1, True, True))
code, out = j("plans", "todos", str(_pn), "1", str(_wrong), "--move")
check("--move takes it out of the phase it was in and puts it here, in one command",
      (code, "moved here from phase 2" in out), (0, True))
check("and it sits in exactly one phase",
      [ph["todos"] for ph in plans._all(root, "default")[_pn - 1]["phases"]], [[_wrong], []])

# ---------------------------------------------------------------- a phase that cannot be worked does not wedge the list
import todo as _todo  # noqa: E402
j("todos", "add", "the stuck row")
j("todos", "add", "the row in the next phase")
_stuck = [t["n"] for t in _todo._all(root, "default") if t["title"] == "the stuck row"][0]
_next_row = [t["n"] for t in _todo._all(root, "default") if t["title"] == "the row in the next phase"][0]
j("plans", "add", "a plan that must not wedge", "--goal=auto always has something to pick", "--brief", stdin="phases")
_wn = len(plans._all(root, "default"))
j("plans", "phase", str(_wn), "the phase that gets stuck")
j("plans", "phase", str(_wn), "the phase after it")
j("plans", "todos", str(_wn), "1", str(_stuck))
j("plans", "todos", str(_wn), "2", str(_next_row))
_live = plans.active(root, "default")
if _live:
    j("plans", "abandon", str(_live[0]), "finished with it in this suite")
plans.activate(root, _wn, AT, source="web", track="default")
check("with the current phase workable, auto picks from it and not from the phase after",
      [t["n"] for t in _todo.ready(root, "default")][:1], [_stuck])
j("todos", "ask", str(_stuck), "which way round should this go?")
check("when every row in the current phase waits on the user, the next phase is offered rather than nothing",
      [t["n"] for t in _todo.ready(root, "default")][:1], [_next_row])

# ---------------------------------------------------------------- unless a checkpoint gates it
j("auto-mode", "disable")
_data = json.loads((root / "environments" / "default" / "plans.json").read_text())
_data["plans"][_wn - 1]["phases"][0]["checkpoint"] = True
(root / "environments" / "default" / "plans.json").write_text(json.dumps(_data))
check("a checkpoint phase still gates what comes after it, stuck or not",
      [t["n"] for t in _todo.ready(root, "default") if t["n"] in (_stuck, _next_row)], [])

# ─────────────── a finished plan waits to be acknowledged, and only the user does it ───────────────
_ad = project() if False else None  # the suite's own project is reused; plans live on `default`
j("todos", "add", "the only row of the plan to finish")
_fin_row = [t["n"] for t in _todo._all(root, "default") if t["title"] == "the only row of the plan to finish"][0]
j("plans", "add", "a plan that finishes", "--goal=it ends")
_fn = len(plans._all(root, "default"))
j("plans", "phase", str(_fn), "the only phase")
j("plans", "todos", str(_fn), "1", str(_fin_row))
_live = plans.active(root, "default")
if _live:
    j("plans", "abandon", str(_live[0]), "finished with it in this suite")
plans.activate(root, _fn, AT, source="web", track="default")
took = plans.acknowledge(root, _fn, AT, source="web", track="default")
check("a plan that is not finished cannot be acknowledged",
      (took[0], "not finished" in took[1]), (False, True))
j("todos", "done", str(_fin_row), "landed")
took = plans.acknowledge(root, _fn, AT, source="cli", track="default")
check("and the agent does not acknowledge one either — it is the user's word",
      (took[0], "only the user acknowledges" in took[1]), (False, True))
took = plans.acknowledge(root, _fn, AT, source="web", track="default")
check("the user acknowledges it in the viewer, and it says so",
      (took[0], "is acknowledged" in took[1]), (True, True))
check("the row carries it, so the home can stop showing the card",
      [(p["status"], p["acknowledged"]) for p in [plans.row_response(root, _fn, plans._all(root, "default")[_fn - 1], "default")]],
      [("done", True)])
took = plans.acknowledge(root, _fn, AT, source="web", track="default")
check("acknowledging twice is refused", (took[0], "already acknowledged" in took[1]), (False, True))

# ─────────────── a plan can be parked: it waits, and the slot it held is free ───────────────
j("todos", "add", "the row of the plan that gets parked")
_pk_row = [t["n"] for t in _todo._all(root, "default") if t["title"] == "the row of the plan that gets parked"][0]
j("plans", "add", "a plan to park", "--goal=it waits")
_pk = len(plans._all(root, "default"))
j("plans", "phase", str(_pk), "the only phase")
j("plans", "todos", str(_pk), "1", str(_pk_row))
_live = plans.active(root, "default")
if _live:
    j("plans", "abandon", str(_live[0]), "finished with it in this suite")
code, out = j("plans", "park", str(_pk), "not yet")
check("a plan that is not being worked cannot be parked",
      (code, "only the plan being worked can be parked" in out), (1, True))
plans.activate(root, _pk, AT, source="web", track="default")
check("the parked plan's row is offered while it is active",
      str(_pk_row) in [str(t["n"]) for t in _todo.ready(root, "default")], True)
code, out = j("plans", "park", str(_pk))
check("parking says why, or it is refused", (code, "wants why it is set aside" in out), (1, True))
code, out = j("plans", "park", str(_pk), "waiting on the design review")
check("a plan is parked with its reason, and says what picks it up again",
      (code, "is parked: waiting on the design review" in out, "activate" in out), (0, True, True))
check("it is no longer the active plan, so the slot is free",
      (plans.active(root, "default"), plans.row_response(root, _pk, plans._all(root, "default")[_pk - 1], "default")["status"]),
      (None, "parked"))
check("and its to-dos stop being offered, with nothing to remember",
      str(_pk_row) in [str(t["n"]) for t in _todo.ready(root, "default")], False)
check("and the quiet list says which parked plan is the reason",
      ("plan " + str(_pk) + " is parked" in plans.stall(root, "default"),
       "waiting on the design review" in plans.stall(root, "default")), (True, True))
check("the row carries why it waits", 
      plans.row_response(root, _pk, plans._all(root, "default")[_pk - 1], "default")["parked_why"],
      "waiting on the design review")
took = plans.activate(root, _pk, AT, source="web", track="default")
check("activating a parked plan resumes it where it was, and clears the reason",
      (took[0], "active again" in took[1],
       plans.row_response(root, _pk, plans._all(root, "default")[_pk - 1], "default")["parked_why"]),
      (True, True, ""))

# ─────────── a plan the agent is writing says so, and cannot be approved yet ───────────
took = plans.add(root, "a plan being written", "it is not finished", "", AT, preparing=True, track="default")
_wn = len(plans._all(root, "default"))
check("a plan created while shaping it starts as being written, not as a draft",
      plans.row_response(root, _wn, plans._all(root, "default")[_wn - 1], "default")["status"], "preparing")
j("plans", "phase", str(_wn), "the only phase")
_wr = [t["n"] for t in _todo._all(root, "default") if t["title"] == "the row of the plan that gets parked"][0]
took = plans.activate(root, _wn, AT, source="web", track="default")
check("it cannot be approved while it is still being written",
      (took[0], "is being written" in took[1]), (False, True))
# BOTH GATES (question 41): the agent cannot declare a plan finished while a phase is still empty,
# so a plan being filled in never reaches the draft state the Start button belongs to.
took = plans.ready(root, _wn, AT, track="default")
check("it cannot be declared ready while a phase has no to-dos, and the refusal names the phase",
      (took[0], "not finished being written" in took[1], "the only phase" in took[1]), (False, True, True))
j("todos", "add", "the row that fills the only phase")
j("plans", "todos", str(_wn), "1", str(len(_todo._all(root, "default"))))
took = plans.ready(root, _wn, AT, track="default")
check("the agent says when it is finished, and then it is a draft",
      (took[0], "ready for the user to approve" in took[1],
       plans.row_response(root, _wn, plans._all(root, "default")[_wn - 1], "default")["status"]),
      (True, True, "draft"))
took = plans.ready(root, _wn, AT, track="default")
check("saying it twice is refused", (took[0], "not one being written" in took[1]), (False, True))

# ─────────── a plan whose current phase is all held says so, instead of "nothing to pick up" ───────────
# Reported from another project against 1.141.0: `journal next` folded the plan's only row into a generic
# tally and never named the plan, so an agent read "nothing to pick up" as settled and stopped.
_sn = len(plans._all(root, "default")) + 1
j("todos", "add", "the row that holds the stalled plan")
_srow = len(_todo._all(root, "default"))
took = plans.add(root, "A plan that stalls", "its phase is all held", "", AT, track="default")
j("plans", "phase", str(_sn), "The held phase")
j("plans", "todos", str(_sn), "1", str(_srow))
# one plan runs at a time: whichever plan this suite left active steps aside so this one can be it
_was_active = plans.active(root, "default")
if _was_active:
    plans.park(root, _was_active[0], "making room for the stall check", AT, source="web", track="default")
check("the stalling plan is the active one", plans.activate(root, _sn, AT, source="web", track="default")[0], True)
check("the plan is not stalled while its row can be started", plans.stall(root, "default"), "")
j("todos", "block", str(_srow), "the rig batch has to run first")
_said = plans.stall(root, "default")
check("with every row held, the stall names the plan, the phase, the count, the row and its condition",
      (f"plan {_sn} cannot advance" in _said, "its one to-do" in _said, "The held phase" in _said,
       f"to-do {_srow} is set aside" in _said, "the rig batch has to run first" in _said),
      (True, True, True, True, True))
j("todos", "unblock", str(_srow))
check("and it stops saying so the moment something can be started", plans.stall(root, "default"), "")

# ─────────── the confirmation says the state it stored ───────────
# `plans add --preparing` announced "(draft)" while storing `preparing` — wrong at the one moment the
# writer reads it. At the tail, where one more plan shifts no other check's numbering.
code, out = j("plans", "add", "a plan being shaped", "--goal=to be decided with the user", "--preparing")
check("a plan being written says so, and says what makes it approvable",
      (code, "(preparing)" in out, "plans ready" in out, "(draft)" in out), (0, True, True, False))
code, out = j("plans", "add", "an ordinary draft", "--goal=it is ready to be approved")
check("and an ordinary one still reads as a draft", (code, "(draft)" in out, "plans ready" in out), (0, True, False))

# ─────────── a plan's title, goal and approach can be corrected ───────────
# The goal is the one line a plan is judged against, and it was frozen at creation — while the way a plan
# is written makes it provisional on purpose: shape it WITH the user, and the viewer opens one as
# `preparing` with a placeholder. The user asked for the verb before rebuilding a plan to fix its goal.
code, out = j("plans", "add", "a plan to correct", "--goal=the first goal")
_en = len(plans._all(root, "default"))
code, out = j("plans", "edit", str(_en), "--goal=the corrected goal")
check("a plan's goal can be corrected", (code, "goal — the corrected goal" in out), (0, True))
check("and it is what the plan now carries",
      plans.row_response(root, _en, plans._all(root, "default")[_en - 1], "default")["goal"], "the corrected goal")
code, out = j("plans", "edit", str(_en), "renamed in place")
check("its title too", (code, "titled renamed in place" in out), (0, True))
code, out = j("plans", "edit", str(_en))
check("nothing to change is refused, naming what it takes", (code, "nothing to change" in out, "--goal=" in out), (1, True, True))
code, out = j("plans", "edit", str(_en), "--goal=   ")
check("an empty goal is refused", (code, "needs its goal" in out), (1, True))
code, out = j("plans", "edit", "99", "--goal=x")
check("a plan that does not exist is refused", (code, "no plan 99" in out), (1, True))
j("plans", "abandon", str(_en), "done with the check")
code, out = j("plans", "edit", str(_en), "--goal=too late")
check("and a closed plan takes no more changes", (code, "takes no more changes" in out), (1, True))

# ------------------------------------------------- a plan links the transcript it came out of
# "The transcript should be a file that is created and linked to the to-do list item or to the plan."
# A transcript is neither a doc nor a report, so it is a third kind of ref -- and it is checked, so a
# plan can never cite a transcript that is not there.
j("messages", "add", "Jesse: the loader double-fetches. Sam: fix it this week.", "--kind=transcript")
_tr = len(__import__("inbox")._all(root, "default"))
j("messages", "add", "an ordinary message carrying no transcript")
_plain_msg = len(__import__("inbox")._all(root, "default"))
code, out = j("plans", "add", "Fix the loader", "--goal=the loader fetches once")
_ln = len(plans._all(root, "default"))
code, out = j("plans", "link", str(_ln), f"transcript {_tr}")
check("a plan can link a transcript", (code, f"links transcript {_tr}" in out), (0, True))
check("and it is kept as a ref of its own kind",
      plans._all(root, "default")[_ln - 1]["refs"], [f"transcript {_tr}"])
code, out = j("plans", "link", str(_ln), f"transcript {_plain_msg}")
check("a message carrying no transcript is refused", (code, "carries no transcript" in out), (1, True))
code, out = j("plans", "link", str(_ln), "transcript 999")
check("and so is one that does not exist", (code, "carries no transcript" in out), (1, True))
code, out = j("plans", "link", str(_ln), f"transcript {_tr}")
check("linking the same transcript twice is refused", (code, "already links" in out), (1, True))
code, out = j("plans", "link", str(_ln), "transcript 4.2")
check("only a doc has parts, so a dotted transcript is not a ref", code, 1)

# ------------------------------------------------- a phase can go in the MIDDLE, not only at the end
# its own plan, at the end of the file: an extra phase in a fixture above shifts every count below it
code, out = j("plans", "add", "a plan written out of order", "--goal=its phases end up in the right order",
              "--brief", stdin="x")
_pn = int(re.search(r"plan (\d+)", out).group(1))
j("plans", "phase", str(_pn), "first")
j("plans", "phase", str(_pn), "third", "--checkpoint")
code, out = j("todos", "add", "a row of the third phase")
_row = int(re.search(r"to-do (\d+)", out).group(1))
j("plans", "todos", str(_pn), "2", str(_row))
code, out = j("plans", "phase", str(_pn), "second", "--when=it is understood", "--before=2")
check("a phase can be inserted before another, and says the rest moved along",
      (code, f"plan {_pn} phase 2: second" in out, "moved along" in out), (0, True, True))
check("--before that names no phase is refused, saying how many there are",
      j("plans", "phase", str(_pn), "nowhere", "--before=9")[1].strip().endswith("it has 3"), True)
check("the phases read in the order they were written into",
      [ph["title"] for ph in plans._all(root, "default")[_pn - 1]["phases"]], ["first", "second", "third"])
check("the to-do travelled with the phase that moved, so nothing is renumbered by hand",
      plans.membership(root, "default").get(_row), (_pn, 3))
check("and the checkpoint travelled with it",
      [bool(ph.get("checkpoint")) for ph in plans._all(root, "default")[_pn - 1]["phases"]], [False, False, True])

# ------------------------------------------- a phase can be corrected after it is written
# its own plan at the END of the file: a phase added to a fixture above shifts every count below it
code, out = j("plans", "add", "a plan written in a hurry", "--goal=it is corrected later", "--brief", stdin="x")
_rn = int(re.search(r"plan (\d+)", out).group(1))
j("plans", "phase", str(_rn), "frist")
j("plans", "phase", str(_rn), "second", "--checkpoint")
check("nothing to change is refused, and says what can be changed",
      (j("plans", "rephrase", str(_rn), "1")[0], "say what to change" in j("plans", "rephrase", str(_rn), "1")[1]),
      (1, True))
check("a phase that is not there is refused", j("plans", "rephrase", str(_rn), "9", "x")[0], 1)
code, out = j("plans", "rephrase", str(_rn), "1", "first", "--when=the spelling is right")
check("a phase's title and its condition can be corrected",
      (code, "phase 1: first" in out, "complete when the spelling is right" in out), (0, True, True))
check("and the correction is what the plan reads back",
      [(p["title"], p["when"]) for p in plans._all(root, "default")[_rn - 1]["phases"]][0],
      ("first", "the spelling is right"))
code, out = j("plans", "rephrase", str(_rn), "2", "--no-checkpoint")
check("a checkpoint can be taken off, and it SAYS it is no longer one",
      (code, "no longer a checkpoint" in out), (0, True))
check("the phase is not a checkpoint any more",
      bool(plans._all(root, "default")[_rn - 1]["phases"][1].get("checkpoint")), False)
code, out = j("plans", "rephrase", str(_rn), "2", "--checkpoint")
check("and it can be put back on", (code, "it is a checkpoint" in out), (0, True))

# ------------------------------------------------- a phase is an area of work, not a slot in the week
# Nothing in "Tuesday" says what is true when the phase is done, which is the one question a phase has
# to be able to answer.
_made = j("plans", "add", "a plan to hang phases on", "--goal=the phases are named for what they hold",
          "--brief", stdin="the approach\n")[1]
_n = re.search(r"plan (\d+)", _made).group(1)
_when = j("plans", "phase", _n, "Tuesday", "--when=the day ends")
check("a phase titled as a date is refused, and says what to name instead",
      (_when[0], "says WHEN, not WHAT" in _when[1]), (1, True))
_ok = j("plans", "phase", _n, "the loader and its tests", "--when=the double fetch is gone")
check("and one that names an area of work is taken", (_ok[0], _ok[1][:40]), (0, _ok[1][:40]))

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
