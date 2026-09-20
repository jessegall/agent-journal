import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from controllers.types import CONTROLLERS, Comments, Todos  # noqa: E402
from engine.record import Record  # noqa: E402
from resources.base import ABSTRACT_MAX, ACTORS, AGENT, PLUGIN, TITLE_MAX, ACTIONS, USER  # noqa: E402
from resources.types import TYPES  # noqa: E402
from tests.kit import check, done, fresh, refused as kit_refused  # noqa: E402



def refused(call) -> bool:
    return bool(kit_refused(call))


records = {}

for type_ in TYPES:                                                 # the data provider: every resource type, its own record
    record = records[type_] = Record(Path(tempfile.mkdtemp()) / ".journal", "main")
    c = CONTROLLERS[type_](record)
    r = c.create(f"a {type_} to keep", abstract="one short line about it", brief="as long as it needs to be\n\nwith paragraphs")
    check(f"{type_}: created as number 1 with its three texts", (r.n, r.title, r.abstract, r.brief.split("\n")[0]),
          (1, f"a {type_} to keep", "one short line about it", "as long as it needs to be"))
    check(f"{type_}: read back from its file unchanged", c.show(1).dump(), r.dump())
    check(f"{type_}: a title past {TITLE_MAX} characters is refused", refused(lambda: c.create("x" * (TITLE_MAX + 1))), True)
    check(f"{type_}: a title with a colon is refused", refused(lambda: c.create("the thing: explained")), True)
    check(f"{type_}: an abstract past {ABSTRACT_MAX} characters is refused",
          refused(lambda: c.create("fine", abstract="y" * (ABSTRACT_MAX + 1))), True)
    if type_ == "work":                                             # one piece of work is in hand at a time
        c.update(1, parked="set aside for the next check")
    long = c.create("fine", brief="z" * 50_000)
    check(f"{type_}: the brief is unlimited", len(c.show(long.n).brief), 50_000)
    c.section(1, "Why", "because")
    note = c.comment(1, "a note")
    c.link(1, "todo:9")
    got = c.show(1)
    check(f"{type_}: a section and a link stick, and a comment is a resource of its own on it",
          (got.sections, got.refs, note.type, note.refs[0], [x.title for x in c.comments(1)]),
          ([{"title": "Why", "body": "because"}], ["todo:9"], "comment", f"{type_}:1", ["a note"]))
    if type_ == "comment":
        check("comment: commenting on a comment is the same act", note.refs[0], "comment:1")
    reply = Comments(record).comment(note.n, "a comment on the comment")
    check(f"{type_}: a comment can have a comment", (reply.refs[0], [x.title for x in Comments(record).comments(note.n)]),
          (f"comment:{note.n}", ["a comment on the comment"]))
    c.complete(1, "finished")
    if type_ == "environment":
        check("environment: remove is terminal and physical", (refused(lambda: c.show(1)), refused(lambda: c.complete(1))), (True, True))
        continue
    check(f"{type_}: completed is the final phase, marked once", (c.show(1).completed > 0, refused(lambda: c.complete(1))), (True, True))
    c.reopen(1, "closed too soon")
    check(f"{type_}: reopening puts it back with no outcome", (c.show(1).completed, c.show(1).outcome), (0.0, ""))
    c.complete(1, "finished")
    others = [x.n for x in c.all() if x.n > 2]                    # a comment's record also holds the comments made above
    c.delete(1, "no longer needed")
    check(f"{type_}: deleted is soft — gone from the list, still on disk", ([x.n for x in c.all()], c.show(1).deleted > 0), ([2] + others, True))
    c.restore(1)
    c.force_delete(2)
    check(f"{type_}: force delete removes the file", ([x.n for x in c.all()], refused(lambda: c.show(2))), ([1] + others, True))

for type_ in TYPES:                                                 # every type emits the same six actions, no more
    mine = [e for e in records[type_].events() if e.type == type_]
    expected = set(ACTIONS) - ({"completed", "reopened"} if type_ == "environment" else set())
    check(f"{type_}: every action left an event, and only its terminal actions", sorted({e.action for e in mine}), sorted(expected))
    check(f"{type_}: an event says who did it and what it is about", (mine[0].actor, mine[0].ref), ("user", f"{type_}:1"))

