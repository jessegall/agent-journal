from controllers.types import Docs
from features.designs.controller import Designs
from resources.base import AGENT, USER
from tests.conftest import fresh


def test_every_edit_is_a_revision_and_the_earlier_ones_stay_as_they_were():
    record = fresh()
    mine, theirs = Designs(record, actor=AGENT), Designs(record, actor=USER)
    design = mine.create("How handlers are written", abstract="the first idea")
    mine.section(design.n, "Goals", "one")
    theirs.section(design.n, "Goals", "two")
    mine.update(design.n, title="How handlers and events are written")
    mine.cut(design.n, "Goals")

    now = mine.load(design.n)
    assert (now.title, now.sections, len(now.revisions)) == ("How handlers and events are written", [], 5), "the design reads as it stands now"
    kept = [(r.title, [s["body"] for s in r.sections], r.data["change"], r.seen[0]) for r in (mine.revision(design.n, k) for k in range(1, 6))]
    assert kept == [("How handlers are written", [], "written", AGENT),
                    ("How handlers are written", ["one"], "added Goals", AGENT),
                    ("How handlers are written", ["two"], "rewrote Goals", USER),
                    ("How handlers and events are written", ["two"], "reworded the top", AGENT),
                    ("How handlers and events are written", [], "cut Goals", AGENT)], "each revision is a copy, never changed after"

    docs = Docs(record, actor=USER)
    assert (docs.all(), docs.search("two"), docs.unread()) == ([], [], []), "the revisions are read through their design, never listed or found as docs"
    assert [r.title for r in mine.search("events")] == ["How handlers and events are written"], "the design itself is found"
