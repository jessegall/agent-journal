import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Docs, Plans, Todos  # noqa: E402
from features.auto.next import next  # noqa: E402
from resources.base import AGENT, SYSTEM, USER  # noqa: E402
from tests.kit import check, done, fresh, refused  # noqa: E402

features.unload()
features.load()



record = fresh()
todos = Todos(record, actor=USER)
rows = [todos.create(t).n for t in ("one", "two", "three", "four", "five")]
by_agent = Plans(record, actor=AGENT)
by_user = Plans(record, actor=USER)

# WRITING ONE: phases in order, --before in the middle, rows in one phase each
plan = by_agent.create("Port everything", goal="it all runs on v2")
check("a plan the agent creates is building, with no phases", (plan.data["status"], plan.data["phases"]), ("building", []))
check("a plan the user creates is a draft", by_user.create("The user's own").data["status"], "draft")
check("a plan still being built cannot be started", refused(lambda: by_user.activate(plan.n)), f"plan {plan.n} is building, not one that can become active")
by_agent.phase(plan.n, "First", when="the first is done")
by_agent.phase(plan.n, "Third", when="the third is done", checkpoint=True)
by_agent.phase(plan.n, "Second", when="the second is done", before=2)
check("a phase before another goes in the middle", [p["title"] for p in by_agent.phases(plan.n)], ["First", "Second", "Third"])
by_agent.rephrase(plan.n, 2, title="Second, reworded", checkpoint=True)
check("rephrase changes what it is given", (by_agent.phases(plan.n)[1]["title"], by_agent.phases(plan.n)[1]["checkpoint"]), ("Second, reworded", True))
check("a phase title past 80 characters is refused", "80" in refused(lambda: by_agent.phase(plan.n, "x" * 81)), True)
check("ready refuses while a phase is empty", refused(lambda: by_agent.ready(plan.n)), "plan 1 cannot be ready: phase 1 has no to-dos")
by_agent.place(plan.n, 1, [rows[0], rows[1]])
by_agent.place(plan.n, 2, [rows[2]])
by_agent.place(plan.n, 3, [rows[3], rows[4]])
check("rows sit in their phases and the plan links them", ([p["todos"] for p in by_agent.phases(plan.n)], by_agent.load(plan.n).refs), ([[1, 2], [3], [4, 5]], ["todo:1", "todo:2", "todo:3", "todo:4", "todo:5"]))
check("a row in another phase is refused without --move", refused(lambda: by_agent.place(plan.n, 2, [rows[0]])), "todo 1 already sits in phase 1 of plan 1; --move takes it out of there")
by_agent.place(plan.n, 2, [rows[0]], move=True)
by_agent.place(plan.n, 1, [rows[0]], move=True)
check("--move carries it", [p["todos"] for p in by_agent.phases(plan.n)], [[2, 1], [3], [4, 5]])
by_agent.ready(plan.n)
check("every phase filled: ready", by_agent.load(plan.n).data["status"], "ready")

# WHO DOES WHAT: only the user activates and continues
check("the agent cannot activate", refused(lambda: by_agent.activate(plan.n)), "only the user can activate a plan: they do it in the viewer")
check("a plan not yet started holds its rows: next skips them", next(record), None)
by_user.activate(plan.n)
check("active: rows of the current phase are ready, in order; the others wait", [t.n for t in __import__("features.auto.next", fromlist=["ready"]).ready(record)], [1, 2])
second = by_agent.create("Another")
check("one plan at a time", refused(lambda: by_user.activate(second.n)), "one plan is active at a time on an environment")

