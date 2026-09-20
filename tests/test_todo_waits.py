import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from controllers.types import Plans, Todos  # noqa: E402
from features.work.next import ready  # noqa: E402
from migrations import m0005_todo_waits  # noqa: E402
from resources.base import AGENT, USER  # noqa: E402
from tests.kit import check, done, fresh, refused  # noqa: E402

record = fresh()
todos = Todos(record, actor=AGENT)
first, second, third = (todos.create(t) for t in ("first", "second", "third"))

# A TO-DO WAITS ON ANOTHER: it stays out of the next pick and says so
todos.after(second.n, str(first.n))
check("the waiting to-do names what it waits on", todos.load(second.n).after, [first.ref])
check("it stays out of the next pick while the other is open", [t.n for t in ready(record)], [first.n, third.n])
check("the list marks it", todos.mark(todos.load(second.n)), f"  [waits on todo {first.n}]")
todos.complete(first.n, "done")
check("once the other is done it is picked again", [t.n for t in ready(record)], [second.n, third.n])

# OR ON A PLAN: it waits until the plan is done or abandoned
plan = Plans(record, actor=AGENT).create("The plan")
todos.after(third.n, f"plan:{plan.n}")
check("a to-do can wait on a plan", (todos.waits(todos.load(third.n)), [t.n for t in ready(record)]), ([plan.ref], [second.n]))
Plans(record, actor=AGENT).abandon(plan.n, "not needed")
check("an ended plan releases it", todos.waits(todos.load(third.n)), [])

# WAITS ARE CHECKED: no self, no cycle, no missing target, and --off takes one back
check("a to-do cannot wait on itself", refused(lambda: todos.after(second.n, str(second.n))), f"todo {second.n} waiting on todo:{second.n} would wait on itself")
fourth = todos.create("fourth")
todos.after(fourth.n, str(third.n))
check("nor on something that waits on it", refused(lambda: todos.after(third.n, str(fourth.n))), f"todo {third.n} waiting on todo:{fourth.n} would wait on itself")
check("a missing target is refused", refused(lambda: todos.after(fourth.n, "99")), "no todo 99")
check("only to-dos and plans are waited on", refused(lambda: todos.after(fourth.n, "doc:1")), "a to-do waits on another to-do or a plan: a number, todo:<n> or plan:<n>")
todos.after(fourth.n, str(third.n), off=True)
check("--off takes a wait back", todos.load(fourth.n).after, [])

# A BLOCK WITH A REASON is marked too
todos.block(fourth.n, "needs the API key")
check("a blocked to-do shows why", todos.mark(todos.load(fourth.n)), "  [blocked: needs the API key]")

# THE MIGRATION moves old to-do links into waits
old = fresh("old")
legacy = Todos(old, actor=USER)
a, b = legacy.create("a"), legacy.create("b")
legacy.link(b.n, a.ref)
m0005_todo_waits.run(old.root)
moved = legacy.load(b.n)
check("an old link to a to-do becomes a wait", (moved.after, a.ref in moved.refs), ([a.ref], False))

# A ROW OF ANOTHER TYPE, listed through a to-do, is left unmarked
note = todos.comment(second.n, "a note")
check("a comment listed under a to-do is not marked", todos.mark(note), "")

done()