# SCOPE: a project resource is one for every environment; an environment's is its own
from engine.record import Record  # noqa: E402
from resources.base import ENVIRONMENT, PROJECT  # noqa: E402
root = Path(tempfile.mkdtemp())
here, there = Record(root, "here"), Record(root, "there")
for type_ in TYPES:
    made = CONTROLLERS[type_](here).create("shared" if TYPES[type_].scope == PROJECT else "own")
    seen_there = [r.title for r in CONTROLLERS[type_](there).all()]
    if TYPES[type_].scope == PROJECT:
        check(f"{type_}: project scope, listed from every environment, filed under the root", (seen_there, CONTROLLERS[type_](here).path(1).parent.parent), (["shared"], root))
    else:
        check(f"{type_}: environment scope, its own", (seen_there, CONTROLLERS[type_](here).path(1).parent.parent.parent), ([], root / "environments"))
check("rules, docs, tools, style, plugins and connections are the project's", sorted(n for n, t in TYPES.items() if t.scope == PROJECT), ["connection", "doc", "environment", "plugin", "rule", "style", "tool"])
check("every scope is one of the two", {t.scope for t in TYPES.values()} <= {ENVIRONMENT, PROJECT}, True)

# NUMBERS PAST 999 are listed and counted on, never overwritten
record = Record(Path(tempfile.mkdtemp()) / ".journal", "main")
todos = CONTROLLERS["todo"](record)
for i in range(1, 1003):
    todos.create(f"row {i}")
rows = todos.all()
check("the thousandth row and those after it are listed, each its own", (len(rows), [r.n for r in rows][-3:], rows[-1].title), (1002, [1000, 1001, 1002], "row 1002"))

# THE PLUGIN ACTOR writes like any other, and its events say so
record = fresh()
made = Todos(record, actor=PLUGIN).create("filed by a plugin")
check("a plugin writes as itself", (made.seen, [e.actor for e in record.events() if e.type == "todo"][-1]), ([PLUGIN], PLUGIN))
check("and it is one of the actors the manifest offers", PLUGIN in ACTORS, True)

# A ROW BEING WRITTEN is never half a row to whoever is reading it
import threading  # noqa: E402
racing = Todos(fresh(), actor=AGENT)
row = racing.create("read me while I am written")
trouble = []


def rewrite():
    for i in range(200):
        racing.update(row.n, brief="x" * (i % 97) * 40)


def reread():
    for _ in range(200):
        try:
            racing.load(row.n)
        except Exception as e:
            trouble.append(repr(e))


writer = threading.Thread(target=rewrite)
reader = threading.Thread(target=reread)
writer.start(), reader.start()
writer.join(), reader.join()
check("two hundred reads during two hundred writes see a whole row every time", trouble, [])

# WHAT COMPLETING A ROW IS TOLD is kept on the row, not only on the event
rows = Todos(fresh(), actor=AGENT)
struck = rows.strike(rows.create("abandon me").n, "it stopped being worth doing")
check("a struck row says so on the row itself, with its why", (struck.data.get("struck"), struck.outcome), (True, "struck: it stopped being worth doing"))
closed = rows.complete(rows.create("close me").n, "done", handed="the other agent")
check("anything else set while completing is kept too", closed.data.get("handed"), "the other agent")

# A ROW CLOSED BY MISTAKE is put back, with the reason on the record
record = fresh()
rows = Todos(record, actor=USER)
row = rows.create("a row closed too soon")
check("a row that is open cannot be reopened", "is not done" in kit_refused(lambda: rows.reopen(row.n, "x")), True)
rows.complete(row.n, "closed by a commit trailer that named the wrong number")
back = rows.reopen(row.n, "the trailer named a plan row, not this work")
check("it is open again with no outcome", (bool(back.completed), back.outcome), (False, ""))
check("and the record says it was reopened and why",
      [(e.action, e.data.get("why")) for e in record.events() if e.type == "todo"][-1],
      ("reopened", "the trailer named a plan row, not this work"))
rows.delete(row.n, "archived")
check("an archived row is restored before it is reopened", "archived" in kit_refused(lambda: rows.reopen(row.n, "x")), True)

done()
