import tempfile
from pathlib import Path

from controllers.types import Connections, Docs, Reports, Tools
from resources.base import AGENT, USER
from tests.conftest import fresh, refused


def test_a_doc_holds_parts_as_sections_an_attachment_beside_them_and_is_found_by_name_or_number():
    record = fresh()
    docs = Docs(record, actor=AGENT)

    d = docs.create("The engine, the loop from A to Z", abstract="what each piece is", brief="Four parts.")
    docs.section(d.n, "The pieces", "supervisor, driver, agent, record")
    docs.section(d.n, "Where it lives", "v2/")
    shot = Path(tempfile.mkdtemp()) / "design.png"
    shot.write_bytes(b"png")
    docs.attach(d.n, str(shot), "the approved mockup")
    assert ([s["title"] for s in docs.load(d.n).sections], docs.files(d.n), docs.load(d.n).data["files"]) == \
        (["The pieces", "Where it lives"], ["design.png"], {"design.png": "the approved mockup"}), \
        "parts and an attachment, said what it is"
    assert docs.named("complete") == "final", "final is the doc's complete"
    assert (docs.find("1").n, docs.find("loop from A").n) == (1, 1), "by number or a unique part of the title"

    docs.create("The engine tests")
    assert refused(lambda: docs.find("engine")) == "2 docs match 'engine'; say more of the title", \
        "an ambiguous name is refused, saying so"
    assert refused(lambda: docs.find("kitchen")) == "no docs match 'kitchen'", "no match is refused"
    assert ([r.n for r in docs.search("supervisor")], [r.n for r in docs.search("four parts")]) == ([1], [1]), \
        "search reaches titles, briefs and parts"

    newer = docs.create("The engine, the loop rewritten", supersedes=d.n)
    assert (docs.load(d.n).outcome, newer.refs) == (f"superseded by doc {newer.n}", [d.ref]), \
        "superseded: the old is closed saying by which, the new links it"


def test_a_report_becomes_a_doc_when_it_turns_out_to_be_one():
    record = fresh()
    reports = Reports(record, actor=AGENT)
    r = reports.create("what the four agents found", abstract="asked to review", brief="findings")
    reports.section(r.n, "Fine", "the record")
    made = reports.doc(r.n)
    assert (made.title, made.brief, [s["title"] for s in made.sections], reports.load(r.n).outcome) == \
        ("what the four agents found", "findings", ["Fine"], f"became doc {made.n}"), \
        "the doc carries the report's words and parts; the report is archived saying so"
    assert reports.named("complete") == "archive", "archive is the report's complete"


def test_tools_run_from_the_project_root_connections_name_a_variable_never_a_token():
    record = fresh()
    tools = Tools(record, actor=AGENT)
    t = tools.create("say hello", abstract="prints its arguments", entry="printf %s", usage="journal tool 1 run <words>")
    assert tools.run(t.n, "hi")["out"] == "hi", "a tool runs its entry with the arguments given"
    assert refused(lambda: tools.create("bad", entry=3)) == "entry is a text", "a tool's entry is text"
    c = Connections(record, actor=USER).create("Sentry", variable="SENTRY_TOKEN")
    assert c.data == {"variable": "SENTRY_TOKEN"}, "a connection holds the variable's name"
