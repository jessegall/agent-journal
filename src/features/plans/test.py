import time
from dataclasses import dataclass

import pytest

import features

from features.plans.controller import Plans  # noqa: E402
from features.boards.controller import Boards
from tests.kit import Tickets
from controllers.types import Agents, Nudges, Todos, Works
from engine.record import Record
from features.work_tracking.next import ready
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh, refused
from tests.kit import idle, tick


@dataclass(frozen=True)
class Env:
    record: Record
    todos: Todos
    rows: list
    by_agent: Plans
    by_user: Plans


@pytest.fixture(scope="module")
def env(tmp_path_factory):
    root = tmp_path_factory.mktemp("advance") / ".journal"
    record = Record(root, "t")
    record.features = {"work_tracking.auto": False}
    todos = Todos(record, actor=USER)
    rows = [todos.create(t).n for t in ("one", "two", "three", "four", "five")]
    by_agent = Plans(record, actor=AGENT)
    by_user = Plans(record, actor=USER)
    return Env(record, todos, rows, by_agent, by_user)


def test_writing_a_plan_lays_out_phases_and_advances_through_them_to_done(env):
    record, todos, rows, by_agent, by_user = env.record, env.todos, env.rows, env.by_agent, env.by_user
    plan = by_agent.create("Port everything", goal="it all runs on v2")
    assert (plan.data["status"], plan.data["phases"]) == ("building", []), "a plan the agent creates is building, with no phases"
    assert refused(lambda: by_user.approve(plan.n)) == f"plan {plan.n} is building, not one that can become approved", "still building"
    by_agent.phase(plan.n, "First", when="the first is done")
    by_agent.phase(plan.n, "Third", when="the third is done", checkpoint=True)
    by_agent.phase(plan.n, "Second", when="the second is done", before=2)
    assert refused(lambda: by_agent.phase(plan.n, "Outside", before=-1)) == f"plan {plan.n} has no phase -1"
    assert [p["title"] for p in by_agent.phases(plan.n)] == ["First", "Second", "Third"], "a phase before another goes in the middle"
    by_agent.rephrase(plan.n, 2, title="Second, reworded", checkpoint=True)
    assert refused(lambda: by_agent.rephrase(plan.n, 0, title="Wrong")) == f"plan {plan.n} has no phase 0"
    assert refused(lambda: by_agent.place(plan.n, -1, [rows[0]])) == f"plan {plan.n} has no phase -1"
    assert (by_agent.phases(plan.n)[1]["title"], by_agent.phases(plan.n)[1]["checkpoint"]) == ("Second, reworded", True), \
        "rephrase changes what it is given"
    assert ("80" in refused(lambda: by_agent.phase(plan.n, "x" * 81))) is True, "a phase title past 80 characters is refused"
    assert refused(lambda: by_agent.ready(plan.n)) == "plan 1 cannot be ready: phase 1 has no to-dos or tickets", "ready refuses while a phase is empty"
    by_agent.place(plan.n, 1, [rows[0], rows[1]])
    by_agent.place(plan.n, 2, [rows[2]])
    by_agent.place(plan.n, 3, [rows[3], rows[4]])
    assert ([p["todos"] for p in by_agent.phases(plan.n)], by_agent.load(plan.n).refs) == \
        ([[1, 2], [3], [4, 5]], ["todo:1", "todo:2", "todo:3", "todo:4", "todo:5"]), \
        "rows sit in their phases and the plan links them"
    assert refused(lambda: by_agent.place(plan.n, 2, [rows[0]])) == \
        "todo 1 already sits in phase 1 of plan 1; --move takes it out of there", "a row in another phase is refused without --move"
    by_agent.place(plan.n, 2, [rows[0]], move=True)
    by_agent.place(plan.n, 1, [rows[0]], move=True)
    assert [p["todos"] for p in by_agent.phases(plan.n)] == [[2, 1], [3], [4, 5]], "--move carries it"
    by_agent.ready(plan.n)
    assert by_agent.load(plan.n).data["status"] == "ready", "every phase filled: ready"

    assert refused(lambda: by_agent.approve(plan.n)) == "only the user can approve a plan: they do it in the viewer", "not the agent"
    assert refused(lambda: by_agent.start(plan.n)) == f"plan {plan.n} waits for the user to approve it", "nor start one not approved"
    assert ready(record) == [], "a plan not yet started holds its rows: next skips them"
    from tests.kit import nudges, report
    report(record, "working", "PreToolUse")
    by_agent.review(plan.n)
    from controllers.types import Reports
    review = Reports(record, actor=AGENT).create("what the reviewers found")
    Reports(record, actor=AGENT).link(review.n, plan.ref)
    assert by_agent.load(plan.n).data["status"] == "building", "linking the reviewers' report hands it back for revising"
    assert any(f"the review of plan {plan.n}, Port everything, is in - report {review.n}" in line for line in nudges(record)), "the agent is told when the reviewers' report is in"
    by_agent.ready(plan.n)
    by_agent.review(plan.n)
    assert by_user.approve(plan.n).data["status"] == "approved", "asking for a review never stops you approving the plan"
    Reports(record, actor=AGENT).link(Reports(record, actor=AGENT).create("a late review").n, plan.ref)
    assert by_agent.load(plan.n).data["status"] == "approved", "a report that lands after you approved leaves your decision standing"
    by_agent.start(plan.n)
    assert [t.n for t in ready(record)] == [1, 2], "active: rows of the current phase are ready, in order; the others wait"
    assert refused(lambda: Works(record, actor=AGENT).create("a quick fix")).startswith("a plan is active"), "free work waits for the plan"
    assert "is not in the active plan's current phase" in refused(lambda: Works(record, actor=AGENT).create("too early", todo=3)), "a row of a later phase is not started before its phase"
    second = by_agent.create("Another")
    assert refused(lambda: by_agent.start(second.n)) == f"plan {second.n} is building, not one that can become active", "a plan still building cannot start"

    todos.complete(1, "done")
    assert by_agent.load(plan.n).data["current"] == 1, "one row done: the phase is not complete"
    Todos(record, actor=AGENT).complete(2, "done")
    assert (by_agent.load(plan.n).data["current"], [e for e in record.event_log.events() if e.type == "plan"][-1].actor,
            [e for e in record.event_log.events() if e.type == "plan"][-1].data) == \
        (2, SYSTEM, {"phase": 1, "complete": True, "status": "active", "passed": False, "cause": AGENT}), \
        "every row done: the next phase is current, by the feature, as SYSTEM, caused by the agent"
    assert ready(record)[0].n == 3, "next offers the new phase's row"
    todos.complete(3, "done")
    assert (by_agent.load(plan.n).data["status"], by_agent.load(plan.n).data["current"]) == ("waiting", 2), \
        "a checkpoint phase complete: the plan waits, the phase stays current"
    assert ready(record) == [], "waiting: nothing of the plan is offered"
    assert refused(lambda: by_agent.resume(plan.n)) == "only the user can continue a plan: they do it in the viewer", "nor continue"
    by_user.resume(plan.n)
    assert (by_agent.load(plan.n).data["status"], by_agent.load(plan.n).data["current"], ready(record)[0].n) == ("active", 3, 4), \
        "the user continued: the last phase is current"
    for n in (4, 5):
        todos.complete(n, "done")
    finished = by_agent.load(plan.n)
    assert (finished.data["status"], bool(finished.completed), "user" in finished.seen) == ("done", True, False), \
        "the last phase complete: the plan finishes itself and waits, unread, for the user to see it"
    todos.reopen(4, "it was closed by a commit merged in from another ticket")
    reopened = by_agent.load(plan.n)
    assert (reopened.data["status"], reopened.data["current"], bool(reopened.completed)) == ("active", 3, False), \
        "a row of a finished plan reopens: the plan goes back to its phase and runs again"
    todos.start(4)
    work = next(w for w in Works(record, actor=SYSTEM).all() if w.data.get("todo") == 4 and not w.completed)
    Works(record, actor=AGENT).section(work.n, f"1 · {time.strftime('%Y-%m-%d %H:%M')}", "measured the parity")
    Works(record, actor=AGENT).complete(work.n, how="parity holds")
    moments = {(moment["kind"], moment["todo"]) for moment in by_agent.timeline(plan.n)}
    assert {("started", 4), ("log", 4), ("ended", 4), ("done", 5)} <= moments, "a plan's timeline tells when its to-dos were taken up, logged, ended and closed"
    from features.plans.summary import plans_shown
    assert [(entry["title"], entry["status"], entry["phase"], entry["phases"], entry["rows"], entry["done"]) for entry in plans_shown(record)] == \
        [("Port everything", "active", "Third", 3, 5, 4), ("Another", "building", "", 0, 0, 0)], "the viewer's plan list shows each plan with its phase and how many of its rows are done, one still being written included"
    from features.plans.handlers import doable
    from types import SimpleNamespace
    assert doable(record, SimpleNamespace(current_phase=None)) == "", "a plan with no phase in hand has nothing to take next"
    assert doable(record, by_agent.load(plan.n)) == "take to-do 4", "a plan's next step names the to-dos ready to take"
    todos.start(4)
    assert doable(record, by_agent.load(plan.n)) == "go on with to-do 4", "and the ones already in hand"


