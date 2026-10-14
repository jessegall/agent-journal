# Stays a test: it tests the Docs controller's revision words (keep, cut, revision, revisions, draft) directly, which no registration reaches
import time

from controllers.types import Docs
from resources.base import AGENT, USER
from tests.conftest import fresh, refused


def test_an_open_revision_left_alone_is_kept_and_revisions_are_never_rows_of_their_own():
    record = fresh()
    mine, theirs = Docs(record, actor=AGENT), Docs(record, actor=USER)
    doc = mine.create("How handlers are written", abstract="the first idea")
    mine.section(doc.n, "Goals", "one")
    theirs.section(doc.n, "Goals", "two")
    mine.action("keep")(doc.n)
    mine.update(doc.n, title="How handlers and events are written")
    mine.action("cut")(doc.n, "Goals")
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


def test_documents_start_final_except_when_they_wait_for_an_answer():
    record = fresh()
    docs = Docs(record, actor=AGENT)
    finished = docs.create("Finished guide")
    waiting = docs.create("Choose the design", buttons=[{"label": "Approve", "say": "Approved", "choice": "approval"}])
    assert (finished.status, waiting.status) == ("final", "draft")
    docs.update(waiting.n, pressed=["Approve"])
    assert docs.load(waiting.n).data["pressed"] == ["Approve"]
    docs.draft(finished.n)
    assert docs.load(finished.n).status == "writing", "the draft command marks a document that is still being written"


