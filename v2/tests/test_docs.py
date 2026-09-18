import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from v2.controllers.types import CONTROLLERS  # noqa: E402
from v2.resources.base import AGENT, USER  # noqa: E402
from v2.tests.kit import check, done, fresh  # noqa: E402


def refused(fn):
    try:
        fn()
        return ""
    except Exception as e:
        return str(e)


record = fresh()
docs = CONTROLLERS["doc"](record, actor=AGENT)

# A DOC: parts as sections, attachments beside them, final as its complete, found by name or number
d = docs.create("The engine, the loop from A to Z", abstract="what each piece is", brief="Four parts.")
docs.section(d.n, "The pieces", "supervisor, driver, agent, record")
docs.section(d.n, "Where it lives", "v2/")
shot = Path(tempfile.mkdtemp()) / "design.png"
shot.write_bytes(b"png")
docs.attach(d.n, str(shot), "the approved mockup")
check("parts and an attachment, said what it is", ([s["title"] for s in docs.load(d.n).sections], docs.files(d.n), docs.load(d.n).data["files"]), (["The pieces", "Where it lives"], ["design.png"], {"design.png": "the approved mockup"}))
check("final is the doc's complete", docs.named("complete"), "final")
check("by number or a unique part of the title", (docs.find("1").n, docs.find("loop from A").n), (1, 1))
docs.create("The engine tests")
check("an ambiguous name is refused, saying so", refused(lambda: docs.find("engine")), "2 docs match 'engine'; say more of the title")
check("no match is refused", refused(lambda: docs.find("kitchen")), "no docs match 'kitchen'")
check("search reaches titles, briefs and parts", ([r.n for r in docs.search("supervisor")], [r.n for r in docs.search("four parts")]), ([1], [1]))

# SUPERSEDING: the new one links the old, the old is final with the why
newer = docs.create("The engine, the loop rewritten", supersedes=d.n)
check("superseded: the old is closed saying by which, the new links it", (docs.load(d.n).outcome, newer.refs), (f"superseded by doc {newer.n}", [d.ref]))

# A REPORT becomes a doc when it turns out to be one
reports = CONTROLLERS["report"](record, actor=AGENT)
r = reports.create("what the four agents found", abstract="asked to review", brief="findings")
reports.section(r.n, "Fine", "the record")
made = reports.doc(r.n)
check("the doc carries the report's words and parts; the report is archived saying so", (made.title, made.brief, [s["title"] for s in made.sections], reports.load(r.n).outcome), ("what the four agents found", "findings", ["Fine"], f"became doc {made.n}"))
check("archive is the report's complete", reports.named("complete"), "archive")

# TOOLS run from the project root; CONNECTIONS name a variable, never a token
tools = CONTROLLERS["tool"](record, actor=AGENT)
t = tools.create("say hello", abstract="prints its arguments", entry="printf %s", usage="journal tool 1 run <words>")
check("a tool runs its entry with the arguments given", tools.run(t.n, "hi")["out"], "hi")
check("a tool's entry is text", refused(lambda: tools.create("bad", entry=3)), "entry is a text")
c = CONTROLLERS["connection"](record, actor=USER).create("Sentry", variable="SENTRY_TOKEN")
check("a connection holds the variable's name", c.data, {"variable": "SENTRY_TOKEN"})

done()