# ADVANCING BY LISTENING: a phase completes when its rows do; a checkpoint waits; the user continues; the last phase ends it
todos.complete(1, "done")
check("one row done: the phase is not complete", by_agent.load(plan.n).data["current"], 1)
todos.complete(2, "done")
check("every row done: the next phase is current, by the feature, as SYSTEM", (by_agent.load(plan.n).data["current"], [e for e in record.events() if e.type == "plan"][-1].actor, [e for e in record.events() if e.type == "plan"][-1].data), (2, SYSTEM, {"phase": 1, "complete": True, "status": "active", "passed": False}))
check("next offers the new phase's row", next(record).n, 3)
todos.complete(3, "done")
check("a checkpoint phase complete: the plan waits, the phase stays current", (by_agent.load(plan.n).data["status"], by_agent.load(plan.n).data["current"]), ("waiting", 2))
check("waiting: nothing of the plan is offered", next(record), None)
check("the agent cannot continue", refused(lambda: by_agent.resume(plan.n)), "only the user can continue a plan: they do it in the viewer")
by_user.resume(plan.n)
check("the user continued: the last phase is current", (by_agent.load(plan.n).data["status"], by_agent.load(plan.n).data["current"], next(record).n), ("active", 3, 4))
todos.complete(4, "done")
todos.complete(5, "done")
check("the last phase complete: the plan is done", by_agent.load(plan.n).data["status"], "done")
by_user.complete(plan.n, "seen")
check("acknowledge is the user's complete", bool(by_agent.load(plan.n).completed), True)

# UNDER AUTO: a checkpoint is passed, not waited at
auto = fresh("auto")
auto.features = {"auto": True}
auto_todos = Todos(auto, actor=USER)
a, b = auto_todos.create("first").n, auto_todos.create("second").n
quick = Plans(auto, actor=AGENT)
run = quick.create("Straight through", goal="no stop")
quick.phase(run.n, "Gate", checkpoint=True)
quick.phase(run.n, "After")
quick.place(run.n, 1, [a])
quick.place(run.n, 2, [b])
quick.ready(run.n)
Plans(auto, actor=USER).activate(run.n)
auto_todos.complete(a, "done")
check("with auto on, a checkpoint phase complete moves straight on, and the event says it was passed",
      (quick.load(run.n).data["status"], quick.load(run.n).data["current"], [e for e in auto.events() if e.type == "plan"][-1].data["passed"]), ("active", 2, True))
auto.features = {"auto": False}
quick.phase(run.n, "Late gate", checkpoint=True)
quick.phase(run.n, "Last")
c, d = auto_todos.create("third").n, auto_todos.create("fourth").n
quick.place(run.n, 3, [c])
quick.place(run.n, 4, [d])
auto_todos.complete(b, "done")
auto_todos.complete(c, "done")
check("with auto off the later checkpoint waits", quick.load(run.n).data["status"], "waiting")
auto.features = {"auto": True}
from tests.features.kit import idle  # noqa: E402
from controllers.types import Agents  # noqa: E402
Agents(auto, actor=AGENT).by_session("claude-1")
idle(auto)
check("auto switched on while a plan waits: the next agent activity continues it", (quick.load(run.n).data["status"], quick.load(run.n).data["current"]), ("active", 4))
check("the event on an ordinary phase says no checkpoint was passed", [e for e in record.events() if e.type == "plan" and e.data.get("phase") == 1][-1].data["passed"], False)

# ABANDON: a close with a reason; the rows stay open
other = by_agent.create("Abandoned one")
by_agent.phase(other.n, "Only")
row = todos.create("still open").n
by_agent.place(other.n, 1, [row])
by_agent.abandon(other.n, "no longer wanted")
check("abandoned, with the why, and the row stays open", (by_agent.load(other.n).data["status"], [e for e in record.events() if e.type == "plan"][-1].data["why"], todos.load(row).completed), ("abandoned", "no longer wanted", 0.0))

# FROM A DOC: its "Phase …" sections become phases, and the plan links the doc
docs = Docs(record, actor=AGENT)
doc = docs.create("A design", abstract="what is true when done", brief="the approach")
docs.section(doc.n, "Phase 1 — The record", "files first")
docs.section(doc.n, "Notes", "not a phase")
docs.section(doc.n, "Phase 2: The engine", "then the loop")
drafted = by_agent.from_doc(doc.n)
check("from-doc: a plan being built with the doc's phases, goal and link", (drafted.data["status"], [p["title"] for p in drafted.data["phases"]], drafted.data["goal"], drafted.refs),
      ("building", ["The record", "The engine"], "what is true when done", [doc.ref]))

# THE WORDS: place answers to todos, resume to continue
check("the type's own words", (by_agent.named("place"), by_agent.named("resume"), by_agent.named("complete")), ("todos", "continue", "acknowledge"))
check("continue resolves to resume", by_user.method("continue").__name__, "resume")

done()
