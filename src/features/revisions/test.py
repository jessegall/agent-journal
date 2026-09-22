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


def test_moving_a_real_record_into_doc_folders_keeps_every_doc_file_and_revision(tmp_path):
    import shutil
    from pathlib import Path
    from engine.record import Record
    from migrations.m0024_docs_in_folders import run
    real = Path(__file__).resolve().parents[2] / ".journal" / "project" / "doc"
    if not real.is_dir() or not list(real.glob("[0-9]*.md")):
        return
    docs = tmp_path / "project" / "doc"
    shutil.copytree(real, docs)
    before = {p.stem: p.read_text() for p in docs.glob("[0-9]*.md")}
    revisions = {(p.parent.name, p.name): p.read_text() for p in docs.glob("revisions/*/*.md")}
    files = {p.relative_to(docs).as_posix() for p in docs.glob("[0-9]*/*") if p.is_file()}
    run(tmp_path)
    assert {n: (docs / n / "doc.md").read_text() for n in before} == before, "every doc is kept word for word in its folder"
    assert {(n, k): (docs / n / "revisions" / k).read_text() for n, k in revisions} == revisions, "every revision moves under its doc"
    assert files <= {p.relative_to(docs).as_posix() for p in docs.glob("[0-9]*/*") if p.is_file()}, "every attachment stays where it was"
    (tmp_path / "environments" / "main").mkdir(parents=True)
    def readable(text):
        try:
            return bool(Docs.resource.load(text).title)
        except (ValueError, TypeError):
            return False
    docs_ = Docs(Record(tmp_path, "main"), actor=USER)
    assert sorted(f"{n:03d}" for n in docs_.numbers() if readable(docs_._text(n))) == sorted(n for n, text in before.items() if readable(text)), \
        "the store reads every moved doc back by its number, as readable as it was"
