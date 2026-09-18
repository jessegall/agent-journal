import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from v2.controllers.types import CONTROLLERS  # noqa: E402
from v2.engine.record import Record  # noqa: E402
from v2.resources.base import ABSTRACT_MAX, TITLE_MAX, VERBS, Refused  # noqa: E402
from v2.resources.types import TYPES  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


def refused(call) -> bool:
    try:
        call()
    except Refused:
        return True
    return False


record = Record(Path(tempfile.mkdtemp()) / ".journal", "main")

for type_ in TYPES:                                                 # the data provider: every resource type
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
    c.comment(1, "a note")
    c.link(1, "todo:9")
    got = c.show(1)
    check(f"{type_}: a section, a comment and a reference stick", (got.sections, got.comments[0]["text"], got.refs),
          ([{"title": "Why", "body": "because"}], "a note", ["todo:9"]))
    c.delete(1, "no longer needed")
    check(f"{type_}: deleted is soft — gone from the list, still on disk", ([x.n for x in c.list()], c.show(1).deleted > 0), ([2], True))
    c.restore(1)
    c.force_delete(2)
    check(f"{type_}: force delete removes the file", ([x.n for x in c.list()], refused(lambda: c.show(2))), ([1], True))

events = [(e.type, e.verb) for e in record.events()]
check("every action left an event, one of the five verbs", events[:7],
      [("message", "created"), ("message", "created"), ("message", "updated"), ("message", "commented"),
       ("message", "linked"), ("message", "deleted"), ("message", "updated")])
check("an event says who dispatched it and what it is about", (record.events()[0].dispatcher, record.events()[0].ref), ("user", "message:1"))
check("only the five verbs exist", sorted({e.verb for e in record.events()}) <= sorted(VERBS), True)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
