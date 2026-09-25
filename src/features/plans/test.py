from dataclasses import dataclass

import pytest

import features

from features.plans.controller import Plans  # noqa: E402
from features.boards.controller import Boards
from features.plans.progress import catch_up
from features.tickets.controller import Tickets
from controllers.types import Agents, Todos, Works
from engine.record import Record
from features.work_tracking.next import next, ready
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh, refused
from tests.kit import idle


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
    assert [p["title"] for p in by_agent.phases(plan.n)] == ["First", "Second", "Third"], "a phase before another goes in the middle"
    by_agent.rephrase(plan.n, 2, title="Second, reworded", checkpoint=True)
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
    assert next(record) is None, "a plan not yet started holds its rows: next skips them"
    by_user.approve(plan.n)
    by_agent.start(plan.n)
    assert [t.n for t in ready(record)] == [1, 2], "active: rows of the current phase are ready, in order; the others wait"
    assert refused(lambda: Works(record, actor=AGENT).create("a quick fix")).startswith("a plan is active"), "free work waits for the plan"
    second = by_agent.create("Another")
    assert refused(lambda: by_agent.start(second.n)) == f"plan {second.n} is building, not one that can become active", "a plan still building cannot start"

    todos.complete(1, "done")
    assert by_agent.load(plan.n).data["current"] == 1, "one row done: the phase is not complete"
    Todos(record, actor=AGENT).complete(2, "done")
    assert (by_agent.load(plan.n).data["current"], [e for e in record.events() if e.type == "plan"][-1].actor,
            [e for e in record.events() if e.type == "plan"][-1].data) == \
        (2, SYSTEM, {"phase": 1, "complete": True, "status": "active", "passed": False, "cause": AGENT}), \
        "every row done: the next phase is current, by the feature, as SYSTEM, caused by the agent"
    assert next(record).n == 3, "next offers the new phase's row"
    todos.complete(3, "done")
    assert (by_agent.load(plan.n).data["status"], by_agent.load(plan.n).data["current"]) == ("waiting", 2), \
        "a checkpoint phase complete: the plan waits, the phase stays current"
    assert next(record) is None, "waiting: nothing of the plan is offered"
    assert refused(lambda: by_agent.resume(plan.n)) == "only the user can continue a plan: they do it in the viewer", "nor continue"
    by_user.resume(plan.n)
    assert (by_agent.load(plan.n).data["status"], by_agent.load(plan.n).data["current"], next(record).n) == ("active", 3, 4), \
        "the user continued: the last phase is current"
    for n in (4, 5):
        todos.complete(n, "done")
    finished = by_agent.load(plan.n)
    assert (finished.data["status"], bool(finished.completed), "user" in finished.seen) == ("done", True, False), \
        "the last phase complete: the plan finishes itself and waits, unread, for the user to see it"


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
    assert (quick.load(run.n).data["status"], quick.load(run.n).data["current"], [e for e in auto.events() if e.type == "plan"][-1].data["passed"]) == \
        ("active", 2, True), "with auto on, a checkpoint phase complete moves straight on, and the event says it was passed"
    auto.features = {"auto": False}
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
    assert (quick.load(run.n).data["status"], quick.load(run.n).data["current"]) == ("active", 4), \
        "auto switched on while a plan waits: the next agent activity continues it"
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


def test_a_plan_started_with_its_rows_already_closed_completes_itself(env):
    record, todos, rows, by_agent, by_user = env.record, env.todos, env.rows, env.by_agent, env.by_user
    late = by_agent.create("already done", goal="nothing left to do")
    by_agent.phase(late.n, "only phase", when="its row is closed")
    row = todos.create("a row that is already closed")
    by_agent.place(late.n, 1, [row.n])
    by_agent.ready(late.n)
    todos.complete(row.n, "done before the plan ran")
    by_user.start(by_user.approve(late.n).n)
    assert by_agent.load(late.n).data["status"] == "done", "its rows already closed, it completes itself when started"


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


def test_starting_a_plan_parks_the_one_that_runs_and_a_parked_plan_picks_up_where_it_stopped():
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
    assert [t.n for t in ready(record)] == [3], "the parked plan's rows wait; the running plan's are offered"
    by_user.park(second)
    assert nudges(record)[-1] == f"the user parked plan {second}, second", "parking tells the agent"
    assert refused(lambda: by_user.park(second)) == f"plan {second} is parked, not one that can become parked", "a parked plan is parked once"
    by_user.start(first)
    assert (status(first), status(second)) == (("active", 2), ("parked", 1)), "a parked plan picks up at the phase it stopped at"
    assert (nudges(record)[-1], [t.n for t in ready(record)]) == (f"the user started plan {first}, first - it is active now", [2]), \
        "and the agent is told to work it"


def test_claude_plan_mode_is_refused_for_a_journal_plan():
    from engine.hooks import handle
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
    approved = by_agent.create("approved", goal="rows stay on the record")
    by_agent.phase(approved.n, "only phase", when="its rows close")
    row = todos.create("struck after approval").n
    by_agent.place(approved.n, 1, [row, todos.create("other").n])
    by_agent.ready(approved.n)
    by_user.approve(approved.n)
    todos.strike(row, "dropped later")
    assert row in by_agent.load(approved.n).phases[0]["todos"], "once approved, a struck row stays in its phase"


def test_a_phase_can_hold_board_tickets_and_moves_on_when_they_close(monkeypatch):
    features.load()
    record = fresh()
    started = []
    monkeypatch.setattr(Tickets, "start", lambda self, n, agent=None: started.append(n))
    monkeypatch.setattr("features.plans.worker.start_agent_in", lambda record, name, worktree, abstract, owner, prompt: started.append(name))
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
    catch_up(record)
    assert plans.load(plan.n).current == 2 and started[-1] == second.n, "once its tickets close, the next phase's tickets start"
    assert "now phase 2, Ship: 0 of 1 done" in plans.progress(plan.n) and f"ticket {second.n} Share" in plans.progress(plan.n), \
        "journal plan progress says where the plan stands, the current phase's rows included"


def test_a_shared_plan_hands_its_tickets_to_its_own_agent_in_one_worktree(monkeypatch):
    from controllers.types import Environments
    features.load()
    record = fresh()
    handed, launched = [], []

    def start_agent_in(record, name, worktree, abstract, owner, prompt):
        Environments(record, actor=SYSTEM).create(name, owner=owner)
        launched.append(prompt)

    monkeypatch.setattr("features.plans.worker.start_agent_in", start_agent_in)
    monkeypatch.setattr(Tickets, "tell", lambda self, n, note: handed.append(n))
    monkeypatch.setattr("engine.terminal.detached", lambda *args, **kwargs: launched.append("a ticket agent"))
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
