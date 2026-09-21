import time

from controllers.types import Docs
from features.designs.controller import Designs
from resources.base import AGENT, USER
from tests.conftest import fresh, refused


def test_edits_change_the_open_revision_and_a_kept_one_never_changes():
    record = fresh()
    mine, theirs = Designs(record, actor=AGENT), Designs(record, actor=USER)
    design = mine.create("How handlers are written", abstract="the first idea")
    mine.section(design.n, "Goals", "one")
    theirs.section(design.n, "Goals", "two")
    assert len(mine.load(design.n).revisions) == 1, "while the revision is open, edits change it in place"
    assert mine.revision(design.n, 1).data["change"] == "written; added Goals; rewrote Goals", "its note collects what changed"

    theirs.keep(design.n)
    assert "already kept" in refused(lambda: theirs.keep(design.n)), "a kept revision is kept once"
    mine.update(design.n, title="How handlers and events are written")
    mine.cut(design.n, "Goals")
    now = mine.load(design.n)
    assert (now.title, now.sections, len(now.revisions)) == ("How handlers and events are written", [], 2), "the next edit opens a new revision"
    kept = mine.revision(design.n, 1)
    assert (kept.title, [s["body"] for s in kept.sections], kept.seen) == ("How handlers are written", ["two"], [AGENT, USER]), "the kept revision stays as it was"

    mine.stamp(design.n, open_until=time.time() - 1)
    mine.section(design.n, "Scope", "all")
    assert len(mine.load(design.n).revisions) == 3, "an open revision left alone long enough is kept by itself"

    docs = Docs(record, actor=USER)
    assert [(d.data["revision"], d.data["part_of"]) for d in docs.all()] == [(3, design.ref)], "the design is listed among the docs once, as its latest revision"
    assert docs.search("two") == [], "an earlier revision is read through its design, never found on its own"
    assert [r.title for r in mine.search("events")] == ["How handlers and events are written"], "the design itself is found"