def test_under_auto_a_checkpoint_is_passed_not_waited_at():
    auto = fresh("auto")
    auto.features = {"work_tracking.auto": True}
    auto_todos = Todos(auto, actor=USER)
    a, b = auto_todos.create("first").n, auto_todos.create("second").n
    quick = Plans(auto, actor=AGENT)
    run = quick.create("Straight through", goal="no stop")
    quick.phase(run.n, "Gate", checkpoint=True)
    quick.phase(run.n, "After")
    quick.place(run.n, 1, [a])
    quick.place(run.n, 2, [b])
    quick.ready(run.n)
    Plans(auto, actor=USER).approve(run.n)
    Plans(auto, actor=USER).start(run.n)
    auto_todos.complete(a, "done")
    assert (quick.load(run.n).data["status"], quick.load(run.n).data["current"], [e for e in auto.event_log.events() if e.type == "plan"][-1].data["passed"]) == \
        ("active", 2, True), "with auto on, a checkpoint phase complete moves straight on, and the event says it was passed"
    auto.features = {"work_tracking.auto": False}
    quick.phase(run.n, "Late gate", checkpoint=True)
    quick.phase(run.n, "Last")
    c, d = auto_todos.create("third").n, auto_todos.create("fourth").n
    quick.place(run.n, 3, [c])
    quick.place(run.n, 4, [d])
    auto_todos.complete(b, "done")
    auto_todos.complete(c, "done")
    assert quick.load(run.n).data["status"] == "waiting", "with auto off the later checkpoint waits"
    auto.features = {"work_tracking.auto": True}
    Agents(auto, actor=AGENT).by_session("claude-1")
    idle(auto)
    tick(auto)
    assert (quick.load(run.n).data["status"], quick.load(run.n).data["current"]) == ("active", 4), \
        "auto switched on while a plan waits: the engine's next clock tick continues it"
    from controllers.types import Environments
    Environments(auto, actor=USER).create("ticket-8", owner="ticket:8")
    steered = Record(auto.root, "ticket-8")
    steered_todos = Todos(steered, actor=USER)
    e, f = steered_todos.create("fifth").n, steered_todos.create("sixth").n
    gated = Plans(steered, actor=AGENT)
    held = gated.create("Ticket plan", goal="reviewed at its gate")
    gated.phase(held.n, "Risky", checkpoint=True)
    gated.phase(held.n, "Rest")
    gated.place(held.n, 1, [e])
    gated.place(held.n, 2, [f])
    gated.ready(held.n)
    Plans(steered, actor=USER).approve(held.n)
    Plans(steered, actor=USER).start(held.n)
    steered_todos.complete(e, "done")
    assert gated.load(held.n).data["status"] == "waiting", \
        "a ticket's environment is always in auto, yet its plan's checkpoint waits for the orchestrator or the user"
    from features.work_tracking.next import ready
    stuck, soon, later = (auto_todos.create(title).n for title in ("waits on the production rollout", "next phase work", "independent work two phases on"))
    blocked_first = quick.create("Blocked first", goal="keeps moving")
    quick.phase(blocked_first.n, "Fix first")
    quick.phase(blocked_first.n, "Then")
    quick.phase(blocked_first.n, "Last")
    quick.place(blocked_first.n, 1, [stuck])
    quick.place(blocked_first.n, 2, [soon])
    quick.place(blocked_first.n, 3, [later])
    quick.ready(blocked_first.n)
    Plans(auto, actor=USER).approve(blocked_first.n)
    Plans(auto, actor=USER).start(blocked_first.n)
    assert {soon, later}.isdisjoint(r.n for r in ready(auto)), "while its phase has work to do, the later phases' rows wait"
    auto_todos.block(stuck, "waits on the production rollout")
    assert {soon, later} <= {r.n for r in ready(auto)} and quick.load(blocked_first.n).data["current"] == 1, \
        "once only blocked rows are left in a phase, every later phase's rows are offered, and the phase stays open until its row closes"


