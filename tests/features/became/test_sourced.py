import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Docs, Reports  # noqa: E402
from features.plans.controller import Plans  # noqa: E402
from resources.base import AGENT  # noqa: E402
from tests.features.kit import nudges, report  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()


def said(record):
    return [n for n in nudges(record) if "cites nothing" in n]


# A PLAN BUILT ON A REPORT the agent just read, citing none of it, is named back to it
record = fresh()
report(record, "working", "PreToolUse")
source = Reports(record, actor=AGENT).create("what the audit found")
Reports(record, actor=AGENT).read(source.n)
plan = Plans(record, actor=AGENT).create("the plan it led to", goal="g")
check("the plan cites nothing, so the agent is told which link to make", said(record), [f"plan {plan.n} cites nothing it was built on"])
cited = Plans(record, actor=AGENT).create("one that cites its source", goal="g", about=source.ref)
check("one that cites the report is left alone", [n for n in said(record) if f"plan {cited.n}" in n], [])

# NOTHING READ LATELY: nothing said
quiet = fresh()
report(quiet, "working", "PreToolUse")
Plans(quiet, actor=AGENT).create("a plan out of nowhere", goal="g")
check("with nothing read there is nothing to cite", said(quiet), [])

# A DOC counts as a source too
also = fresh()
report(also, "working", "PreToolUse")
doc = Docs(also, actor=AGENT).create("what stays true")
Docs(also, actor=AGENT).read(doc.n)
made = Plans(also, actor=AGENT).create("built on the doc", goal="g")
check("a doc read just now is offered as the source", said(also), [f"plan {made.n} cites nothing it was built on"])

done()
