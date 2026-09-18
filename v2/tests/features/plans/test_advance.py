import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[4]))
from v2 import features  # noqa: E402
from v2.controllers.types import CONTROLLERS  # noqa: E402
from v2.features.todos.next import next  # noqa: E402
from v2.resources.base import AGENT, SYSTEM, USER  # noqa: E402
from v2.tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()


def refused(fn):
    try:
        fn()
        return ""
    except Exception as e:
        return str(e)


record = fresh()
todos = CONTROLLERS["todo"](record, actor=USER)
rows = [todos.create(t).n for t in ("one", "two", "three", "four", "five")]
by_agent = CONTROLLERS["plan"](record, actor=AGENT)
by_user = CONTROLLERS["plan"](record, actor=USER)

# WRITING ONE: phases in order, --before in the middle, rows in one phase each
plan = by_agent.create("Port everything", goal="it all runs on v2")
check("a new plan is a draft with no phases", (plan.data["status"], plan.data["phases"]), ("draft", []))
by_agent.phase(plan.n, "First", when="the first is done")
by_agent.phase(plan.n, "Third", when="the third is done", checkpoint=True)
by_agent.phase(plan.n, "Second", when="the second is done", before=2)
check("a phase before another goes in the middle", [p["title"] for p in by_agent.phases(plan.n)], ["First", "Second", "Third"])
by_agent.rephrase(plan.n, 2, title="Second, reworded", checkpoint=True)
check("rephrase changes what it is given", (by_agent.phases(plan.n)[1]["title"], by_agent.phases(plan.n)[1]["checkpoint"]), ("Second, reworded", True))
check("a phase title past 80 characters is refused", "80" in refused(lambda: by_agent.phase(plan.n, "x" * 81)), True)
check("ready refuses while a phase is empty", refused(lambda: by_agent.ready(plan.n)), "plan 1 cannot be ready: phase 1 has no to-dos")
by_agent.place(plan.n, 1, rows[0], rows[1])
by_agent.place(plan.n, 2, rows[2])
by_agent.place(plan.n, 3, rows[3], rows[4])
check("rows sit in their phases and the plan links them", ([p["todos"] for p in by_agent.phases(plan.n)], by_agent.load(plan.n).refs), ([[1, 2], [3], [4, 5]], ["todo:1", "todo:2", "todo:3", "todo:4", "todo:5"]))
check("a row in another phase is refused without --move", refused(lambda: by_agent.place(plan.n, 2, rows[0])), "todo 1 already sits in phase 1 of plan 1; --move takes it out of there")
by_agent.place(plan.n, 2, rows[0], move=True)
by_agent.place(plan.n, 1, rows[0], move=True)
check("--move carries it", [p["todos"] for p in by_agent.phases(plan.n)], [[2, 1], [3], [4, 5]])
by_agent.ready(plan.n)
check("every phase filled: ready", by_agent.load(plan.n).data["status"], "ready")

# WHO DOES WHAT: only the user activates and continues
check("the agent cannot activate", refused(lambda: by_agent.activate(plan.n)), "only the user can activate a plan: they do it in the viewer")
check("a draft holds its rows: next skips them", next(record), None)
by_user.activate(plan.n)
check("active: rows of the current phase are ready, in order; the others wait", [t.n for t in __import__("v2.features.todos.next", fromlist=["ready"]).ready(record)], [1, 2])
second = by_agent.create("Another")
check("one plan at a time", refused(lambda: by_user.activate(second.n)), "one plan is active at a time on an environment")

# ADVANCING BY LISTENING: a phase completes when its rows do; a checkpoint waits; the user continues; the last phase ends it
todos.complete(1, "done")
check("one row done: the phase is not complete", by_agent.load(plan.n).data["current"], 1)
todos.complete(2, "done")
check("every row done: the next phase is current, by the feature, as SYSTEM", (by_agent.load(plan.n).data["current"], record.events()[-1].actor, record.events()[-1].data), (2, SYSTEM, {"phase": 1, "complete": True, "status": "active"}))
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

# ABANDON: a close with a reason; the rows stay open
other = by_agent.create("Abandoned one")
by_agent.phase(other.n, "Only")
row = todos.create("still open").n
by_agent.place(other.n, 1, row)
by_agent.abandon(other.n, "no longer wanted")
check("abandoned, with the why, and the row stays open", (by_agent.load(other.n).data["status"], record.events()[-1].data["why"], todos.load(row).completed), ("abandoned", "no longer wanted", 0.0))

# THE WORDS: place answers to todos, resume to continue
check("the type's own words", (by_agent.named("place"), by_agent.named("resume"), by_agent.named("complete")), ("todos", "continue", "acknowledge"))
check("continue resolves to resume", by_user.method("continue").__name__, "resume")

done()