def test_a_plan_started_with_its_rows_already_closed_completes_itself(env, monkeypatch):
    record, todos, rows, by_agent, by_user = env.record, env.todos, env.rows, env.by_agent, env.by_user
    late = by_agent.create("already done", goal="nothing left to do")
    by_agent.phase(late.n, "only phase", when="its row is closed")
    row = todos.create("a row that is already closed")
    by_agent.place(late.n, 1, [row.n])
    by_agent.ready(late.n)
    todos.complete(row.n, "done before the plan ran")
    by_user.start(by_user.approve(late.n).n)
    assert by_agent.load(late.n).data["status"] == "done", "its rows already closed, it completes itself when started"

    saving = Plans.save

    def ran_on(plan_save):
        last = todos.create("its last row")
        walked = by_agent.create(f"walked {plan_save.__name__}", goal="the last row closes it")
        by_agent.phase(walked.n, "only phase", when="its row is closed")
        by_agent.place(walked.n, 1, [last.n])
        by_agent.ready(walked.n)
        by_user.start(by_user.approve(walked.n).n)
        monkeypatch.setattr(Plans, "save", plan_save)
        todos.complete(last.n, "the last row closes")
        Plans(record, actor=SYSTEM)._catch_up()
        monkeypatch.setattr(Plans, "save", saving)
        return by_agent.load(walked.n)

    def reentering(self, r, action, **event):
        saved = saving(self, r, action, **event)
        if event.get("complete"):
            self._catch_up()
        return saved

    def closed_elsewhere(self, r, action, **event):
        saved = saving(self, r, action, **event)
        if event.get("complete") and not self.rows.peek(r.n).completed:
            self.complete(r.n, how="closed by another handler")
        return saved
    assert ran_on(reentering).completed, "a catch-up its own save asks for again runs once, and closes the plan without refusing itself"
    assert ran_on(closed_elsewhere).outcome == "closed by another handler", "a catch-up stops at a plan something else closed while it walked"

    from features.plans.resource import ABANDONED
    from migrations.m0056_plans_with_open_rows import run as reopen_plans
    from migrations.m0065_abandoned_plans_closed import run as close_abandoned
    stale = by_agent.create("done too early", goal="rows are still open")
    by_agent.phase(stale.n, "only phase", when="its row is closed")
    by_agent.place(stale.n, 1, [todos.create("a row still open").n])
    by_agent.ready(stale.n)
    for how in ("closed", "marked"):
        marked = by_agent.load(stale.n)
        marked.status = "done"
        by_agent.save(marked, "updated", status="done")
        if how == "closed":
            by_agent.complete(stale.n, how="finished")
        assert reopen_plans(record.root) == [f"t {stale.ref}"], f"a plan {how} done with an open row is reopened"
        assert (by_agent.load(stale.n).status, by_agent.load(stale.n).completed) == ("active", 0.0), "the reopened plan runs again at its open phase"
    assert reopen_plans(record.root) == [], "a plan that is not done is left alone"
    gone = by_agent.create("given up", goal="never mind")
    given_up = by_agent.load(gone.n)
    given_up.status = ABANDONED
    by_agent.save(given_up, "updated", status=ABANDONED)
    assert close_abandoned(record.root) == [f"t: plan {gone.n} was abandoned, so it is closed"], "an abandoned plan is closed"
    assert close_abandoned(record.root) == [], "a closed plan is not closed twice"


