import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[4]))
from v2 import features  # noqa: E402
from v2.controllers.types import CONTROLLERS  # noqa: E402
from v2.resources.base import AGENT, SYSTEM, USER  # noqa: E402
from v2.tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

# WORK STARTED FOR A TO-DO links the two and marks the row started, as SYSTEM
record = fresh()
todos = CONTROLLERS["todo"](record, actor=USER)
works = CONTROLLERS["work"](record, actor=AGENT)
todo = todos.create("a row to work")
work = works.create("the work for it", todo=todo.n)
check("work created for a to-do: linked to it", works.load(work.n).refs, [todo.ref])
check("the to-do says it is started, and by which work", (todos.load(todo.n).data.get("status"), todos.load(todo.n).data.get("work")), ("started", work.n))
check("the link and the status were the feature's acts, as SYSTEM", [(e.type, e.action, e.actor) for e in record.events()][2:],
      [("work", "linked", SYSTEM), ("todo", "updated", SYSTEM)])

# WORK ENDED closes the row only when told to
works.complete(work.n, "done")
check("work ended without --todo: the row stays open", todos.load(todo.n).completed, 0.0)
work2 = works.create("again", todo=todo.n)
works.complete(work2.n, "done", todo=True)
check("work ended --todo: the row is completed by SYSTEM, citing the work", (bool(todos.load(todo.n).completed), record.events()[-1].actor, record.events()[-1].data["how"]),
      (True, SYSTEM, f"work {work2.n} ended"))
work3 = works.create("once more", todo=todo.n)
works.complete(work3.n, "done", todo=True)
check("a row already complete is left alone", [e.action for e in record.events() if e.type == "todo"].count("completed"), 1)
plain = works.create("work with no to-do")
check("work with no to-do: the feature does nothing", [e for e in record.events() if e.n == plain.n and e.type == "work"][-1].action, "created")

# SWITCHED OFF per environment
record = fresh()
record.set_setting("features", {"work": False})
todo = CONTROLLERS["todo"](record, actor=USER).create("a row")
work = CONTROLLERS["work"](record, actor=AGENT).create("work", todo=todo.n)
check("work switched off: nothing is linked", CONTROLLERS["work"](record).load(work.n).refs, [])

done()
