from controllers.types import Plans, Todos
from features.auto.next import ready
from migrations import m0005_todo_waits
from resources.base import AGENT, USER
from tests.conftest import fresh, refused


def test_a_todo_waits_on_another_a_plan_and_the_checks_around_it():
    record = fresh()
    todos = Todos(record, actor=AGENT)
    first, second, third = (todos.create(t) for t in ("first", "second", "third"))

    todos.after(second.n, str(first.n))
    assert todos.load(second.n).after == [first.ref], "the waiting to-do names what it waits on"
    assert [t.n for t in ready(record)] == [first.n, third.n], "it stays out of the next pick while the other is open"
    assert todos.mark(todos.load(second.n)) == f"  [waits on todo {first.n}]", "the list marks it"
    todos.complete(first.n, "done")
    assert [t.n for t in ready(record)] == [second.n, third.n], "once the other is done it is picked again"

    plan = Plans(record, actor=AGENT).create("The plan")
    todos.after(third.n, f"plan:{plan.n}")
    assert (todos.waits(todos.load(third.n)), [t.n for t in ready(record)]) == ([plan.ref], [second.n]), "a to-do can wait on a plan"
    Plans(record, actor=AGENT).abandon(plan.n, "not needed")
    assert todos.waits(todos.load(third.n)) == [], "an ended plan releases it"

    assert refused(lambda: todos.after(second.n, str(second.n))) == f"todo {second.n} waiting on todo:{second.n} would wait on itself", \
        "a to-do cannot wait on itself"
    fourth = todos.create("fourth")
    todos.after(fourth.n, str(third.n))
    assert refused(lambda: todos.after(third.n, str(fourth.n))) == f"todo {third.n} waiting on todo:{fourth.n} would wait on itself", \
        "nor on something that waits on it"
    assert refused(lambda: todos.after(fourth.n, "99")) == "no todo 99", "a missing target is refused"
    assert refused(lambda: todos.after(fourth.n, "doc:1")) == "a to-do waits on another to-do or a plan: a number, todo:<n> or plan:<n>", \
        "only to-dos and plans are waited on"
    todos.after(fourth.n, str(third.n), off=True)
    assert todos.load(fourth.n).after == [], "--off takes a wait back"

    todos.block(fourth.n, "needs the API key")
    assert todos.mark(todos.load(fourth.n)) == "  [blocked: needs the API key]", "a blocked to-do shows why"

    old = fresh("old")
    legacy = Todos(old, actor=USER)
    a, b = legacy.create("a"), legacy.create("b")
    legacy.link(b.n, a.ref)
    m0005_todo_waits.run(old.root)
    moved = legacy.load(b.n)
    assert (moved.after, a.ref in moved.refs) == ([a.ref], False), "an old link to a to-do becomes a wait"

    note = todos.comment(second.n, "a note")
    assert todos.mark(note) == "", "a comment listed under a to-do is not marked"