def test_an_agent_building_a_plan_is_told_each_next_step():
    from tests.kit import nudges, report
    record = fresh()
    report(record, "working", "PreToolUse")
    plans = Plans(record, actor="agent")
    n = plans.create("ship it", goal="it is out").n
    plans.phase(n, "build", when="it builds")
    plans.stage(n, "todos")
    plans.place(n, 1, [Todos(record, actor="agent").create("write it").n])
    notified = [t for t in nudges(record) if f"plan {n}" in t]
    assert notified == [f"plan {n} is building - add its phases", f"plan {n} is at its to-dos", f"every phase of plan {n} has its to-dos"], notified
    Plans(record, actor="user").approve(plans.ready(n).n)
    assert nudges(record)[-1] == f"the user approved plan {n}, ship it - start it", "approving tells the agent to start it"
    assert (Plans(record, actor="user").create("a digest").status, nudges(record)[-1]) == ("building", f"the user started plan {n + 1}, a digest - build it with them")


def test_starting_a_plan_parks_the_one_that_runs_and_a_parked_plan_picks_up_where_it_stopped(monkeypatch):
    from tests.kit import nudges, report
    record = fresh()
    report(record, "working", "PreToolUse")
    todos = Todos(record, actor=USER)
    by_agent, by_user = Plans(record, actor=AGENT), Plans(record, actor=USER)

    def approved(title, *rows):
        n = by_agent.create(title).n
        for row in rows:
            by_agent.phase(n, row, when=f"{row} is done")
            by_agent.place(n, len(by_agent.phases(n)), [todos.create(row).n])
        by_agent.ready(n)
        return by_user.approve(n).n

    def status(n):
        return by_agent.load(n).data["status"], by_agent.load(n).data["current"]

    first, second = approved("first", "one", "two"), approved("second", "three")
    by_agent.start(first)
    todos.complete(1, "done")
    by_agent.start(second)
    assert (status(first), status(second)) == (("parked", 2), ("active", 1)), "starting a second plan parks the one that runs"
    shared = todos.create("shared between plans").n
    by_agent.place(first, 2, [shared])
    by_agent.place(second, 1, [shared])
    assert shared in [t.n for t in ready(record)], "the active plan offers a row that also sits in a parked plan"
    by_agent.place(first, 2, [shared], off=True)
    by_agent.place(second, 1, [shared], off=True)
    todos.complete(shared, "checked")
    assert [t.n for t in ready(record)] == [3], "the parked plan's rows wait; the running plan's are offered"
    by_user.park(second)
    assert nudges(record)[-1] == f"the user parked plan {second}, second", "parking tells the agent"
    assert refused(lambda: by_user.park(second)) == f"plan {second} is parked, not one that can become parked", "a parked plan is parked once"
    by_user.start(first)
    assert (status(first), status(second)) == (("active", 2), ("parked", 1)), "a parked plan picks up at the phase it stopped at"
    assert (nudges(record)[-1], [t.n for t in ready(record)]) == (f"the user started plan {first}, first - it is active now", [2]), \
        "and the agent is told to work it"
    from tests.kit import tick
    agents = Agents(record, actor=SYSTEM)

    def quiet(minutes):
        report(record, "idle", "Stop")
        row = agents.by_session("claude-1")
        agents.update(row.n, **{**row.data, "at": time.time() - minutes * 60})
        tick(record)

    quiet(4)
    assert not any("is running and nothing has moved" in n for n in nudges(record)), "four quiet minutes are not yet standing still"
    quiet(6)
    assert f"plan {first}, first, is running and nothing has moved for 6 minutes" in nudges(record), \
        "six quiet minutes with a row it can do tell the agent to carry on with the plan"
    told = [n.brief for n in Nudges(record).all() if "nothing has moved" in n.title][0]
    assert "take to-do 2" in told and "leave it and work the rows you can do" in told, \
        "it names the row to take and says to leave what is stuck and work what it can"
    tick(record)
    assert sum("is running and nothing has moved" in n for n in nudges(record)) == 1, "once per stretch of standing still"
    todos.block(2, "waits on the supplier's price list")
    quiet(6)
    assert "nothing is ready - every open row waits" in nudges(record), \
        "an idle agent whose every row in the phase is blocked is told within minutes to put each blocker to the user"
    asked = lambda: sum(f"plan {first}, first, has blocked to-dos" in n for n in nudges(record))
    tick(record)
    report(record, "working", "PreToolUse")
    assert asked() == 1, "a running plan with a blocked to-do asks whether it still is, and a tool use right after does not ask again"
    later = time.time() + 31 * 60
    monkeypatch.setattr(time, "time", lambda: later)
    report(record, "working", "PreToolUse")
    tick(record)
    assert asked() == 2, "once the minutes are up, a tool use asks again, and the clock right after does not"
    third = approved("third", "four")
    by_user.start(third)
    assert status(first)[0] == "parked", "a plan nobody has delegated is parked when another starts"
    by_user.start(first)
    by_agent.delegate(first)
    fourth = approved("fourth", "five")
    by_user.start(fourth)
    assert (status(first)[0], status(fourth)[0]) == ("active", "active"), "a delegated plan keeps running beside the one started"
    assert by_agent.load(first).delegated, "delegate flags a plan"
    by_agent.delegate(first, off=True)
    assert not by_agent.load(first).delegated, "delegate --off clears the flag"


