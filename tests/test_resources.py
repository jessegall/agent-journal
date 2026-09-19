import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from controllers.types import CONTROLLERS, Comments  # noqa: E402
from engine.record import Record  # noqa: E402
from resources.base import ABSTRACT_MAX, TITLE_MAX, ACTIONS  # noqa: E402
from resources.types import TYPES  # noqa: E402
from tests.kit import check, done, refused as kit_refused  # noqa: E402



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
    others = [x.n for x in c.all() if x.n > 2]                    # a comment's record also holds the comments made above
    c.delete(1, "no longer needed")
    check(f"{type_}: deleted is soft — gone from the list, still on disk", ([x.n for x in c.all()], c.show(1).deleted > 0), ([2] + others, True))
    c.restore(1)
    c.force_delete(2)
    check(f"{type_}: force delete removes the file", ([x.n for x in c.all()], refused(lambda: c.show(2))), ([1] + others, True))

for type_ in TYPES:                                                 # every type emits the same six actions, no more
    mine = [e for e in records[type_].events() if e.type == type_]
    expected = set(ACTIONS) - ({"completed"} if type_ == "environment" else set())
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
check("rules, docs, tools, style and connections are the project's", sorted(n for n, t in TYPES.items() if t.scope == PROJECT), ["connection", "doc", "environment", "rule", "style", "tool"])
check("every scope is one of the two", {t.scope for t in TYPES.values()} <= {ENVIRONMENT, PROJECT}, True)

done()
