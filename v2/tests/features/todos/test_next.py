import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[4]))
from v2 import features  # noqa: E402
from v2.controllers.types import CONTROLLERS  # noqa: E402
from v2.features.todos.next import next, ready  # noqa: E402
from v2.resources.base import AGENT, USER  # noqa: E402
from v2.tests.features.kit import idle, nudges  # noqa: E402
from v2.tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

# THE QUERY: ready rows by priority, then by number
record = fresh()
todos = CONTROLLERS["todo"](record, actor=USER)
a, b, c, d, e = (todos.create(t) for t in ("a", "b", "c", "d", "e"))
check("nothing set: the first row by number", next(record).n, a.n)
todos.set(c.n, "priority", 200)
check("a higher priority comes first", [t.n for t in ready(record)], [c.n, a.n, b.n, d.n, e.n])
todos.set(c.n, "blocked", "the release is not cut")
check("a blocked row is skipped", next(record).n, a.n)
todos.link(a.n, b.ref)
check("a row waiting on an open row is skipped", next(record).n, b.n)
todos.complete(b.n, "done")
check("its prerequisite closed, the row is ready again", next(record).n, a.n)
CONTROLLERS["question"](record, actor=AGENT).create("which way", about=a.ref).n
CONTROLLERS["question"](record, actor=AGENT).link(1, a.ref)
check("a row with an open question waits on the user", next(record).n, d.n)
CONTROLLERS["question"](record, actor=USER).complete(1, "this way")
check("answered: the row is ready", next(record).n, a.n)
for t in ready(record):
    todos.complete(t.n, "done")
check("nothing ready: nothing", next(record), None)

# THE NUDGE: on idle, with auto on and nothing open, the next row is offered
record = fresh()
todos = CONTROLLERS["todo"](record, actor=USER)
todos.create("first")
todos.create("second")
idle(record)
check("auto off: nothing offered", nudges(record), [])
record.set_setting("auto", True)
idle(record)
check("auto on: the next row is offered once per idle stretch", nudges(record), ["todo 1 next"])
work = CONTROLLERS["work"](record, actor=AGENT).create("on it", todo=1)
idle(record)
check("work open: nothing offered; the work feature speaks instead", nudges(record), ["todo 1 next", "work 1 open"])
CONTROLLERS["work"](record, actor=AGENT).complete(work.n, "done", todo=True)
idle(record)
check("the row closed with the work: the next row is offered", nudges(record)[-1], "todo 2 next")

done()
