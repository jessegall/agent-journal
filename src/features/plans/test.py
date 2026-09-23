import pytest

from features.plans.controller import Plans  # noqa: E402
from controllers.types import Agents, Todos, Works
from engine.record import Record
from features.work_tracking.next import next, ready
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh, refused
from tests.kit import idle


@pytest.fixture(scope="module")
def env(tmp_path_factory):
    root = tmp_path_factory.mktemp("advance") / ".journal"
    record = Record(root, "t")
    todos = Todos(record, actor=USER)
    rows = [todos.create(t).n for t in ("one", "two", "three", "four", "five")]
    by_agent = Plans(record, actor=AGENT)
    by_user = Plans(record, actor=USER)
    return record, todos, rows, by_agent, by_user


def test_writing_a_plan_lays_out_phases_and_advances_through_them_to_done(env):
    record, todos, rows, by_agent, by_user = env
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
    assert refused(lambda: by_agent.ready(plan.n)) == "plan 1 cannot be ready: phase 1 has no to-dos", "ready refuses while a phase is empty"
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
    assert refused(lambda: by_agent.start(second.n)) == "one plan is active at a time on an environment", "one plan at a time"

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


def test_a_plan_started_with_its_rows_already_closed_completes_itself(env):
    record, todos, rows, by_agent, by_user = env
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