def test_claude_plan_mode_is_refused_for_a_journal_plan():
    from tests.kit import handle
    from providers import PROVIDERS
    record = fresh()
    text = handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "EnterPlanMode", "tool_input": {}})
    assert "journal plan create" in str(text), text


def test_a_plan_is_built_at_the_depth_the_user_picked():
    from controllers.types import Nudges
    from tests.kit import report
    record = fresh()
    report(record, "working", "PreToolUse")
    plans = Plans(record, actor=USER)
    assert refused(lambda: plans.create("Rollout", depth="deep")) == "a plan's depth is normal or thorough", "only the two depths"
    plans.create("Rollout", depth="thorough")
    told = [n.brief for n in Nudges(record).all() if n.title.startswith("the user started plan")]
    assert "file a to-do for every small thing" in told[-1], "the agent is told to plan every small thing"


def test_a_row_struck_while_its_plan_is_unapproved_leaves_the_plan_and_stays_once_approved():
    from features import load
    load()
    record = fresh()
    todos, by_agent, by_user = Todos(record, actor=AGENT), Plans(record, actor=AGENT), Plans(record, actor=USER)
    building = by_agent.create("still building", goal="rows revised")
    by_agent.phase(building.n, "only phase", when="its rows close")
    kept, dropped = todos.create("kept").n, todos.create("dropped").n
    by_agent.place(building.n, 1, [kept, dropped])
    todos.strike(dropped, "no longer part of it")
    assert by_agent.load(building.n).phases[0]["todos"] == [kept], "a row struck before approval leaves the plan"
    todos.complete(kept, "done early")
    by_agent.ready(building.n)
    todos.reopen(kept, "half of it is still to do")
    assert (by_agent.load(building.n).data["status"], by_agent.load(building.n).data["current"]) == ("ready", 1), \
        "a row reopened before approval leaves the plan waiting for the user's go"
    approved = by_agent.create("approved", goal="rows stay on the record")
    by_agent.phase(approved.n, "only phase", when="its rows close")
    row = todos.create("struck after approval").n
    by_agent.place(approved.n, 1, [row, todos.create("other").n])
    by_agent.ready(approved.n)
    by_user.approve(approved.n)
    todos.strike(row, "dropped later")
    assert row in by_agent.load(approved.n).phases[0]["todos"], "once approved, a struck row stays in its phase"
    given_up = by_agent.create("given up", goal="nothing")
    by_agent.phase(given_up.n, "only phase", when="its rows close")
    both = todos.create("in an abandoned plan and the running one").n
    by_agent.place(given_up.n, 1, [both])
    by_agent.abandon(given_up.n, "given up")
    running = by_agent.create("running", goal="its row starts")
    by_agent.phase(running.n, "only phase", when="its rows close")
    by_agent.place(running.n, 1, [both])
    by_agent.ready(running.n)
    by_user.approve(running.n)
    by_agent.start(running.n)
    assert todos.start(both).status != "", "a row in the running plan's phase starts, even when an abandoned plan also holds it (issue 21)"


