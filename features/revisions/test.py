import time

from controllers.types import Docs
from resources.base import AGENT, USER
from tests.conftest import fresh, refused


def test_edits_change_the_open_revision_and_a_kept_one_never_changes():
    record = fresh()
    mine, theirs = Docs(record, actor=AGENT), Docs(record, actor=USER)
    doc = mine.create("How handlers are written", abstract="the first idea")
    mine.section(doc.n, "Goals", "one")
    theirs.section(doc.n, "Goals", "two")
    assert mine.load(doc.n).data["revisions"] == 1, "while the revision is open, edits change it in place"
    assert mine.action("revision")(doc.n, 1).data["change"] == "written; added Goals; rewrote Goals", "its note collects what changed"

    theirs.action("keep")(doc.n)
    assert "already kept" in refused(lambda: theirs.action("keep")(doc.n)), "a kept revision is kept once"
    mine.update(doc.n, title="How handlers and events are written")
    mine.action("cut")(doc.n, "Goals")
    now = mine.load(doc.n)
    assert (now.title, now.sections, now.data["revisions"]) == ("How handlers and events are written", [], 2), "the next edit opens a new revision"
    kept = mine.action("revision")(doc.n, 1)
    assert (kept.title, [s["body"] for s in kept.sections]) == ("How handlers are written", ["two"]), "the kept revision stays as it was"

    mine.stamp(doc.n, open_until=time.time() - 1)
    mine.section(doc.n, "Scope", "all")
    assert mine.load(doc.n).data["revisions"] == 3, "an open revision left alone long enough is kept by itself"
    assert [len(line.split()) > 3 for line in mine.action("revisions")(doc.n)] == [True] * 3, "every revision is listed with its note"

    assert [d.n for d in theirs.all()] == [doc.n], "the doc is listed once, never its revisions"
    assert mine.create("the next doc").n == doc.n + 1, "revisions never take a doc number"
    assert theirs.search("two") == [], "an earlier revision is read through its doc, never found on its own"
    assert "has revisions 1 to 3" in refused(lambda: mine.action("revision")(doc.n, 4)), "a revision out of range is refused"
