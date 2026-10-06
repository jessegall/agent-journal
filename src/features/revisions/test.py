import time

from controllers.types import Docs, Features
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


def test_old_documents_that_ask_nothing_are_made_final_by_migration():
    from migrations.m0066_finished_docs_are_final import run

    record = fresh()
    docs = Docs(record, actor=AGENT)
    plain = docs.create("Finished old draft", status="draft")
    waiting = docs.create("Waiting old draft", status="", buttons=[{"label": "Yes", "choice": "answer", "say": "Yes"}])
    writing = docs.create("Being written", status="writing", open_until=time.time() + 300)
    own = docs.create("Answered in words", status="draft", buttons=[{"label": "Yes", "choice": "answer", "say": "Yes"}], answered_own="Something else")
    chosen = docs.create("Chosen answer", status="draft", buttons=[{"label": "Yes", "choice": "answer", "say": "Yes"}, {"label": "No", "choice": "answer", "say": "No"}], pressed=["Yes"])
    run(record.root)
    assert (docs.load(plain.n).status, docs.load(waiting.n).status, docs.load(writing.n).status, docs.load(own.n).status, docs.load(chosen.n).status) == ("final", "draft", "writing", "final", "final")


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
    assert sorted(f"{n:03d}" for n in docs_.rows.numbers() if readable(docs_.rows.text(n))) == sorted(n for n, text in before.items() if readable(text)), \
        "the store reads every moved doc back by its number, as readable as it was"


def test_old_designs_and_loose_revision_files_become_docs_and_inner_revisions(tmp_path):
    import shutil
    from engine.record import RESOURCES
    from migrations.m0012_designs_become_docs import run as fold_designs
    from migrations.m0015_revisions_inside_docs import run as move_revisions

    record = fresh()
    root = record.root
    Docs(record, actor=AGENT).create("Already a doc")
    folder = root / RESOURCES / "doc"
    text = (folder / "001" / "doc.md").read_text()
    shutil.rmtree(folder / "001")
    (folder / "001.md").write_text(text)
    design = root / RESOURCES / "design"
    design.mkdir(parents=True)
    (design / "001.md").write_text(text.replace("Already a doc", "An old design"))
    (design / "002.md").write_text("")
    mentions = root / RESOURCES / "todo"
    mentions.mkdir(parents=True, exist_ok=True)
    (mentions / "001.md").write_text("see design:1 for it")
    (mentions / "002.md").write_text("nothing to repoint")
    assert fold_designs(root / "elsewhere") == "no designs to fold into docs", "a record without designs has nothing to fold"
    assert fold_designs(root).startswith("1 designs became docs"), "every design with content becomes a doc"
    assert "An old design" in (folder / "002.md").read_text(), "the design is a doc numbered after the existing ones"
    assert (mentions / "001.md").read_text() == "see doc:2 for it", "a row that pointed at the design points at the doc"
    assert not design.exists(), "the design folder is packed away"

    (folder / "007.md").write_text(text.replace("Already a doc", "Old revision"))
    (folder / "009.md").write_text("")
    (folder / "001.md").write_text(text.replace('"revisions": 1', '"revisions": [7, 8]'))
    assert move_revisions(root).startswith("1 revisions moved inside their docs"), "a revision that exists moves under its doc"
    assert (folder / "revisions" / "001" / "001.md").is_file() and not (folder / "007.md").exists(), "the loose revision file moves under its doc"
    assert move_revisions(tmp_path) == "0 revisions moved inside their docs; 0 files point at the docs now", "a record without docs moves nothing"


def test_upgrades_restore_feature_switches_from_the_old_settings_and_switch_back_on_what_one_turned_off():
    import json
    from migrations.m0006_feature_rows import run as rows_from_settings
    from migrations.m0013_revisions_on import run as revisions_on
    from migrations.m0014_features_back_on import run as back_on

    record = fresh()
    (record.home / "settings.json").write_text(json.dumps({"features": {"old_one": False, "old_two": True, "work_tracking.auto": True}}))
    features = Features(record, actor=AGENT)
    assert rows_from_settings(record.root) == "2 feature rows written from the settings", "a feature switched in the old settings becomes a row; a dotted setting does not"
    assert rows_from_settings(record.root) == "0 feature rows written from the settings", "a feature that has its row is not written twice"
    assert features.on("old_one") is False, "the switch the old settings held is kept"
    features.switch("revisions", False)
    assert revisions_on(record.root) == "revisions switched back on in 1 environments", "an upgrade that left revisions off turns it on"
    assert features.on("revisions"), "the revisions row is on"
    assert revisions_on(record.root) == "revisions switched back on in 0 environments", "revisions already on is left alone"
    assert back_on(record.root) == "no feature was switched off by an upgrade", "nothing marked missing means nothing to restore"
    features.switch("old_two", False)
    features.update(features.rows.every()[0].n, missing=True)
    assert back_on(record.root) == "switched back on: t:old_two", "a feature switched off in the same moment as one marked missing is switched back on"
    assert features.on("old_two"), "the old_two row is on again"


def test_old_doc_files_and_their_revisions_move_into_a_folder_each(tmp_path):
    from migrations.m0024_docs_in_folders import run

    assert run(tmp_path) == "no docs yet", "a project without docs has nothing to move"
    docs = tmp_path / "project" / "doc"
    (docs / "revisions" / "002").mkdir(parents=True)
    (docs / "001.md").write_text("first doc")
    (docs / "index.json").write_text("{}")
    (docs / "revisions" / "002" / "001.md").write_text("a revision of the second doc")
    assert run(tmp_path) == "docs moved into folders of their own: 2", "every doc, with or without a loose file, gets a folder"
    assert (docs / "001" / "doc.md").read_text() == "first doc", "the loose doc file becomes the doc inside its folder"
    assert (docs / "002" / "revisions" / "001.md").read_text() == "a revision of the second doc", "revisions follow their doc"
    assert not (docs / "revisions").exists() and not (docs / "index.json").exists(), "the old revisions folder and index are gone"