def test_a_phase_can_hold_board_tickets_and_moves_on_when_they_close(monkeypatch):
    features.load()
    record = fresh()
    started = []
    monkeypatch.setattr(Tickets, "start", lambda self, n, agent=None: started.append(n))
    monkeypatch.setattr("features.tickets.worker.start_agent_in", lambda record, name, worktree, abstract, owner, prompt, kind: started.append(name))
    board = Boards(record, actor=USER).create("Product")
    tickets = Tickets(record, actor=USER)
    first, second = (tickets.create(title, board=board.n) for title in ("Search", "Share"))
    plans = Plans(record, actor=AGENT)
    plan = plans.create("Launch", goal="it ships")
    plans.phase(plan.n, "Build", when="both built")
    plans.phase(plan.n, "Ship", when="shipped")
    plans.tickets(plan.n, 1, [first.n])
    plans.tickets(plan.n, 2, [second.n])
    plans.ready(plan.n)
    Plans(record, actor=USER).approve(plan.n)
    plans.start(plan.n)
    assert plans.load(plan.n).current == 1 and f"ticket:{first.n}" in plans.load(plan.n).refs, "a phase holds tickets and the plan links them"
    assert started == [f"plan-{plan.n}", first.n], "starting the plan starts its worker agent and the first phase's tickets"
    tickets.complete(first.n, how="merged", yes=True)
    Plans(record, actor=SYSTEM)._catch_up()
    assert plans.load(plan.n).current == 2 and started[-1] == second.n, "once its tickets close, the next phase's tickets start"
    assert "now phase 2, Ship: 0 of 1 done" in plans.progress(plan.n) and f"ticket {second.n} Share" in plans.progress(plan.n), \
        "journal plan progress says where the plan stands, the current phase's rows included"
    from types import SimpleNamespace
    from features.tickets.phases import start_tickets_of_phase
    from resources.base import Refused
    assert start_tickets_of_phase(record, SimpleNamespace(current=9, phases=[])) == [], "a plan past its last phase starts no tickets"
    monkeypatch.setattr(Tickets, "start", lambda self, n: (_ for _ in ()).throw(Refused("no room")))
    third = tickets.create("Print", board=board.n)
    assert start_tickets_of_phase(record, SimpleNamespace(current=1, phases=[{"tickets": [third.n]}], worktree="")) == [], \
        "a ticket that cannot start yet is not counted as started"


