"""Typed resources and their repositories: every store read the same way."""
from __future__ import annotations

import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import testkit  # noqa: E402,F401  (removes this suite's temporary folders when it exits)

import docs, inbox, pins, questions, reminders, state, todo, tracks, work  # noqa: E401,E402
from resources import (Claim, Doc, Docs, Messages, Part, Pins, Query, Question, Questions, Reminder, Reminders,  # noqa: E402
                       Rule, Rules, Todo, Todos, WorkLog)

ok = fail = 0
AT = "2026-09-13T10:00:00+00:00"


def check(what, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {what}\n       got  {got!r}\n       want {want!r}")


project = Path(tempfile.mkdtemp())
root = project / ".journal"
root.mkdir(parents=True)
tracks.create(root, "alpha", "beta", at=AT)
state.use_track("alpha")

todo.add(root, "alpha", "first", "the first brief", AT)
todo.add(root, "alpha", "second", "", AT)
todo.add(root, "alpha", "third", "", AT)
todo.priority(root, "alpha", 3, "high")
todo.after(root, "alpha", 2, "1")
todo.done(root, "alpha", 1, "dropped: not needed", AT)
pins.add(root, "a fact on alpha", AT, 400, long="why it holds")
pins.add(root, "a stale fact", AT, 400)
pins.strike(root, 2, "it went stale")
pins.add(root, "a rule", AT, 400, key=pins.RULES)
reminders.add(root, "say hello", AT, 200, until="they answer")
questions.add(root, "which colour?", AT, ["todo 2"], track="alpha")
questions.add(root, "which size?", AT, [], track="alpha")
questions.answer(root, 1, "blue", AT, track="alpha")
inbox.add(root, "a message", AT, track="alpha")
work.start(root, "something", AT)
docs.add(root, "a design", "the abstract", "the body", "alpha")
docs.part(root, "1", "a report", "part body", "alpha")

# ------------------------------------------------------------------ to-dos
todos = Todos(root, "alpha")
every = todos.all()
check("all() returns typed to-dos, numbered by their own number", ([type(t) for t in every], [t.n for t in every]),
      ([Todo, Todo, Todo], [1, 2, 3]))
first = todos.find(1)
check("find() loads the brief and types the fields", (first.title, first.body.strip(), first.closed, first.dropped),
      ("first", "the first brief", True, True))
check("after and priority come back as numbers", (todos.find(2).after, todos.find(3).priority > todos.find(2).priority),
      ([1], True))
check("a missing number is None", (todos.find(9), todos.exists(9), todos.exists(2)), (None, False, True))
check("where() filters by a test or by equal fields",
      ([t.n for t in todos.query().where(lambda t: not t.closed)], [t.n for t in todos.query().where(title="third")]),
      ([2, 3], [3]))
check("order_by() sorts by any sortable field, either direction",
      ([t.n for t in todos.query().order_by("priority", "desc")][:1], [t.n for t in todos.query().order_by("n", "desc")]),
      ([3], [3, 2, 1]))
try:
    todos.query().order_by("body")
    check("sorting by a field that is not sortable is refused", False, True)
except ValueError as e:
    check("sorting by a field that is not sortable is refused, naming what it can sort by",
          ("priority" in str(e), "body" in str(e)), (True, True))
page = todos.query().order_by("n").page(2, 1)
check("page() cuts and counts what is left", ([t.n for t in page.rows], page.left, page.total), ([1, 2], 1, 3))
check("an empty environment has no to-dos", Todos(root, "beta").all(), [])

# ------------------------------------------------------------------ pins and rules
alpha_pins = Pins(root, "alpha")
check("pins are claims, struck ones keep their number",
      ([(type(p), p.n, p.standing) for p in alpha_pins.all()]), [(Claim, 1, True), (Claim, 2, False)])
check("a pin's reasoning is read through its repository", alpha_pins.reasoning(1).strip(), "why it holds")
check("beta sees none of alpha's pins", Pins(root, "beta").all(), [])
check("rules belong to the project, whatever environment is asked",
      ([(type(r), r.fact) for r in Rules(root, "beta").all()]), [(Rule, "a rule")])

# ------------------------------------------------------------------ reminders, questions, messages, work
got = Reminders(root, "alpha").query().first()
check("a reminder, typed", (type(got), got.text, got.until, got.standing), (Reminder, "say hello", "they answer", True))
qs = Questions(root, "alpha")
check("questions carry their links, answer and status",
      [(type(q), q.n, q.links, q.answer, q.status) for q in qs.all()],
      [(Question, 1, ["todo:2"], "blue", "answered"), (Question, 2, [], "", "open")])
check("about() finds the questions linked to a resource", [q.n for q in qs.about("todo:2")], [1])
check("open questions sort before answered ones",
      [q.n for q in qs.query().order_by("status_order")], [2, 1])
check("a message is waiting until it is processed",
      [(m.text, m.waiting) for m in Messages(root, "alpha").all()], [("a message", True)])
check("work is typed, open until it ends", [(w.subject, w.open) for w in WorkLog(root, "alpha").all()],
      [("something", True)])

# ------------------------------------------------------------------ docs and their parts
design = Docs(root).find(1)
check("a doc, with its parts typed", (type(design), design.title, [(type(p), p.n, p.title) for p in design.parts]),
      (Doc, "a design", [(Part, 1, "a report")]))
check("a doc's parts are a repository of their own",
      [(p.n, p.body.strip()) for p in Docs(root).parts(1).all()], [(1, "part body")])
check("Docs.on() is the docs an environment sees", ([d.n for d in Docs(root).on("alpha")], [d.n for d in Docs(root).on("beta")]),
      ([1], []))
check("a query is iterable and counts", (isinstance(Docs(root).query(), Query), Docs(root).query().count()), (True, 1))

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