def test_a_shared_plan_hands_its_tickets_to_its_own_agent_in_one_worktree(monkeypatch):
    from controllers.types import Environments
    features.load()
    record = fresh()
    handed, launched = [], []

    def start_agent_in(record, name, worktree, abstract, owner, prompt, kind):
        Environments(record, actor=SYSTEM).create(name, owner=owner)
        launched.append(prompt)

    monkeypatch.setattr("features.tickets.worker.start_agent_in", start_agent_in)
    monkeypatch.setattr(Tickets, "tell", lambda self, n, note: handed.append(n))
    monkeypatch.setattr("agents.terminal.detached", lambda *args, **kwargs: launched.append("a ticket agent"))
    board = Boards(record, actor=USER).create("Product")
    tickets = Tickets(record, actor=USER)
    first, second = (tickets.create(title, board=board.n) for title in ("Search", "Share"))
    plans = Plans(record, actor=AGENT)
    plan = plans.create("Redesign", goal="it looks new")
    plans.update(plan.n, worktree="shared")
    plans.phase(plan.n, "Build", when="both built")
    plans.tickets(plan.n, 1, [first.n, second.n])
    plans.ready(plan.n)
    Plans(record, actor=USER).approve(plan.n)
    plans.start(plan.n)
    assert {tickets.load(n).work_environment for n in (first.n, second.n)} == {f"plan-{plan.n}"}, \
        "a shared plan's tickets work in the plan's one environment and worktree"
    assert (handed, "one ticket after another" in launched[0], "a ticket agent" in launched) == ([first.n, second.n], True, False), \
        "the plan's own agent is handed each ticket, and no ticket gets an agent of its own"
    assert plans.load(plan.n).branch, "a shared plan names its one branch"
    from engine.sessions import Sessions
    stopped = []
    monkeypatch.setattr(Tickets, "_merged", lambda self, ticket: True)
    monkeypatch.setattr(Sessions, "holder", lambda self, name: f"session-{name}" if name == f"plan-{plan.n}" else "")
    monkeypatch.setattr("features.tickets.controller.terminal_of", lambda root, session: session)
    monkeypatch.setattr("features.tickets.controller.ask_session", lambda root, terminal: stopped.append(terminal))
    tickets.close_merged()
    assert (all(tickets.load(n).completed for n in (first.n, second.n)), stopped, bool(plans.load(plan.n).merged)) == \
        (True, [f"session-plan-{plan.n}"], True), "once the plan's branch is merged its tickets close together and its agent stops, once"
    from resources.base import Refused
    straggler = tickets.update(tickets.create("Still going", board=board.n).n, work_environment=f"plan-{plan.n}")
    tickets._close_plan_worktree(f"plan-{plan.n}")
    assert stopped == [f"session-plan-{plan.n}"], "a plan's agent is left running while one of its tickets is still open"
    monkeypatch.setattr(Tickets, "tell", lambda self, n, note: (_ for _ in ()).throw(Refused("no agent")))
    assert tickets._hand_to_plan(straggler).queued, "a ticket the plan's agent cannot be told of waits in the queue"
    fifth = approved("fifth", "six")
    by_user.start(fifth)
    by_user.park(fifth)
    by_agent.complete(fifth, how="done by hand")
    assert (by_agent.load(fifth).status, by_agent.load(fifth).completed > 0) == ("done", True), "finishing a parked plan makes it done, not parked"
    stuck = approved("stuck", "seven")
    by_user.start(stuck)
    by_user.park(stuck)
    from migrations.m0077_finished_plans_are_done import run as finished_plans_done
    stale = by_agent.load(stuck)
    stale.completed = time.time()
    by_agent.rows.persist(stale)
    assert finished_plans_done(record.root) == [f"plan {stuck} in {record.env} is finished, so it is done and no longer parked"], \
        "an upgrade marks a finished plan that kept its parked status as done"
    assert by_agent.load(stuck).status == "done", "and it reads done afterwards"
